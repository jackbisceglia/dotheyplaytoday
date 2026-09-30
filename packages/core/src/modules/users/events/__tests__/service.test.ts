import { TestClock } from "effect/testing";
import { describe, expect, it } from "@effect/vitest";
import { DateTime, Effect, Layer, Schema } from "effect";

import { Subject } from "../../../subjects/schema.js";
import { SubscriptionWithSubject } from "../../../subscriptions/schema.js";
import { Subscriptions } from "../../../subscriptions/service.js";
import { User } from "../../schema.js";
import { UserEvents, UserEventsLayer } from "../service.js";
import { Events, EventWithParticipants } from "../../../events/service.js";

const user = Schema.decodeUnknownSync(User)({
  id: "00000000-0000-4000-8000-000000000001",
  email: "user@example.com",
  timezone: "America/New_York",
  name: null,
  emailVerified: true,
  unsubscribeToken: "00000000-0000-4000-8000-000000000002",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
});
const team = (id: string, name: string) =>
  Schema.decodeUnknownSync(Subject)({
    id,
    _tag: "sports_team",
    details: {
      _tag: "sports_team",
      leagueId: "nba",
      display: name,
      name,
      location: name,
      abbreviation: "NBA",
    },
  });
const celtics = team("00000000-0000-4000-8000-000000000003", "Boston Celtics");
const knicks = team("00000000-0000-4000-8000-000000000004", "New York Knicks");
const pick = (subject: Subject) =>
  Schema.decodeUnknownSync(SubscriptionWithSubject)({
    id: subject.id,
    subjectId: subject.id,
    userId: user.id,
    subject,
    schedule: { _tag: "fixed_local_time", sendAtSecondsLocal: 32400 },
    lastSentAt: null,
  });
const game = (id: string, startsAt: string) =>
  Schema.decodeUnknownSync(EventWithParticipants)({
    id,
    startsAt,
    _tag: "sports_game",
    availability: "active",
    sourceId: `sports_game:manual:${id}`,
    details: { _tag: "sports_game", leagueId: "nba" },
    participants: [
      {
        id: "00000000-0000-4000-8000-000000000011",
        eventId: id,
        _tag: "sports_game",
        details: { _tag: "sports_game", title: "Boston Celtics", role: "home" },
      },
    ],
  });
const utc = Schema.decodeUnknownSync(Schema.DateTimeUtcFromString);

describe("user schedule", () => {
  it.effect(
    "combines subscribed subjects, deduplicates games, preserves participants, and orders starts",
    () => {
      const shared = game(
        "00000000-0000-4000-8000-000000000010",
        "2026-03-09T23:00:00.000Z",
      );
      const earlier = game(
        "00000000-0000-4000-8000-000000000020",
        "2026-03-08T06:00:00.000Z",
      );
      return Effect.gen(function* () {
        yield* TestClock.setTime(
          DateTime.toEpochMillis(utc("2026-03-08T12:00:00.000Z")),
        );
        const userEvents = yield* UserEvents;
        const result = yield* userEvents.listForUser(user);
        expect(result.today).toBe("2026-03-08");
        expect(result.events.map((event) => event.id)).toEqual([
          earlier.id,
          shared.id,
        ]);
        expect(result.events[1]?.subjectIds).toEqual([celtics.id, knicks.id]);
        expect(result.events[1]?.participants).toEqual(shared.participants);
      }).pipe(
        Effect.provide(UserEventsLayer),
        Effect.provide([
          Layer.mock(Subscriptions, {
            listForUser: (id) => {
              expect(id).toBe(user.id);
              return Effect.succeed([pick(celtics), pick(knicks)]);
            },
          }),
          Layer.mock(Events, {
            listBySubject: (id, options) => {
              expect(options?.availability).toBeUndefined(); // Default is active only.
              expect(
                options?.range && DateTime.formatIso(options.range.from),
              ).toBe("2026-03-08T05:00:00.000Z");
              expect(
                options?.range && DateTime.formatIso(options.range.to),
              ).toBe("2026-03-15T04:00:00.000Z");
              return Effect.succeed(
                id === celtics.id ? [shared, earlier] : [shared],
              );
            },
          }),
        ]),
      );
    },
  );

  it.effect(
    "returns an empty schedule without event lookups for an empty roster",
    () =>
      Effect.gen(function* () {
        yield* TestClock.setTime(
          DateTime.toEpochMillis(utc("2026-02-10T04:00:00.000Z")),
        );
        const userEvents = yield* UserEvents;
        const result = yield* userEvents.listForUser(user);
        expect(result.today).toBe("2026-02-09");
        expect(result.events).toEqual([]);
      }).pipe(
        Effect.provide(UserEventsLayer),
        Effect.provide([
          Layer.mock(Subscriptions, { listForUser: () => Effect.succeed([]) }),
          Layer.mock(Events, {
            listBySubject: () => Effect.die("Unexpected event lookup"),
          }),
        ]),
      ),
  );
});
