import { KeyValueStore } from "@effect/platform";
import { describe, expect, it } from "@effect/vitest";
import { DateTime, Effect, Either, Layer, Schema } from "effect";

import { DatabaseOld } from "../modules/database/service[old].js";
import { Subscription } from "../modules/subscriptions/schema.js";

const decode = Schema.decodeUnknownSync;
const encodeJson = Schema.encodeUnknownSync(Schema.parseJson(Schema.Unknown));

const sampleIds = {
  userId: "00000000-0000-4000-8000-000000000401",
  topicId: "00000000-0000-4000-8000-000000000402",
  topicIdMissing: "00000000-0000-4000-8000-000000000403",
  subscriptionId: "00000000-0000-4000-8000-000000000404",
};

const usersSeed = [
  {
    id: sampleIds.userId,
    email: "fan@example.com",
    timezone: "America/New_York",
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
      id: "00000000-0000-4000-8000-000000000405",
      startUtc: "2026-02-10T00:30:00Z",
      site: "home",
      teamName: "Celtics",
      opponent: "Raptors",
    },
  ],
};

const KeyValueStoreLayerTest = KeyValueStore.layerMemory;

const DatabaseOldLayerTest = Layer.mergeAll(
  KeyValueStoreLayerTest,
  DatabaseOld.Default.pipe(Layer.provide(KeyValueStoreLayerTest)),
);

const runWithSeed = <A, E>(
  seed: Record<string, unknown>,
  effect: Effect.Effect<A, E, DatabaseOld>,
) =>
  Effect.gen(function* () {
    const keyValueStore = yield* KeyValueStore.KeyValueStore;

    for (const [key, value] of Object.entries(seed)) {
      yield* keyValueStore.set(key, encodeJson(value));
    }

    return yield* effect;
  }).pipe(Effect.provide(DatabaseOldLayerTest));

describe("DatabaseOld", () => {
  it.effect("loads users, subscriptions, and topic from KeyValueStore", () =>
    runWithSeed(
      {
        users: usersSeed,
        subscriptions: subscriptionsSeed,
        [`topics/${sampleIds.topicId}`]: topicSeed,
      },
      Effect.gen(function* () {
        const database = yield* DatabaseOld;

        const [users, subscriptions, topic] = yield* Effect.all([
          database.loadUsers(),
          database.loadSubscriptions(),
          database.loadTopic(sampleIds.topicId),
        ]);

        expect(users).toHaveLength(1);
        expect(users[0]?.id).toBe(sampleIds.userId);

        expect(subscriptions).toHaveLength(1);
        expect(subscriptions[0]?.id).toBe(sampleIds.subscriptionId);

        expect(topic.id).toBe(sampleIds.topicId);
        expect(topic.events).toHaveLength(1);
        expect(topic.events[0]?.teamName).toBe("Celtics");
      }),
    ),
  );

  it.effect("returns DataFileNotFound when topic key is missing", () =>
    runWithSeed(
      { users: usersSeed, subscriptions: subscriptionsSeed },
      Effect.gen(function* () {
        const database = yield* DatabaseOld;
        const result = yield* Effect.either(
          database.loadTopic(sampleIds.topicIdMissing),
        );

        Either.match(result, {
          onLeft: (error) => {
            switch (error._tag) {
              case "DataFileNotFound": {
                expect(error.path).toBe(`topics/${sampleIds.topicIdMissing}`);
                break;
              }
              default:
                expect.fail(`Expected DataFileNotFound, got ${error._tag}`);
            }
          },
          onRight: () => expect.fail("Expected loadTopic to fail"),
        });
      }),
    ),
  );

  it.effect("updates existing subscriptions and persists the write", () =>
    runWithSeed(
      {
        users: usersSeed,
        subscriptions: subscriptionsSeed,
      },
      Effect.gen(function* () {
        const database = yield* DatabaseOld;
        const nextSentAtIso = "2026-02-11T15:00:00.000Z";

        const nextSubscription = decode(Subscription)({
          ...subscriptionsSeed[0],
          lastSentAt: nextSentAtIso,
        });

        yield* database.updateSubscription(nextSubscription);

        const subscriptions = yield* database.loadSubscriptions();
        expect(subscriptions).toHaveLength(1);
        expect(subscriptions[0]?.id).toBe(sampleIds.subscriptionId);

        const actualLastSentAt = subscriptions[0]?.lastSentAt;
        expect(actualLastSentAt).not.toBeNull();
        if (actualLastSentAt) {
          expect(DateTime.formatIso(actualLastSentAt)).toBe(nextSentAtIso);
        }
      }),
    ),
  );

  it.effect(
    "returns DataFileNotFound when updating with missing subscriptions key",
    () =>
      runWithSeed(
        { users: usersSeed },
        Effect.gen(function* () {
          const database = yield* DatabaseOld;
          const subscription = decode(Subscription)(subscriptionsSeed[0]);
          const result = yield* Effect.either(
            database.updateSubscription(subscription),
          );

          Either.match(result, {
            onLeft: (error) => {
              switch (error._tag) {
                case "DataFileNotFound": {
                  expect(error.path).toBe("subscriptions");
                  break;
                }
                default:
                  expect.fail(`Expected DataFileNotFound, got ${error._tag}`);
              }
            },
            onRight: () =>
              expect.fail(
                "Expected updateSubscription to fail on missing data",
              ),
          });
        }),
      ),
  );
});
