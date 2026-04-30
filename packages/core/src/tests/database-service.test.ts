import { describe, expect, it } from "@effect/vitest";
import { DateTime, Effect, Layer, Schema } from "effect";

import {
  DatabaseOld,
  TopicWithEvents,
} from "../modules/database/service-old.js";
import { Subscription } from "../modules/subscriptions/schema.js";
import { User } from "../modules/users/schema.js";

const decode = Schema.decodeUnknownSync;

const sampleIds = {
  userId: "00000000-0000-4000-8000-000000000401",
  topicId: "00000000-0000-4000-8000-000000000402",
  subscriptionId: "00000000-0000-4000-8000-000000000404",
  eventId: "00000000-0000-4000-8000-000000000405",
};

const user = decode(User)({
  id: sampleIds.userId,
  email: "fan@example.com",
  timezone: "America/New_York",
});

const topic = decode(TopicWithEvents)({
  id: sampleIds.topicId,
  _tag: "sports",
  title: "Celtics",
  events: [
    {
      id: sampleIds.eventId,
      startUtc: "2026-02-10T00:30:00Z",
      site: "home",
      teamName: "Celtics",
      opponent: "Raptors",
    },
  ],
});

const baseSubscription = decode(Subscription)({
  id: sampleIds.subscriptionId,
  userId: sampleIds.userId,
  topicId: sampleIds.topicId,
  schedule: { _tag: "fixed", sendAtSecondsLocal: 9 * 3600 },
  enabled: true,
  lastSentAt: null,
});

type InMemoryState = {
  users: readonly User[];
  topics: ReadonlyMap<string, TopicWithEvents>;
  subscriptions: readonly Subscription[];
};

const makeDatabaseLayer = (state: InMemoryState) => {
  let subscriptions = [...state.subscriptions];

  return Layer.succeed(
    DatabaseOld,
    DatabaseOld.make({
      loadUsers: () => Effect.succeed([...state.users]),
      loadSubscriptions: () => Effect.succeed(subscriptions),
      loadTopic: (topicId) =>
        Effect.succeed(state.topics.get(topicId) ?? topic),
      updateSubscription: (subscription) =>
        Effect.sync(() => {
          const index = subscriptions.findIndex(
            (s) => s.id === subscription.id,
          );
          if (index === -1) {
            subscriptions = [...subscriptions, subscription];
            return;
          }

          subscriptions = subscriptions.map((value, valueIndex) =>
            valueIndex === index ? subscription : value,
          );
        }),
    }),
  );
};

describe("DatabaseOld contract", () => {
  it.effect("loads users, subscriptions, and topic", () =>
    Effect.gen(function* () {
      const database = yield* DatabaseOld;

      const [users, subscriptions, loadedTopic] = yield* Effect.all([
        database.loadUsers(),
        database.loadSubscriptions(),
        database.loadTopic(sampleIds.topicId),
      ]);

      expect(users).toHaveLength(1);
      expect(subscriptions).toHaveLength(1);
      expect(loadedTopic.events).toHaveLength(1);
    }).pipe(
      Effect.provide(
        makeDatabaseLayer({
          users: [user],
          topics: new Map([[sampleIds.topicId, topic]]),
          subscriptions: [baseSubscription],
        }),
      ),
    ),
  );

  it.effect("updates existing subscriptions", () =>
    Effect.gen(function* () {
      const database = yield* DatabaseOld;
      const nextSentAt = decode(Schema.DateTimeUtc)("2026-02-11T15:00:00.000Z");

      yield* database.updateSubscription({
        ...baseSubscription,
        lastSentAt: nextSentAt,
      });

      const subscriptions = yield* database.loadSubscriptions();
      expect(subscriptions).toHaveLength(1);
      expect(
        DateTime.formatIso(subscriptions[0]?.lastSentAt ?? nextSentAt),
      ).toBe(DateTime.formatIso(nextSentAt));
    }).pipe(
      Effect.provide(
        makeDatabaseLayer({
          users: [user],
          topics: new Map([[sampleIds.topicId, topic]]),
          subscriptions: [baseSubscription],
        }),
      ),
    ),
  );
});
