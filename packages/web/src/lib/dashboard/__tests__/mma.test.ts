import { describe, expect, it } from "vitest";
import { Schema, DateTime, Predicate } from "effect";
import { EventWithParticipants } from "@dtpt/core/modules/events/joined";
import { Subject } from "@dtpt/core/modules/subjects/schema";
import { EventId } from "@dtpt/core/modules/events/schema";
import { SubscriptionWithEvents } from "@dtpt/core/modules/subscriptions/schema";
import {
  card,
  fighterA,
  fighterB,
  all,
  ny,
} from "@dtpt/core/modules/mma/__tests__/fixtures";
import { scheduleRows as allScheduleRows } from "../schedule.js";

const scheduleRows = (...args: Parameters<typeof allScheduleRows>) =>
  allScheduleRows(...args).filter((row) => Predicate.isTagged(row, "mma_card"));

const pick = (subject: typeof fighterA, events = [card]) =>
  Schema.decodeUnknownSync(SubscriptionWithEvents)({
    id: subject.id,
    userId: "30000000-0000-4000-8000-000000000001",
    subjectId: subject.id,
    subject,
    schedule: { _tag: "fixed_local_time", sendAtSecondsLocal: 32400 },
    lastSentAt: null,
    events: events.map((event) =>
      Schema.encodeSync(EventWithParticipants)(event),
    ),
  });
const now = DateTime.makeUnsafe("2026-10-03T12:00:00Z");

describe("UFC schedule", () => {
  it("collects all reasons and highlights both fighters in one stable card row", () => {
    const rows = scheduleRows(
      [pick(fighterA), pick(fighterB), pick(all)],
      ny,
      [fighterA, fighterB, all],
      now,
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]?.subjects).toEqual([fighterA, fighterB, all]);
  });
  it("groups participant JSON by fightId, independent of row order", () => {
    const grouped = {
      ...card,
      participants: card.participants
        .map((participant, index) => ({
          ...participant,
          details: {
            ...participant.details,
            fightId: `fight-${String(index + 1)}`,
          },
        }))
        .toReversed(),
    };
    const [row] = scheduleRows([pick(all, [grouped])], ny, [all], now);
    expect(
      row?.fights.map((fight) => ({
        id: fight.id,
        fighters: fight.fighters.map((fighter) => fighter.subjectId),
      })),
    ).toEqual([
      { id: "fight-1", fighters: [fighterA.id] },
      { id: "fight-2", fighters: [fighterB.id] },
    ]);
    expect(
      scheduleRows([pick(all)], ny, [all], now)[0]?.fights[0]?.fighters,
    ).toHaveLength(2);
  });
  it("keeps distinct same-time cards separate and eligibility through remaining reasons", () => {
    const second = {
      ...card,
      id: EventId.make("20000000-0000-4000-8000-000000000002"),
    };
    expect(
      scheduleRows([pick(all, [card, second])], ny, [all], now),
    ).toHaveLength(2);
    expect(
      scheduleRows([pick(fighterB)], ny, [fighterA, fighterB], now)[0]
        ?.subjects,
    ).toEqual([fighterB]);
  });
  it("uses the card start for local dates and enriches rows with main-card times", () => {
    const rows = scheduleRows([pick(all)], ny, [all], now);
    expect(rows[0]?.time).toBe("7:00 PM");
    expect(rows[0]?.day).toBe("Today");
    expect(rows[0]?.timing).toContain("Main card: Oct 3, 10:00 PM EDT");
    expect(
      scheduleRows(
        [pick(all, [{ ...card, availability: "cancelled" }])],
        ny,
        [all],
        now,
      ),
    ).toEqual([]);
  });
  it("keeps coverage-only cards with no participants and ignores cancelled match reasons", () => {
    const empty = { ...card, participants: [] };
    const [row] = scheduleRows(
      [
        pick(all, [empty, empty]),
        pick(fighterA, [{ ...card, availability: "cancelled" }]),
      ],
      ny,
      [all, fighterA],
      now,
    );

    expect(row?.subjects).toEqual([all]);
    expect(row?.fights).toEqual([]);
  });

  it("keeps sports and UFC rendering independent in a mixed schedule", () => {
    const team = Schema.decodeUnknownSync(Subject)({
      id: "40000000-0000-4000-8000-000000000001",
      _tag: "sports_team",
      details: {
        _tag: "sports_team",
        leagueId: "nba",
        display: "Boston Celtics",
        name: "Celtics",
        location: "Boston",
        abbreviation: "BOS",
      },
    });
    const game = Schema.decodeUnknownSync(EventWithParticipants)({
      ...Schema.encodeSync(EventWithParticipants)(card),
      id: "40000000-0000-4000-8000-000000000002",
      _tag: "sports_game",
      details: { _tag: "sports_game", leagueId: "nba" },
      participants: [],
    });
    const rows = allScheduleRows(
      [pick(all), pick(team, [game])],
      ny,
      [all, team],
      now,
    );

    expect(rows.map((row) => [row._tag, row.title, row.subjects])).toEqual([
      ["mma_card", "UFC test", [all]],
      ["sports_game", "Celtics", [team]],
    ]);
  });
});
