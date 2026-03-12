import { KeyValueStore } from "@effect/platform";
import {
  HttpApiBuilder,
  HttpApiClient,
  HttpClient,
  HttpClientRequest,
  HttpMiddleware,
} from "@effect/platform";
import { NodeHttpServer } from "@effect/platform-node";
import { describe, expect, it } from "@effect/vitest";
import { Api } from "@dtpt/core/lib/contracts/api";
import {
  SignupRateLimited,
  SignupRequest,
} from "@dtpt/core/lib/contracts/signup";
import { DatabaseNew } from "@dtpt/core/modules/database-new/service";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { Users } from "@dtpt/core/modules/users/service";
import { Effect, Layer, Ref, Schema } from "effect";

import { PingGroupLayer } from "./group.ping.js";
import { SignupGroupLayer } from "./group.signup.js";
import { SignupWriteRateLimiter } from "./rate-limiter.js";

const encodeJson = Schema.encodeUnknownSync(Schema.parseJson(Schema.Unknown));

const KeyValueStoreLayerTest = KeyValueStore.layerMemory;
const DatabaseNewLayerTest = DatabaseNew.Default;
const UsersLayerTest = Users.Default;
const SubscriptionsLayerTest = Subscriptions.Default;

const makeRateLimiterLayer = (maxAttempts: number) =>
  Layer.scoped(
    SignupWriteRateLimiter,
    Effect.gen(function* () {
      const attemptsRef = yield* Ref.make(new Map<string, number>());

      const use = (identity: string) =>
        Effect.gen(function* () {
          const attempts = yield* Ref.modify(attemptsRef, (state) => {
            const nextState = new Map(state);
            const nextAttempts = (nextState.get(identity) ?? 0) + 1;
            nextState.set(identity, nextAttempts);

            return [nextAttempts, nextState] as const;
          });

          if (attempts > maxAttempts) {
            return yield* SignupRateLimited.make({
              message: "Too many signup attempts. Please try again later.",
            });
          }
        });

      return SignupWriteRateLimiter.make({ use });
    }),
  );

const makeHttpLayer = (rateLimiterLayer = SignupWriteRateLimiter.Default) => {
  const ApiLayerTest = HttpApiBuilder.api(Api).pipe(
    Layer.provide(Layer.mergeAll(PingGroupLayer, SignupGroupLayer)),
  );
  const PersistenceLayer = DatabaseNewLayerTest.pipe(
    Layer.provideMerge(KeyValueStoreLayerTest),
  );
  const DomainLayer = Layer.mergeAll(
    UsersLayerTest,
    SubscriptionsLayerTest,
  ).pipe(Layer.provideMerge(PersistenceLayer));
  const AppLayer = Layer.mergeAll(
    PersistenceLayer,
    DomainLayer,
    rateLimiterLayer,
  );
  const ServerLayer = HttpApiBuilder.serve(
    HttpMiddleware.xForwardedHeaders,
  ).pipe(
    Layer.provide(ApiLayerTest),
    Layer.provide(AppLayer),
    Layer.provideMerge(NodeHttpServer.layerTest),
  );

  return Layer.mergeAll(KeyValueStoreLayerTest, ServerLayer);
};

describe("signup api", () => {
  it.effect("accepts signup submissions", () =>
    Effect.gen(function* () {
      const keyValueStore = yield* KeyValueStore.KeyValueStore;
      const payload = yield* Schema.decodeUnknown(SignupRequest)({
        email: "fan@example.com",
        timezone: "America/New_York",
        sendAtSecondsLocal: 9 * 3600,
        topicIds: ["b0c826c3-fc93-541f-a68d-de4d98e5a7e5"],
      }).pipe(Effect.orDie);

      yield* keyValueStore.set(
        "topics/b0c826c3-fc93-541f-a68d-de4d98e5a7e5",
        encodeJson({ events: [] }),
      );

      const client = yield* HttpApiClient.make(Api);
      const response = yield* client.signup.submit({
        payload,
      });

      expect(response.status).toBe("created");
      expect(response.topicIds).toEqual([
        "b0c826c3-fc93-541f-a68d-de4d98e5a7e5",
      ]);
    }).pipe(Effect.provide(makeHttpLayer())),
  );

  it.scoped("returns validation failures for bad payloads", () =>
    Effect.gen(function* () {
      const response = yield* HttpClientRequest.post("/api/signup").pipe(
        HttpClientRequest.bodyUnsafeJson({
          email: "not-an-email",
          timezone: "America/New_York",
          sendAtSecondsLocal: 9 * 3600,
          topicIds: ["b0c826c3-fc93-541f-a68d-de4d98e5a7e5"],
        }),
        HttpClient.execute,
      );

      expect(response.status).toBe(400);
    }).pipe(Effect.provide(makeHttpLayer())),
  );

  it.effect("returns rate-limit failures", () =>
    Effect.gen(function* () {
      const keyValueStore = yield* KeyValueStore.KeyValueStore;
      const payload = yield* Schema.decodeUnknown(SignupRequest)({
        email: "fan@example.com",
        timezone: "America/New_York",
        sendAtSecondsLocal: 9 * 3600,
        topicIds: ["b0c826c3-fc93-541f-a68d-de4d98e5a7e5"],
      }).pipe(Effect.orDie);

      yield* keyValueStore.set(
        "topics/b0c826c3-fc93-541f-a68d-de4d98e5a7e5",
        encodeJson({ events: [] }),
      );

      const client = yield* HttpApiClient.make(Api, {
        transformClient: HttpClient.mapRequest(
          HttpClientRequest.setHeader("x-forwarded-for", "203.0.113.10"),
        ),
      });

      yield* client.signup.submit({ payload });
      const error = yield* Effect.flip(client.signup.submit({ payload }));

      expect(error._tag).toBe("SignupRateLimited");
    }).pipe(Effect.provide(makeHttpLayer(makeRateLimiterLayer(1)))),
  );
});
