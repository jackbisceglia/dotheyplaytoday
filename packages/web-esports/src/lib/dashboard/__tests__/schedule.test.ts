import { describe, expect, it } from "vitest";
import { DateTime, Schema } from "effect";
import { Subject } from "@dtpt/core/modules/subjects/schema";
import { EventWithParticipants } from "@dtpt/core/modules/events/participants/schema";
import { SubscriptionWithSubject } from "@dtpt/core/modules/subscriptions/schema";

import { scheduleRows } from "../schedule.js";

const team = (id: string, display: string, name: string) =>
  Schema.decodeUnknownSync(Subject)({
    id,
    _tag: "esports_team",
    details: {
      _tag: "esports_team",
      gameId: "cod",
      display,
      name,
      location: name,
      abbreviation: "TX",
    },
  });
const optic = team(
  "00000000-0000-4000-8000-000000000001",
  "OpTic Texas",
  "OpTic",
);
const thieves = team(
  "00000000-0000-4000-8000-000000000002",
  "Los Angeles Thieves",
  "Thieves",
);
const match = (id: string, startsAt: string) =>
  Schema.decodeUnknownSync(EventWithParticipants)({
    id,
    startsAt,
    _tag: "esports_match",
    availability: "active",
    sourceId: `esports_match:manual:${id}`,
    details: { _tag: "esports_match", gameId: "cod" },
    participants: [optic, thieves].map((subject) => ({
      id: subject.id,
      eventId: id,
      _tag: "esports_match",
      details: {
        _tag: "esports_match",
        title: subject.details.display,
      },
    })),
  });
const timezone = DateTime.zoneMakeNamedUnsafe("America/New_York");
const now = DateTime.makeUnsafe("2026-03-08T12:00:00Z");
const todayMatch = match(
  "00000000-0000-4000-8000-000000000010",
  "2026-03-09T00:30:00.000Z",
);
const tomorrowMatch = match(
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
  subscription(optic, [tomorrowMatch, todayMatch]),
  subscription(thieves, [tomorrowMatch, todayMatch]),
];
const rows = (
  value: typeof schedule,
  catalog: readonly Subject[] = [optic, thieves],
) => scheduleRows(value, timezone, catalog, now);

describe("dashboard schedule", () => {
  it("sorts subscription batches by start and uses the user's calendar and local time", () => {
    const result = rows(schedule);
    expect(result.map((row) => [row.day, row.time, row.opponent])).toEqual([
      ["Today", "8:30 PM", "Thieves"],
      ["Monday, Mar 9", "1:00 PM", "Thieves"],
    ]);
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
    expect(rows(formatted)[0]?.opponentTeam).toEqual(thieves);
    expect(rows(formatted).map((row) => [row.teamName, row.opponent])).toEqual([
      ["OpTic", "Thieves"],
      ["OpTic", "Thieves"],
    ]);
  });

  it("preserves both participants in listed order when the subscribed display is unrecognized", () => {
    const renamed = {
      ...thieves,
      details: { ...thieves.details, display: "An unrecognized display name" },
    };
    const schedule = [subscription(renamed, [todayMatch])];
    expect(rows(schedule)).toMatchObject([
      { team: renamed, teamName: "OpTic", opponent: "Thieves" },
    ]);
    expect(rows(schedule, [])).toMatchObject([
      { teamName: "OpTic Texas", opponent: "Los Angeles Thieves" },
    ]);
  });

  it("deduplicates matching participant sets at the same start, even with different IDs and ordering", () => {
    const duplicate = {
      ...todayMatch,
      id: tomorrowMatch.id,
      participants: [...todayMatch.participants]
        .reverse()
        .map((participant) => ({
          ...participant,
          details: {
            ...participant.details,
            title: `  ${participant.details.title.toUpperCase()}  `,
          },
        })),
    };
    expect(
      rows([
        subscription(optic, [todayMatch]),
        subscription(thieves, [duplicate]),
      ]),
    ).toHaveLength(1);
    expect(
      rows([subscription(optic, [todayMatch, tomorrowMatch])]),
    ).toHaveLength(2);
    expect(rows([subscription(thieves, [todayMatch])])).toMatchObject([
      { team: thieves, opponent: "OpTic" },
    ]);
  });

  it("retains both subscribed teams on a single matchup, in either subscription order", () => {
    expect(rows(schedule)).toMatchObject([
      { team: optic, opponentTeam: thieves },
      { team: optic, opponentTeam: thieves },
    ]);
    expect(rows([...schedule].reverse())).toMatchObject([
      { team: thieves, opponentTeam: optic },
      { team: thieves, opponentTeam: optic },
    ]);
    expect(rows([subscription(optic, [todayMatch])])).toMatchObject([
      { team: optic, opponentTeam: undefined },
    ]);
  });

  it("keeps same-day rematches separate", () => {
    const schedule = [
      subscription(optic, [
        todayMatch,
        match(
          "00000000-0000-4000-8000-000000000030",
          "2026-03-09T02:30:00.000Z",
        ),
      ]),
    ];
    expect(rows(schedule)).toHaveLength(2);
  });

  it("supports empty and one-match states and retains unknown opponent names", () => {
    expect(rows([])).toEqual([]);
    expect(rows([subscription(optic, [])])).toEqual([]);
    expect(rows([subscription(optic, [todayMatch])], [])).toMatchObject([
      { opponent: "Los Angeles Thieves", day: "Today" },
    ]);
  });
});
