import { describe, expect, it } from "@effect/vitest";
import { Effect, Layer, Option, Schema } from "effect";

import { Database } from "../modules/database/service";
import { Checker } from "../modules/subscriptions/service.checker";
import { Subscription } from "../modules/subscriptions/schema";
import { localDateFromUtc } from "../modules/subscriptions/time";
import { TopicData } from "../modules/topics/schema";
import { User } from "../modules/users/schema";

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
  schedule: { type: "fixed", sendAtSecondsLocal: 3600 },
  enabled: true,
  lastSentAt: null,
});

const topicData = decode(TopicData)({
  events: [
    {
      id: sampleIds.eventIdA,
      startUtc: "2026-02-10T03:30:00Z",
      opponent: "Raptors",
    },
    {
      id: sampleIds.eventIdB,
      startUtc: "2026-02-10T00:30:00Z",
      opponent: "Knicks",
    },
    {
      id: sampleIds.eventIdC,
      startUtc: "2026-02-12T00:30:00Z",
      opponent: "Heat",
    },
    {
      id: sampleIds.eventIdD,
      startUtc: "2026-02-11T00:30:00Z",
      opponent: "Bulls",
    },
  ],
});

const databaseLayer = Layer.succeed(
  Database,
  Database.make({
    loadUsers: () => Effect.succeed([]),
    loadSubscriptions: () => Effect.succeed([]),
    loadTopic: () => Effect.succeed(topicData),
    updateSubscription: () => Effect.void,
  }),
);

const checkerLayer = Checker.Default.pipe(Layer.provide(databaseLayer));

describe("Checker", () => {
  it.effect(
    "should return events sorted by startUtc when local date matches",
    () => {
      const targetDate = localDateFromUtc(
        decode(Schema.DateTimeUtc)("2026-02-10T03:30:00Z"),
        user.timezone,
      );

      return Effect.gen(function* () {
        const checker = yield* Checker;
        const result = yield* checker.check({
          user,
          subscription,
          targetDate,
        });

        expect(Option.isSome(result)).toBe(true);
        const events = Option.getOrThrowWith(
          result,
          () => new Error("Expected matching events"),
        );

        expect(events).toHaveLength(2);
        expect(events.map((e) => e.id)).toEqual([
          sampleIds.eventIdB,
          sampleIds.eventIdA,
        ]);
      }).pipe(Effect.provide(checkerLayer));
    },
  );

  it.effect(
    "should return matching event when UTC is next day but local date is today",
    () =>
      Effect.gen(function* () {
        const checker = yield* Checker;
        const result = yield* checker.check({
          user,
          subscription,
          targetDate: "2026-02-10",
        });

        expect(Option.isSome(result)).toBe(true);
        const events = Option.getOrThrowWith(
          result,
          () => new Error("Expected one matching event"),
        );

        expect(events).toHaveLength(1);
        const [event] = events;
        expect(event?.id).toBe(sampleIds.eventIdD);
      }).pipe(Effect.provide(checkerLayer)),
  );

  it.effect("should return none when no event matches target local date", () =>
    Effect.gen(function* () {
      const checker = yield* Checker;
      const result = yield* checker.check({
        user,
        subscription,
        targetDate: "2026-02-13",
      });

      expect(Option.isNone(result)).toBe(true);
    }).pipe(Effect.provide(checkerLayer)),
  );
});
