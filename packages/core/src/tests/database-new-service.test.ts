import { KeyValueStore } from "@effect/platform";
import { describe, expect, it } from "@effect/vitest";
import { Effect, Either, Layer, Schema } from "effect";

import { DatabaseNew } from "../modules/database-new/service.js";
import { Subscription } from "../modules/subscriptions/schema.js";
import { Topic } from "../modules/topics/schema.js";
import { User } from "../modules/users/schema.js";

const encodeJson = Schema.encodeUnknownSync(Schema.parseJson(Schema.Unknown));
const decode = Schema.decodeUnknownSync;

const sampleIds = {
  userId: "00000000-0000-4000-8000-000000000501",
  userIdTwo: "00000000-0000-4000-8000-000000000502",
  subscriptionId: "00000000-0000-4000-8000-000000000503",
  topicId: "00000000-0000-4000-8000-000000000504",
  missingTopicId: "00000000-0000-4000-8000-000000000505",
  eventId: "00000000-0000-4000-8000-000000000506",
};

const usersSeed = [
  {
    id: sampleIds.userId,
    email: "fan@example.com",
    timezone: "America/New_York",
  },
  {
    id: sampleIds.userIdTwo,
    email: "friend@example.com",
    timezone: "America/Chicago",
  },
];

const subscriptionsSeed = [
  {
    id: sampleIds.subscriptionId,
    userId: sampleIds.userId,
    topicId: sampleIds.topicId,
    schedule: { type: "fixed", sendAtSecondsLocal: 9 * 3600 },
    enabled: true,
    lastSentAt: null,
  },
];

const topicSeed = {
  events: [
    {
      id: sampleIds.eventId,
      startUtc: "2026-02-10T00:30:00Z",
      site: "home",
      teamName: "Celtics",
      opponent: "Raptors",
    },
  ],
};

const KeyValueStoreLayerTest = KeyValueStore.layerMemory;

const DatabaseNewLayerTest = Layer.mergeAll(
  KeyValueStoreLayerTest,
  DatabaseNew.Default.pipe(Layer.provide(KeyValueStoreLayerTest)),
);

const runWithSeed = <A, E>(
  seed: Record<string, unknown>,
  effect: Effect.Effect<A, E, DatabaseNew>,
) =>
  Effect.gen(function* () {
    const keyValueStore = yield* KeyValueStore.KeyValueStore;

    for (const [key, value] of Object.entries(seed)) {
      yield* keyValueStore.set(key, encodeJson(value));
    }

    return yield* effect;
  }).pipe(Effect.provide(DatabaseNewLayerTest));

describe("DatabaseNew", () => {
  it.effect("reads typed values using registered queries", () =>
    runWithSeed(
      {
        users: usersSeed,
        subscriptions: subscriptionsSeed,
        [`topics/${sampleIds.topicId}`]: topicSeed,
      },
      Effect.gen(function* () {
        const database = yield* DatabaseNew;

        const [users, subscriptions, topic] = yield* Effect.all([
          database.getWithSchema({
            query: database.queries.users,
            schema: Schema.Array(User),
          }),
          database.getWithSchema({
            query: database.queries.subscriptions,
            schema: Schema.Array(Subscription),
          }),
          database.getWithSchema({
            query: database.queries.topic(sampleIds.topicId),
            schema: Topic.pick("events"),
          }),
        ]);

        expect(users).toHaveLength(2);
        expect(subscriptions).toHaveLength(1);
        expect(topic.events).toHaveLength(1);
      }),
    ),
  );

  it.effect("writes typed values using registered queries", () =>
    runWithSeed(
      {},
      Effect.gen(function* () {
        const database = yield* DatabaseNew;
        const users = usersSeed.map((user) => decode(User)(user));

        yield* database.setWithSchema({
          query: database.queries.users,
          schema: Schema.Array(User),
          value: users,
        });

        const storedUsers = yield* database.getWithSchema({
          query: database.queries.users,
          schema: Schema.Array(User),
        });

        expect(storedUsers).toHaveLength(2);
        expect(storedUsers[0]?.email).toBe("fan@example.com");
      }),
    ),
  );

  it.effect("returns DataFileNotFound for missing keys", () =>
    runWithSeed(
      {},
      Effect.gen(function* () {
        const database = yield* DatabaseNew;
        const result = yield* Effect.either(
          database.getWithSchema({
            query: database.queries.topic(sampleIds.missingTopicId),
            schema: Topic.pick("events"),
          }),
        );

        Either.match(result, {
          onLeft: (error) => {
            expect(error._tag).toBe("DataFileNotFound");
          },
          onRight: () => expect.fail("Expected getWithSchema to fail"),
        });
      }),
    ),
  );

  it.effect("returns DataValidationError for invalid stored data", () =>
    runWithSeed(
      {
        users: [{ id: sampleIds.userId, email: "not-an-email" }],
      },
      Effect.gen(function* () {
        const database = yield* DatabaseNew;
        const result = yield* Effect.either(
          database.getWithSchema({
            query: database.queries.users,
            schema: Schema.Array(User),
          }),
        );

        Either.match(result, {
          onLeft: (error) => {
            expect(error._tag).toBe("DataValidationError");
          },
          onRight: () => expect.fail("Expected getWithSchema to fail"),
        });
      }),
    ),
  );

  it.effect("exposes the raw kv client as an escape hatch", () =>
    runWithSeed(
      { users: usersSeed },
      Effect.gen(function* () {
        const database = yield* DatabaseNew;
        const rawUsers = yield* database.client.get("users");

        expect(rawUsers._tag).toBe("Some");
      }),
    ),
  );
});
