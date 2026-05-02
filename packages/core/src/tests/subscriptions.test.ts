import * as SqlClient from "@effect/sql/SqlClient";
import { describe, expect, it } from "@effect/vitest";
import { Effect, Either, Layer, Schema } from "effect";

import { DatabaseReadError } from "../modules/database/errors.js";
import type { Event } from "../modules/events/schema.js";
import { Subscriptions } from "../modules/subscriptions/service.js";
import { Subscription } from "../modules/subscriptions/schema.js";
import { localDateFromUtc } from "../modules/subscriptions/time.js";
import { Topics } from "../modules/topics/service.js";
import { User } from "../modules/users/schema.js";

const decode = Schema.decodeUnknownSync;

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
  schedule: { _tag: "fixed", sendAtSecondsLocal: 3600 },
  enabled: true,
  lastSentAt: null,
});

const topicEvents: Event[] = [
  {
    id: decode(Schema.UUID.pipe(Schema.brand("EventId")))(sampleIds.eventIdA),
    topicId: decode(Schema.UUID.pipe(Schema.brand("TopicId")))(
      sampleIds.topicId,
    ),
    data: {
      _tag: "sports",
      startUtc: decode(Schema.DateTimeUtc)("2026-02-10T03:30:00Z"),
      site: "home",
      teamName: "Celtics",
      opponent: "Raptors",
    },
  },
  {
    id: decode(Schema.UUID.pipe(Schema.brand("EventId")))(sampleIds.eventIdB),
    topicId: decode(Schema.UUID.pipe(Schema.brand("TopicId")))(
      sampleIds.topicId,
    ),
    data: {
      _tag: "sports",
      startUtc: decode(Schema.DateTimeUtc)("2026-02-10T00:30:00Z"),
      site: "away",
      teamName: "Celtics",
      opponent: "Knicks",
    },
  },
  {
    id: decode(Schema.UUID.pipe(Schema.brand("EventId")))(sampleIds.eventIdC),
    topicId: decode(Schema.UUID.pipe(Schema.brand("TopicId")))(
      sampleIds.topicId,
    ),
    data: {
      _tag: "sports",
      startUtc: decode(Schema.DateTimeUtc)("2026-02-12T00:30:00Z"),
      site: "home",
      teamName: "Celtics",
      opponent: "Heat",
    },
  },
  {
    id: decode(Schema.UUID.pipe(Schema.brand("EventId")))(sampleIds.eventIdD),
    topicId: decode(Schema.UUID.pipe(Schema.brand("TopicId")))(
      sampleIds.topicId,
    ),
    data: {
      _tag: "sports",
      startUtc: decode(Schema.DateTimeUtc)("2026-02-11T00:30:00Z"),
      site: "away",
      teamName: "Celtics",
      opponent: "Bulls",
    },
  },
];

const TopicsLayerTest = Layer.succeed(
  Topics,
  Topics.make({
    getAllEventsByTopicId: () => Effect.succeed(topicEvents),
  }),
);

const SqlClientLayerTest = Layer.succeed(
  SqlClient.SqlClient,
  {} as SqlClient.SqlClient,
);

const SubscriptionsLayerTest = Subscriptions.DefaultWithoutDependencies.pipe(
  Layer.provide(TopicsLayerTest),
  Layer.provideMerge(SqlClientLayerTest),
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

  it.effect("should propagate topic loading failures", () => {
    const getAllError = DatabaseReadError.make({
      operation: "Topics.getAllEventsByTopicId",
      message: "topic read failed",
    });

    const TopicsLayerTestFails = Layer.succeed(
      Topics,
      Topics.make({
        getAllEventsByTopicId: () => Effect.fail(getAllError),
      }),
    );

    const SubscriptionsLayerTestFails =
      Subscriptions.DefaultWithoutDependencies.pipe(
        Layer.provide(TopicsLayerTestFails),
        Layer.provideMerge(SqlClientLayerTest),
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
          expect(error.operation).toBe(getAllError.operation);
          expect(error.message).toBe(getAllError.message);
        },
        onRight: () => expect.fail("Expected getDueEvents to fail"),
      });
    }).pipe(Effect.provide(SubscriptionsLayerTestFails));
  });
});
