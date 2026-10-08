import { describe, expect, it } from "vitest";
import { Schema, DateTime } from "effect";
import { EventWithParticipants } from "@dtpt/core/modules/events/participants/schema";
import { EventId } from "@dtpt/core/modules/events/schema";
import { SubscriptionWithEvents } from "@dtpt/core/modules/subscriptions/schema";
import {
  card,
  fighterA,
  fighterB,
  all,
  ny,
} from "@dtpt/core/modules/mma/__tests__/fixtures";
import { scheduleRows } from "../schedule.js";

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
    expect(rows[0]?.mma?.reasons).toEqual([fighterA, fighterB, all]);
    expect(rows[0]?.mma?.followedFighterIds).toEqual(
      new Set([fighterA.id, fighterB.id]),
    );
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
      scheduleRows([pick(fighterB)], ny, [fighterA, fighterB], now)[0]?.mma
        ?.reasons,
    ).toEqual([fighterB]);
  });
  it("uses the card start for local dates and enriches rows with main-card times", () => {
    const rows = scheduleRows([pick(all)], ny, [all], now);
    expect(rows[0]?.time).toBe("7:00 PM");
    expect(rows[0]?.day).toBe("Today");
    expect(rows[0]?.mma?.timing).toContain("Main card: Oct 3, 10:00 PM EDT");
    expect(
      scheduleRows(
        [pick(all, [{ ...card, availability: "cancelled" }])],
        ny,
        [all],
        now,
      ),
    ).toEqual([]);
  });
});
