import { describe, expect, it } from "vitest";
import { DateTime, Schema } from "effect";
import { Subject } from "@dtpt/core/modules/subjects/schema";
import { SubscribedEvent } from "@dtpt/core/modules/events/read-models";

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
  Schema.decodeUnknownSync(SubscribedEvent)({
    id,
    startsAt,
    _tag: "sports_game",
    availability: "active",
    sourceId: `sports_game:manual:${id}`,
    details: { _tag: "sports_game", leagueId: "nba" },
    subjectIds: [celtics.id, knicks.id],
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
const schedule = {
  today: "2026-03-08",
  timezone: DateTime.zoneMakeNamedUnsafe("America/New_York"),
  events: [
    game("00000000-0000-4000-8000-000000000010", "2026-03-09T00:30:00.000Z"),
    game("00000000-0000-4000-8000-000000000020", "2026-03-09T17:00:00.000Z"),
  ],
};

describe("dashboard schedule", () => {
  it("uses the user's calendar and local time, with a row for each subscribed team", () => {
    const rows = scheduleRows(schedule, [celtics, knicks], [celtics, knicks]);
    expect(
      rows.map((row) => [row.day, row.time, row.opponent, row.today]),
    ).toEqual([
      ["Today", "8:30 PM", "vs Knicks", true],
      ["Today", "8:30 PM", "at Celtics", true],
      ["Mon 9", "1:00 PM", "vs Knicks", false],
      ["Mon 9", "1:00 PM", "at Celtics", false],
    ]);
    expect(todayTeams(schedule, [celtics, knicks])).toEqual([celtics, knicks]);
  });

  it("keeps doubleheaders separate and names each playing team only once", () => {
    const doubleheader = {
      ...schedule,
      events: [
        game(
          "00000000-0000-4000-8000-000000000010",
          "2026-03-09T00:30:00.000Z",
        ),
        game(
          "00000000-0000-4000-8000-000000000030",
          "2026-03-09T02:30:00.000Z",
        ),
      ],
    };
    expect(
      scheduleRows(doubleheader, [celtics], [celtics, knicks]),
    ).toHaveLength(2);
    expect(todayTeams(doubleheader, [celtics])).toEqual([celtics]);
  });

  it("supports empty and one-game states and retains unknown opponent names", () => {
    const empty = { ...schedule, events: [] };
    expect(scheduleRows(empty, [celtics], [])).toEqual([]);
    expect(todayTeams(empty, [celtics])).toEqual([]);
    expect(
      scheduleRows(
        { ...schedule, events: schedule.events.slice(0, 1) },
        [celtics],
        [],
      ),
    ).toMatchObject([{ opponent: "vs New York Knicks", today: true }]);
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
