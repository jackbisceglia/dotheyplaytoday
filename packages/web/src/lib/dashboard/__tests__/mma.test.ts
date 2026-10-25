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
      row?.sections[0]?.fights.map((fight) => ({
        id: fight.id,
        fighters: fight.fighters,
      })),
    ).toEqual([
      { id: "fight-1", fighters: ["A"] },
      { id: "fight-2", fighters: ["B"] },
    ]);
    expect(
      scheduleRows([pick(all)], ny, [all], now)[0]?.sections[0]?.fights[0]
        ?.fighters,
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
    expect(rows[0]?.day.name).toBe("Today");
    expect(
      rows[0]?.sections.map((section) => [section.name, section.time]),
    ).toEqual([["Main card", "10:00 PM"]]);
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
    expect(row?.sections).toEqual([]);
  });

  it("labels a card with its event and bolds only followed headliners", () => {
    const titled = (title: string, category: "numbered" | "fight_night") => ({
      ...card,
      details: { ...card.details, title, category },
    });
    const heading = (event: typeof card, subject = all) => {
      const [row] = scheduleRows([pick(subject, [event])], ny, [subject], now);
      return [row?.label, row?.headliners];
    };

    expect(heading(titled("UFC 333: A vs B", "numbered"), fighterA)).toEqual([
      "UFC 333",
      [
        { name: "A", followed: true },
        { name: "B", followed: false },
      ],
    ]);
    expect(
      heading(titled("UFC Fight Night: Smith vs Jones", "fight_night")),
    ).toEqual([
      "Fight Night",
      [
        { name: "Smith", followed: false },
        { name: "Jones", followed: false },
      ],
    ]);
    expect(heading(card)).toEqual([undefined, []]);

    const namesake = Schema.decodeUnknownSync(Subject)({
      ...fighterA,
      id: "10000000-0000-4000-8000-000000000005",
      details: { ...fighterA.details, display: "Other B" },
    });
    expect(heading(titled("UFC 333: A vs B", "numbered"), namesake)).toEqual([
      "UFC 333",
      [
        { name: "A", followed: false },
        { name: "B", followed: false },
      ],
    ]);

    const withdrawn = {
      ...titled("UFC 333: A vs C", "numbered"),
      participants: card.participants.map((participant) => ({
        ...participant,
        details: {
          ...participant.details,
          fightId:
            participant.details.title === fighterA.details.display
              ? "fight-1"
              : "fight-2",
        },
      })),
    };
    expect(heading(withdrawn, fighterA)).toEqual([
      "UFC 333",
      [
        { name: "A", followed: true },
        { name: "C", followed: false },
      ],
    ]);
  });

  it("splits the lineup into billed sections of surnames in title order", () => {
    const lineup = {
      ...card,
      details: { ...card.details, title: "UFC 1: A vs Yakhyaev" },
      participants: (
        [
          ["Kai Kamaka III", "fight-2", "prelims"],
          ["Jack Della Maddalena", "fight-2", "prelims"],
          [fighterA.details.display, "fight-1", "main"],
          ["Abdul Rakhman Yakhyaev", "fight-1", "main"],
        ] as const
      ).flatMap(([title, fightId, placement]) =>
        card.participants.slice(0, 1).map((participant) => ({
          ...participant,
          details: { ...participant.details, title, fightId, placement },
        })),
      ),
    };
    const [row] = scheduleRows([pick(fighterA, [lineup])], ny, [fighterA], now);

    expect(
      row?.sections.map((section) => [
        section.name,
        section.time,
        section.fights.map((fight) => fight.fighters),
      ]),
    ).toEqual([
      ["Main card", "10:00 PM", [["A", "Yakhyaev"]]],
      ["Prelims", "7:00 PM", [["Della Maddalena", "Kamaka III"]]],
    ]);
  });

  it("keeps sports and UFC rendering independent in a mixed schedule", () => {
    const team = Schema.decodeUnknownSync(Subject)({
      id: "40000000-0000-4000-8000-000000000001",
      _tag: "sports_team",
      details: {
        _tag: "sports_team",
        league: { id: "nba", conferenceId: "east" },
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
