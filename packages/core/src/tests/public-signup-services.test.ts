import { KeyValueStore } from "@effect/platform";
import { describe, expect, it } from "@effect/vitest";
import { Effect, Layer, Option, Schema } from "effect";

import { DatabaseNew } from "../modules/database-new/service.js";
import { Subscription } from "../modules/subscriptions/schema.js";
import { Subscriptions } from "../modules/subscriptions/service.js";
import { User } from "../modules/users/schema.js";
import { Users } from "../modules/users/service.js";

const encodeJson = Schema.encodeUnknownSync(Schema.parseJson(Schema.Unknown));
const decodeEmail = Schema.decodeUnknownSync(User.fields.email);
const decodeTimezone = Schema.decodeUnknownSync(User.fields.timezone);

const sampleIds = {
  existingUserId: "00000000-0000-4000-8000-000000000601",
  existingSubscriptionId: "00000000-0000-4000-8000-000000000602",
  retainedTopicId: "b0c826c3-fc93-541f-a68d-de4d98e5a7e5",
  nextTopicId: "40fd6996-e273-51d3-b12e-865da5d11543",
  extraTopicId: "830d920d-7663-5213-883c-33f24b004346",
  missingTopicId: "00000000-0000-4000-8000-000000000603",
};

const KeyValueStoreLayerTest = KeyValueStore.layerMemory;

const DatabaseNewLayerTest = Layer.mergeAll(
  KeyValueStoreLayerTest,
  DatabaseNew.Default.pipe(Layer.provide(KeyValueStoreLayerTest)),
);

const UsersLayerTest = Users.Default.pipe(Layer.provide(DatabaseNewLayerTest));

const SubscriptionsLayerTest = Subscriptions.Default.pipe(
  Layer.provide(DatabaseNewLayerTest),
);

const ServicesLayerTest = Layer.mergeAll(
  KeyValueStoreLayerTest,
  DatabaseNewLayerTest,
  UsersLayerTest,
  SubscriptionsLayerTest,
);

const runWithSeed = <A, E>(
  seed: Record<string, unknown>,
  effect: Effect.Effect<
    A,
    E,
    KeyValueStore.KeyValueStore | Subscriptions | Users
  >,
) =>
  Effect.gen(function* () {
    const keyValueStore = yield* KeyValueStore.KeyValueStore;

    for (const [key, value] of Object.entries(seed)) {
      yield* keyValueStore.set(key, encodeJson(value));
    }

    return yield* effect;
  }).pipe(Effect.provide(ServicesLayerTest));

describe("signup domain services", () => {
  it.effect("supports user upsert with normalized email lookup", () =>
    runWithSeed(
      {
        users: [
          {
            id: sampleIds.existingUserId,
            email: "fan@example.com",
            timezone: "America/New_York",
          },
        ],
      },
      Effect.gen(function* () {
        const users = yield* Users;

        const found = yield* users.getByEmail(
          "fan@example.com" as User["email"],
        );
        expect(Option.isSome(found)).toBe(true);

        const updated = yield* users.upsert({
          email: decodeEmail(" FAN@EXAMPLE.COM "),
          timezone: decodeTimezone("America/Chicago"),
        });

        expect(updated.id).toBe(sampleIds.existingUserId);
        expect(updated.email).toBe("fan@example.com");
        expect(updated.timezone.id).toBe("America/Chicago");
      }),
    ),
  );

  it.effect("handles first signup by creating a user and subscriptions", () =>
    runWithSeed(
      {
        [`topics/${sampleIds.retainedTopicId}`]: { events: [] },
      },
      Effect.gen(function* () {
        const users = yield* Users;
        const subscriptions = yield* Subscriptions;

        const user = yield* users.upsert({
          email: "new@example.com" as User["email"],
          timezone: decodeTimezone("America/New_York"),
        });

        const result = yield* subscriptions.replaceForUser({
          userId: user.id,
          topicIds: [sampleIds.retainedTopicId as Subscription["topicId"]],
          schedule: { type: "fixed", sendAtSecondsLocal: 9 * 3600 },
        });

        expect(result).toHaveLength(1);
        expect(result[0]?.userId).toBe(user.id);
      }),
    ),
  );

  it.effect(
    "overwrites signup preferences while preserving retained rows",
    () =>
      runWithSeed(
        {
          users: [
            {
              id: sampleIds.existingUserId,
              email: "fan@example.com",
              timezone: "America/New_York",
            },
          ],
          subscriptions: [
            {
              id: sampleIds.existingSubscriptionId,
              userId: sampleIds.existingUserId,
              topicId: sampleIds.retainedTopicId,
              schedule: { type: "fixed", sendAtSecondsLocal: 9 * 3600 },
              enabled: true,
              lastSentAt: "2026-03-01T12:00:00.000Z",
            },
          ],
          [`topics/${sampleIds.retainedTopicId}`]: { events: [] },
        },
        Effect.gen(function* () {
          const users = yield* Users;
          const subscriptions = yield* Subscriptions;

          const user = yield* users.upsert({
            email: "fan@example.com" as User["email"],
            timezone: decodeTimezone("America/Los_Angeles"),
          });

          const result = yield* subscriptions.replaceForUser({
            userId: user.id,
            topicIds: [
              sampleIds.retainedTopicId as Subscription["topicId"],
              sampleIds.retainedTopicId as Subscription["topicId"],
            ],
            schedule: { type: "fixed", sendAtSecondsLocal: 10 * 3600 },
          });

          expect(result).toHaveLength(1);
          expect(result[0]?.id).toBe(sampleIds.existingSubscriptionId);
          expect(result[0]?.schedule).toEqual({
            type: "fixed",
            sendAtSecondsLocal: 10 * 3600,
          });
          expect(result[0]?.lastSentAt).not.toBeNull();
          expect(user.timezone.id).toBe("America/Los_Angeles");
        }),
      ),
  );

  it.effect("rejects over-cap replacements", () =>
    runWithSeed(
      {
        [`topics/${sampleIds.retainedTopicId}`]: { events: [] },
        [`topics/${sampleIds.nextTopicId}`]: { events: [] },
      },
      Effect.gen(function* () {
        const subscriptions = yield* Subscriptions;
        const result = yield* Effect.either(
          subscriptions.replaceForUser({
            userId: sampleIds.existingUserId as Subscription["userId"],
            topicIds: [
              sampleIds.retainedTopicId as Subscription["topicId"],
              sampleIds.nextTopicId as Subscription["topicId"],
            ],
            schedule: { type: "fixed", sendAtSecondsLocal: 9 * 3600 },
          }),
        );

        if (result._tag !== "Left") {
          expect.fail("Expected replaceForUser to fail");
        }

        expect(result.left._tag).toBe("SubscriptionTopicLimitExceeded");
      }),
    ),
  );

  it.effect("rejects topic ids that do not exist", () =>
    runWithSeed(
      {},
      Effect.gen(function* () {
        const subscriptions = yield* Subscriptions;
        const result = yield* Effect.either(
          subscriptions.replaceForUser({
            userId: sampleIds.existingUserId as Subscription["userId"],
            topicIds: [sampleIds.missingTopicId as Subscription["topicId"]],
            schedule: { type: "fixed", sendAtSecondsLocal: 9 * 3600 },
          }),
        );

        if (result._tag !== "Left") {
          expect.fail("Expected replaceForUser to fail");
        }

        expect(result.left._tag).toBe("SubscriptionTopicNotFound");
      }),
    ),
  );

  it.effect("is idempotent for repeat submissions", () =>
    runWithSeed(
      {
        [`topics/${sampleIds.retainedTopicId}`]: { events: [] },
      },
      Effect.gen(function* () {
        const subscriptions = yield* Subscriptions;

        const first = yield* subscriptions.replaceForUser({
          userId: sampleIds.existingUserId as Subscription["userId"],
          topicIds: [sampleIds.retainedTopicId as Subscription["topicId"]],
          schedule: { type: "fixed", sendAtSecondsLocal: 9 * 3600 },
        });
        const second = yield* subscriptions.replaceForUser({
          userId: sampleIds.existingUserId as Subscription["userId"],
          topicIds: [sampleIds.retainedTopicId as Subscription["topicId"]],
          schedule: { type: "fixed", sendAtSecondsLocal: 9 * 3600 },
        });

        expect(first).toHaveLength(1);
        expect(second).toHaveLength(1);
        expect(second[0]?.id).toBe(first[0]?.id);
      }),
    ),
  );

  it.effect("removes all subscriptions for a user", () =>
    runWithSeed(
      {
        subscriptions: [
          {
            id: sampleIds.existingSubscriptionId,
            userId: sampleIds.existingUserId,
            topicId: sampleIds.retainedTopicId,
            schedule: { type: "fixed", sendAtSecondsLocal: 9 * 3600 },
            enabled: true,
            lastSentAt: null,
          },
          {
            id: "00000000-0000-4000-8000-000000000604",
            userId: sampleIds.existingUserId,
            topicId: sampleIds.nextTopicId,
            schedule: { type: "fixed", sendAtSecondsLocal: 9 * 3600 },
            enabled: true,
            lastSentAt: null,
          },
          {
            id: "00000000-0000-4000-8000-000000000605",
            userId: "00000000-0000-4000-8000-000000000606",
            topicId: sampleIds.extraTopicId,
            schedule: { type: "fixed", sendAtSecondsLocal: 9 * 3600 },
            enabled: true,
            lastSentAt: null,
          },
        ],
      },
      Effect.gen(function* () {
        const subscriptions = yield* Subscriptions;

        yield* subscriptions.removeAllByUserId(
          sampleIds.existingUserId as Subscription["userId"],
        );

        const remainingForUser = yield* subscriptions.getAllByUserId(
          sampleIds.existingUserId as Subscription["userId"],
        );
        const remainingForOtherUser = yield* subscriptions.getAllByUserId(
          "00000000-0000-4000-8000-000000000606" as Subscription["userId"],
        );

        expect(remainingForUser).toHaveLength(0);
        expect(remainingForOtherUser).toHaveLength(1);
      }),
    ),
  );
});
