import { describe, expect, it } from "@effect/vitest";
import { Effect, Either, Layer, Schema } from "effect";

import { Database } from "../modules/database/service.js";
import { Subscriptions } from "../modules/subscriptions/service.js";
import { Subscription } from "../modules/subscriptions/schema.js";
import { localDateFromUtc } from "../modules/subscriptions/time.js";
import { Topic } from "../modules/topics/schema.js";
import { User } from "../modules/users/schema.js";

const decode = Schema.decodeUnknownSync;

class DataReadError extends Schema.TaggedError<DataReadError>()(
  "DataReadError",
  {
    path: Schema.String,
    message: Schema.String,
  },
) {}

const sampleIds = {
  userId: "00000000-0000-0000-0000-000000000021",
  subscriptionId: "00000000-0000-0000-0000-000000000022",
  topicId: "00000000-0000-0000-0000-000000000023",
  eventIdA: "00000000-0000-0000-0000-000000000024",
  eventIdB: "00000000-0000-0000-0000-000000000025",
  eventIdC: "00000000-0000-0000-0000-000000000026",
  eventIdD: "00000000-0000-0000-0000-000000000027",
};

const user = decode(User)({
  id: sampleIds.userId,
  email: "test@example.com",
  timezone: "America/New_York",
});

const subscription = decode(Subscription)({
  id: sampleIds.subscriptionId,
  userId: sampleIds.userId,
  topicId: sampleIds.topicId,
  schedule: { type: "fixed", sendAtSecondsLocal: 3600 },
  enabled: true,
  lastSentAt: null,
});

const topic = decode(Topic)({
  id: sampleIds.topicId,
  events: [
    {
      id: sampleIds.eventIdA,
      startUtc: "2026-02-10T03:30:00Z",
      teamName: "Celtics",
      opponent: "Raptors",
    },
    {
      id: sampleIds.eventIdB,
      startUtc: "2026-02-10T00:30:00Z",
      teamName: "Celtics",
      opponent: "Knicks",
    },
    {
      id: sampleIds.eventIdC,
      startUtc: "2026-02-12T00:30:00Z",
      teamName: "Celtics",
      opponent: "Heat",
    },
    {
      id: sampleIds.eventIdD,
      startUtc: "2026-02-11T00:30:00Z",
      teamName: "Celtics",
      opponent: "Bulls",
    },
  ],
});

const DatabaseLayerTest = Layer.succeed(
  Database,
  Database.make({
    loadUsers: () => Effect.succeed([]),
    loadSubscriptions: () => Effect.succeed([]),
    loadTopic: () => Effect.succeed(topic),
    updateSubscription: () => Effect.void,
  }),
);

const SubscriptionsLayerTest = Subscriptions.DefaultWithoutDependencies.pipe(
  Layer.provide(DatabaseLayerTest),
);

describe("Subscriptions", () => {
  it.effect(
    "should return events sorted by startUtc when local date matches",
    () => {
      const target = localDateFromUtc(
        decode(Schema.DateTimeUtc)("2026-02-10T03:30:00Z"),
        user.timezone,
      );

      return Effect.gen(function* () {
        const subscriptions = yield* Subscriptions;
        const result = yield* subscriptions.getDueEvents({
          user,
          subscription,
          target,
        });

        const events = result;

        expect(events).toHaveLength(2);
        expect(events.map((e) => e.id)).toEqual([
          sampleIds.eventIdB,
          sampleIds.eventIdA,
        ]);
      }).pipe(Effect.provide(SubscriptionsLayerTest));
    },
  );

  it.effect(
    "should return matching event when UTC is next day but local date is today",
    () =>
      Effect.gen(function* () {
        const subscriptions = yield* Subscriptions;
        const result = yield* subscriptions.getDueEvents({
          user,
          subscription,
          target: "2026-02-10",
        });

        const events = result;

        expect(events).toHaveLength(1);
        const [event] = events;
        expect(event?.id).toBe(sampleIds.eventIdD);
      }).pipe(Effect.provide(SubscriptionsLayerTest)),
  );

  it.effect(
    "should return empty array when no event matches target local date",
    () =>
      Effect.gen(function* () {
        const subscriptions = yield* Subscriptions;
        const result = yield* subscriptions.getDueEvents({
          user,
          subscription,
          target: "2026-02-13",
        });

        expect(result).toHaveLength(0);
      }).pipe(Effect.provide(SubscriptionsLayerTest)),
  );

  it.effect("should propagate loadTopic failures", () => {
    const loadTopicError = DataReadError.make({
      path: "data/topics",
      message: "topic read failed",
    });

    const DatabaseLayerTestFails = Layer.succeed(
      Database,
      Database.make({
        loadUsers: () => Effect.succeed([]),
        loadSubscriptions: () => Effect.succeed([]),
        loadTopic: () => Effect.fail(loadTopicError),
        updateSubscription: () => Effect.void,
      }),
    );

    const SubscriptionsLayerTestFails =
      Subscriptions.DefaultWithoutDependencies.pipe(
        Layer.provide(DatabaseLayerTestFails),
      );

    return Effect.gen(function* () {
      const subscriptions = yield* Subscriptions;
      const result = yield* Effect.either(
        subscriptions.getDueEvents({
          user,
          subscription,
          target: "2026-02-10",
        }),
      );

      Either.match(result, {
        onLeft: (error) => {
          switch (error._tag) {
            case "DataReadError": {
              expect(error.path).toBe(loadTopicError.path);
              expect(error.message).toBe(loadTopicError.message);
              break;
            }
            default:
              expect.fail(`Expected DataReadError, got ${error._tag}`);
          }
        },
        onRight: () => expect.fail("Expected getDueEvents to fail"),
      });
    }).pipe(Effect.provide(SubscriptionsLayerTestFails));
  });
});
