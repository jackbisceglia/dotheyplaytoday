import { describe, expect, it } from "vitest";
import { DateTime, Schema } from "effect";
import { Subject } from "@dtpt/core/modules/subjects/schema";
import { EventWithParticipants } from "@dtpt/core/modules/events/participants/schema";
import { SubscriptionWithSubject } from "@dtpt/core/modules/subscriptions/schema";

import { scheduleRows, todayHeading, todayTeams } from "../schedule.js";

const team = (id: string, display: string, name: string) =>
  Schema.decodeUnknownSync(Subject)({
    id,
    _tag: "sports_team",
    details: {
      _tag: "sports_team",
      leagueId: "nba",
      display,
      name,
      location: name,
      abbreviation: "BOS",
    },
  });
const celtics = team(
  "00000000-0000-4000-8000-000000000001",
  "Boston Celtics",
  "Celtics",
);
const knicks = team(
  "00000000-0000-4000-8000-000000000002",
  "New York Knicks",
  "Knicks",
);
const game = (id: string, startsAt: string) =>
  Schema.decodeUnknownSync(EventWithParticipants)({
    id,
    startsAt,
    _tag: "sports_game",
    availability: "active",
    sourceId: `sports_game:manual:${id}`,
    details: { _tag: "sports_game", leagueId: "nba" },
    participants: [celtics, knicks].map((subject, index) => ({
      id: subject.id,
      eventId: id,
      _tag: "sports_game",
      details: {
        _tag: "sports_game",
        role: index === 0 ? "home" : "away",
        title: subject.details.display,
      },
    })),
  });
const timezone = DateTime.zoneMakeNamedUnsafe("America/New_York");
const now = DateTime.makeUnsafe("2026-03-08T12:00:00Z");
const todayGame = game(
  "00000000-0000-4000-8000-000000000010",
  "2026-03-09T00:30:00.000Z",
);
const tomorrowGame = game(
  "00000000-0000-4000-8000-000000000020",
  "2026-03-09T17:00:00.000Z",
);
const subscription = (
  subject: Subject,
  events: readonly EventWithParticipants[],
) => ({
  ...Schema.decodeUnknownSync(SubscriptionWithSubject)({
    id: subject.id,
    userId: "00000000-0000-4000-8000-000000000003",
    subjectId: subject.id,
    subject,
    schedule: { _tag: "fixed_local_time", sendAtSecondsLocal: 32400 },
    lastSentAt: null,
  }),
  events,
});
// Each team's batch is deliberately out of order; rendering sorts across both.
const schedule = [
  subscription(celtics, [tomorrowGame, todayGame]),
  subscription(knicks, [tomorrowGame, todayGame]),
];
const rows = (
  value: typeof schedule,
  catalog: readonly Subject[] = [celtics, knicks],
) => scheduleRows(value, timezone, catalog, now);

describe("dashboard schedule", () => {
  it("sorts subscription batches by start and uses the user's calendar and local time", () => {
    const result = rows(schedule);
    expect(
      result.map((row) => [row.day, row.time, row.opponent, row.today]),
    ).toEqual([
      ["Today", "8:30 PM", "vs Knicks", true],
      ["Today", "8:30 PM", "at Celtics", true],
      ["Mon 9", "1:00 PM", "vs Knicks", false],
      ["Mon 9", "1:00 PM", "at Celtics", false],
    ]);
    expect(todayTeams(result)).toEqual([celtics, knicks]);
  });

  it("matches participants and catalog names despite case and surrounding whitespace", () => {
    const formatted = schedule.map((pick) => ({
      ...pick,
      events: pick.events.map((event) => ({
        ...event,
        participants: event.participants.map((participant) => ({
          ...participant,
          details: {
            ...participant.details,
            title: `  ${participant.details.title.toUpperCase()}  `,
          },
        })),
      })),
    }));
    expect(rows(formatted).map((row) => [row.teamName, row.opponent])).toEqual([
      ["Celtics", "vs Knicks"],
      ["Knicks", "at Celtics"],
      ["Celtics", "vs Knicks"],
      ["Knicks", "at Celtics"],
    ]);
  });

  it("preserves both participants in away-at-home order when the subscribed display is unrecognized", () => {
    const renamed = {
      ...celtics,
      details: { ...celtics.details, display: "An unrecognized display name" },
    };
    const schedule = [subscription(renamed, [todayGame])];
    expect(rows(schedule)).toMatchObject([
      { team: renamed, teamName: "Knicks", opponent: "at Celtics" },
    ]);
    expect(rows(schedule, [])).toMatchObject([
      { teamName: "New York Knicks", opponent: "at Boston Celtics" },
    ]);
  });

  it("keeps doubleheaders separate and names each playing team only once", () => {
    const schedule = [
      subscription(celtics, [
        todayGame,
        game(
          "00000000-0000-4000-8000-000000000030",
          "2026-03-09T02:30:00.000Z",
        ),
      ]),
    ];
    expect(rows(schedule)).toHaveLength(2);
    expect(todayTeams(rows(schedule))).toEqual([celtics]);
  });

  it("supports empty and one-game states and retains unknown opponent names", () => {
    expect(rows([])).toEqual([]);
    expect(rows([subscription(celtics, [])])).toEqual([]);
    expect(todayTeams(rows([]))).toEqual([]);
    expect(rows([subscription(celtics, [todayGame])], [])).toMatchObject([
      { opponent: "vs New York Knicks", today: true },
    ]);
  });

  it("formats zero, one, two, and several playing teams", () => {
    expect(todayHeading([])).toEqual({ lead: "No games", answer: "today." });
    expect(todayHeading([celtics])).toEqual({
      lead: "The Celtics",
      answer: "play today.",
    });
    expect(todayHeading([celtics, knicks])).toEqual({
      lead: "The Celtics and Knicks",
      answer: "play today.",
    });
    expect(todayHeading([celtics, knicks, celtics])).toEqual({
      lead: "3 of your teams",
      answer: "play today.",
    });
  });
});
