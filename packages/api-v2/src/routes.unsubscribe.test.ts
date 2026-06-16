import { describe, expect, it } from "@effect/vitest";
import * as NodeHttpServer from "@effect/platform-node/NodeHttpServer";
import {
  Api,
  Database,
  EmailAddressFromString,
  Subject,
  SubjectInsert,
  subjectsTable,
  SubscriptionsLayer,
  Users,
  UsersLayer,
} from "@dtpt/core-v2";
import {
  createTables,
  layerTest,
} from "@dtpt/core-v2/lib/database/__tests__/setup";
import { Config, Effect, Layer, Schema } from "effect";
import {
  HttpClient,
  HttpClientRequest,
  HttpRouter,
} from "effect/unstable/http";
import { HttpApiBuilder } from "effect/unstable/httpapi";

import { makeRateLimiterLayer } from "./rate-limit/service.js";
import { PingGroupLayer } from "./routes.ping.js";
import { SignupGroupLayer } from "./routes.signup.js";
import { UnsubscribeGroupLayer } from "./routes.unsubscribe.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;
const email = decode(EmailAddressFromString);

const layerUnsubscribeTest = makeUnsubscribeTestLayer({
  limit: 100,
  window: 60,
});
const layerUnsubscribeRateLimitedTest = makeUnsubscribeTestLayer({
  limit: 1,
  window: 60,
});

const subjectInput = {
  id: "00000000-0000-4000-8000-000000000301",
  _tag: "sports_team",
  details: {
    _tag: "sports_team",
    leagueId: "nba",
    location: "Boston Celtics",
    name: "Boston Celtics",
    display: "Boston Celtics Boston Celtics",
    abbreviation: "BOS",
    slug: "boston-celtics",
  },
};

const unknownToken = "00000000-0000-4000-8000-000000009999";

describe("unsubscribe route handler", () => {
  it.effect("hard-deletes the user and cascades subscriptions", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedSubject;
      yield* signup("fan@example.com");

      const users = yield* Users;
      const user = yield* users.getByEmail(email("fan@example.com"));

      const response = yield* unsubscribe(user.unsubscribeToken);

      const database = yield* Database;
      const remainingUsers = yield* database.query.usersTable.findMany();
      const remainingSubscriptions =
        yield* database.query.subscriptionsTable.findMany();

      expect(response.status).toBe(200);
      expect(yield* response.json).toEqual({ ok: true });
      expect(remainingUsers).toHaveLength(0);
      expect(remainingSubscriptions).toHaveLength(0);
    }).pipe(Effect.provide(layerUnsubscribeTest)),
  );

  it.effect(
    "returns the generic success for an unknown token without mutating state",
    () =>
      Effect.gen(function* () {
        yield* createTables;
        yield* seedSubject;
        yield* signup("fan@example.com");

        const response = yield* unsubscribe(unknownToken);

        const database = yield* Database;
        const users = yield* database.query.usersTable.findMany();
        const subscriptions =
          yield* database.query.subscriptionsTable.findMany();

        expect(response.status).toBe(200);
        expect(yield* response.json).toEqual({ ok: true });
        expect(users).toHaveLength(1);
        expect(subscriptions).toHaveLength(1);
      }).pipe(Effect.provide(layerUnsubscribeTest)),
  );

  it.effect(
    "returns the generic success for a repeated post of a consumed token",
    () =>
      Effect.gen(function* () {
        yield* createTables;
        yield* seedSubject;
        yield* signup("fan@example.com");

        const users = yield* Users;
        const user = yield* users.getByEmail(email("fan@example.com"));

        const first = yield* unsubscribe(user.unsubscribeToken);
        const second = yield* unsubscribe(user.unsubscribeToken);

        expect(first.status).toBe(200);
        expect(second.status).toBe(200);
        expect(yield* second.json).toEqual({ ok: true });
      }).pipe(Effect.provide(layerUnsubscribeTest)),
  );

  it.effect("keeps old tokens away from a fresh re-signup", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedSubject;
      yield* signup("fan@example.com");

      const users = yield* Users;
      const userBefore = yield* users.getByEmail(email("fan@example.com"));

      yield* unsubscribe(userBefore.unsubscribeToken);
      yield* signup("fan@example.com");

      const userAfter = yield* users.getByEmail(email("fan@example.com"));
      const response = yield* unsubscribe(userBefore.unsubscribeToken);

      const database = yield* Database;
      const remainingUsers = yield* database.query.usersTable.findMany();

      expect(userAfter.id).not.toEqual(userBefore.id);
      expect(userAfter.unsubscribeToken).not.toEqual(
        userBefore.unsubscribeToken,
      );
      expect(response.status).toBe(200);
      expect(remainingUsers).toHaveLength(1);
    }).pipe(Effect.provide(layerUnsubscribeTest)),
  );

  it.effect("rejects malformed token shapes", () =>
    Effect.gen(function* () {
      yield* createTables;

      const response = yield* unsubscribe("not-a-token");

      expect(response.status).toBe(400);
    }).pipe(Effect.provide(layerUnsubscribeTest)),
  );

  it.effect("rate limits public unsubscribe writes", () =>
    Effect.gen(function* () {
      yield* createTables;

      yield* unsubscribe(unknownToken);
      const response = yield* unsubscribe(unknownToken);

      expect(response.status).toBe(429);
    }).pipe(Effect.provide(layerUnsubscribeRateLimitedTest)),
  );
});

function signup(address: string) {
  return HttpClientRequest.post("/api/signup").pipe(
    HttpClientRequest.bodyJson({
      email: address,
      timezone: "America/New_York",
      schedule: { _tag: "fixed_local_time", sendAtSecondsLocal: 9 * 60 * 60 },
      subjectIds: [subjectInput.id],
    }),
    Effect.flatMap(HttpClient.execute),
  );
}

function unsubscribe(token: string) {
  return HttpClientRequest.post("/api/unsubscribe").pipe(
    HttpClientRequest.bodyJson({ token }),
    Effect.flatMap(HttpClient.execute),
  );
}

const seedSubject = Effect.gen(function* () {
  const database = yield* Database;

  yield* database
    .insert(subjectsTable)
    .values(encode(SubjectInsert)(decode(Subject)(subjectInput)));
});

function makeUnsubscribeTestLayer(config: {
  readonly limit: number;
  readonly window: number;
}) {
  const RuntimeLayer = Layer.mergeAll(
    makeRateLimiterLayer(Config.succeed(config)),
    SubscriptionsLayer,
    UsersLayer,
  ).pipe(Layer.provideMerge(layerTest));

  const ServerLayer = HttpRouter.serve(
    HttpApiBuilder.layer(Api).pipe(
      Layer.provide([PingGroupLayer, SignupGroupLayer, UnsubscribeGroupLayer]),
    ),
    { disableListenLog: true, disableLogger: true },
  ).pipe(
    Layer.provideMerge(NodeHttpServer.layerTest),
    Layer.provide(RuntimeLayer),
  );

  return Layer.mergeAll(RuntimeLayer, ServerLayer);
}
