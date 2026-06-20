import { describe, expect, it } from "@effect/vitest";
import * as NodeHttpServer from "@effect/platform-node/NodeHttpServer";
import {
  Api,
  Database,
  Subject,
  SubjectId,
  SubjectInsert,
  subjectsTable,
  Subscriptions,
  SubscriptionsLayer,
  SubjectsLayer,
  Users,
  UsersLayer,
} from "@dtpt/core-v2";
import { SignupRequest } from "@dtpt/core-v2/contracts/signup";
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
import { SubjectsGroupLayer } from "./routes.subjects.js";
import { UnsubscribeGroupLayer } from "./routes.unsubscribe.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;
const decodeSignup = Schema.decodeUnknownSync(SignupRequest);
const utc = decode(Schema.DateTimeUtcFromString);
const timezone = decode(Schema.TimeZoneNamedFromString);

const layerSignupTest = makeSignupTestLayer({ limit: 100, window: 60 });
const layerSignupRateLimitedTest = makeSignupTestLayer({
  limit: 1,
  window: 60,
});

const subjectInput = makeSubjectInput({
  id: "00000000-0000-4000-8000-000000000301",
  name: "Boston Celtics",
  abbreviation: "BOS",
});

const secondSubjectInput = makeSubjectInput({
  id: "00000000-0000-4000-8000-000000000302",
  name: "New York Knicks",
  abbreviation: "NYK",
});

const thirdSubjectInput = makeSubjectInput({
  id: "00000000-0000-4000-8000-000000000303",
  name: "Los Angeles Lakers",
  abbreviation: "LAL",
});

const subjectId = SubjectId.make(subjectInput.id);
const secondSubjectId = SubjectId.make(secondSubjectInput.id);
const thirdSubjectId = SubjectId.make(thirdSubjectInput.id);
const missingSubjectId = SubjectId.make("00000000-0000-4000-8000-000000009999");

const schedule = {
  _tag: "fixed_local_time",
  sendAtSecondsLocal: 9 * 60 * 60,
} as const;

describe("signup route handler", () => {
  it.effect("stores a normalized user and selected subscriptions", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedSubjects([subjectInput, secondSubjectInput]);

      const result = yield* submit({
        email: " Fan@Example.COM ",
        subjectIds: [subjectInput.id, secondSubjectInput.id],
      });

      const users = yield* Users;
      const subscriptions = yield* Subscriptions;
      const user = yield* users.getByEmail(result.payload.email);
      const listed = yield* subscriptions.list();

      expect(result.response.status).toBe(200);
      expect(yield* result.response.json).toEqual({ ok: true });
      expect(user.email).toBe("fan@example.com");
      expect(user.timezone).toEqual(timezone("America/New_York"));
      expect(
        listed.map((subscription) => subscription.subjectId).toSorted(),
      ).toEqual([subjectId, secondSubjectId]);
      expect(listed.map((subscription) => subscription.lastSentAt)).toEqual([
        null,
        null,
      ]);
    }).pipe(Effect.provide(layerSignupTest)),
  );

  it.effect(
    "rejects a missing subject id without committing the user upsert",
    () =>
      Effect.gen(function* () {
        yield* createTables;
        yield* seedSubjects([subjectInput]);

        const result = yield* submit({
          subjectIds: [missingSubjectId],
        });

        const database = yield* Database;
        const users = yield* database.query.usersTable.findMany();
        const subscriptions =
          yield* database.query.subscriptionsTable.findMany();

        expect(result.response.status).toBe(400);
        expect(users).toHaveLength(0);
        expect(subscriptions).toHaveLength(0);
      }).pipe(Effect.provide(layerSignupTest)),
  );

  it.effect("maps cap rejection to a public bad request", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedSubjects([
        subjectInput,
        secondSubjectInput,
        thirdSubjectInput,
      ]);

      const result = yield* submit({
        subjectIds: [subjectId, secondSubjectId, thirdSubjectId],
      });

      expect(result.response.status).toBe(400);
    }).pipe(Effect.provide(layerSignupTest)),
  );

  it.effect(
    "replaces subscriptions on resubmission and preserves unsubscribe token",
    () =>
      Effect.gen(function* () {
        yield* createTables;
        yield* seedSubjects([subjectInput, secondSubjectInput]);

        const first = yield* submit({
          email: "fan@example.com",
          subjectIds: [subjectId],
        });

        const users = yield* Users;
        const subscriptions = yield* Subscriptions;
        const userBefore = yield* users.getByEmail(first.payload.email);
        const [subscriptionBefore] = yield* subscriptions.list();

        if (!subscriptionBefore) {
          throw new Error("Expected initial subscription");
        }

        yield* subscriptions.markSent({
          subscriptionId: subscriptionBefore.id,
          sentAt: utc("2026-05-24T13:00:00.000Z"),
        });

        yield* submit({
          email: " FAN@example.com ",
          subjectIds: [secondSubjectId],
        });

        const userAfter = yield* users.getByEmail(first.payload.email);
        const listed = yield* subscriptions.list();

        expect(userAfter.id).toEqual(userBefore.id);
        expect(userAfter.unsubscribeToken).toEqual(userBefore.unsubscribeToken);
        expect(listed).toHaveLength(1);
        expect(listed[0]?.subjectId).toEqual(secondSubjectId);
        expect(listed[0]?.lastSentAt).toBeNull();
      }).pipe(Effect.provide(layerSignupTest)),
  );

  it.effect(
    "rate limits public signup writes before opening the transaction",
    () =>
      Effect.gen(function* () {
        yield* createTables;
        yield* seedSubjects([subjectInput]);

        yield* submit({ email: "first@example.com" });
        const result = yield* submit({ email: "second@example.com" });

        const database = yield* Database;
        const users = yield* database.query.usersTable.findMany();

        expect(result.response.status).toBe(429);
        expect(users.map((user) => user.email)).toEqual(["first@example.com"]);
      }).pipe(Effect.provide(layerSignupRateLimitedTest)),
  );
});

function makeSubjectInput(input: {
  readonly id: string;
  readonly name: string;
  readonly abbreviation: string;
}) {
  return {
    id: input.id,
    _tag: "sports_team",
    details: {
      _tag: "sports_team",
      leagueId: "nba",
      display: input.name,
      location: input.name,
      name: input.name,
      abbreviation: input.abbreviation,
      slug: input.name.toLowerCase().replaceAll(" ", "-"),
    },
  };
}

function submit(input: {
  readonly email?: string;
  readonly subjectIds?: readonly (string | SubjectId)[];
}) {
  return Effect.gen(function* () {
    const inputPayload = {
      email: input.email ?? "fan@example.com",
      timezone: "America/New_York",
      schedule,
      subjectIds: input.subjectIds ?? [subjectInput.id],
    };
    const payload = decodeSignup(inputPayload);
    const response = yield* HttpClientRequest.post("/api/signup").pipe(
      HttpClientRequest.bodyJson(inputPayload),
      Effect.flatMap(HttpClient.execute),
    );

    return { payload, response };
  });
}

function makeSignupTestLayer(config: {
  readonly limit: number;
  readonly window: number;
}) {
  const RuntimeLayer = Layer.mergeAll(
    makeRateLimiterLayer(Config.succeed(config)),
    SubscriptionsLayer,
    SubjectsLayer,
    UsersLayer,
  ).pipe(Layer.provideMerge(layerTest));

  const ServerLayer = HttpRouter.serve(
    HttpApiBuilder.layer(Api).pipe(
      Layer.provide([
        PingGroupLayer,
        SignupGroupLayer,
        SubjectsGroupLayer,
        UnsubscribeGroupLayer,
      ]),
    ),
    { disableListenLog: true, disableLogger: true },
  ).pipe(
    Layer.provideMerge(NodeHttpServer.layerTest),
    Layer.provide(RuntimeLayer),
  );

  return Layer.mergeAll(RuntimeLayer, ServerLayer);
}

function seedSubjects(subjects: readonly (typeof subjectInput)[]) {
  return Effect.gen(function* () {
    const database = yield* Database;
    const inserts = subjects.map((subject) =>
      encode(SubjectInsert)(decode(Subject)(subject)),
    );

    yield* database.insert(subjectsTable).values(inserts);
  });
}
