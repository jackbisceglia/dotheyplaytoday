import { describe, expect, it } from "vitest";
import { DateTime, Schema } from "effect";

import { EventWithParticipants } from "../../events/joined.js";
import { MmaParticipant } from "../../events/participants/variants/mma.schema.js";
import { MmaEvent } from "../../events/variants/mma.schema.js";
import { SubscriptionTiming } from "../../subscriptions/time.js";
import {
  hasConflictingSelections,
  toggleSubscriptionSelection,
} from "../../subscriptions/selection.js";
import { mmaTimingText } from "../time.js";
import { all, card, fighterA, fighterB, numbered, ny } from "./fixtures.js";

if (card.details._tag !== "mma_card") throw new Error("Expected MMA fixture");
const details = card.details;

describe("MMA selection and timing", () => {
  it("replaces coverage while preserving fighters, and counts it as one pick", () => {
    expect(
      toggleSubscriptionSelection([fighterA, fighterB, numbered], all),
    ).toEqual([fighterA, fighterB, all]);
    expect(toggleSubscriptionSelection([fighterA, all], all)).toEqual([
      fighterA,
    ]);
    expect(toggleSubscriptionSelection([all], fighterA)).toEqual([
      all,
      fighterA,
    ]);
    expect(hasConflictingSelections([numbered, all])).toBe(true);
    expect(hasConflictingSelections([fighterA, all])).toBe(false);
  });
  it("uses earliest known broadcast start, never an individual fight time", () => {
    expect(mmaTimingText(details, ny)).toContain(
      "Main card: Oct 3, 10:00 PM EDT",
    );
    expect(mmaTimingText(details, ny)).not.toContain(
      "Individual fight times are not scheduled",
    );
    expect(
      SubscriptionTiming.formatLocalDate(
        card.startsAt,
        DateTime.zoneMakeNamedUnsafe("Asia/Tokyo"),
      ),
    ).toBe("2026-10-04");
  });
  it("requires event starts and complete, ordered broadcast timing keys", () => {
    const encoded = Schema.encodeSync(EventWithParticipants)(card);
    expect(() =>
      Schema.decodeUnknownSync(EventWithParticipants)({
        ...encoded,
        startsAt: null,
      }),
    ).toThrow();
    const { startsAt: _startsAt, ...missingStart } = encoded;
    expect(() =>
      Schema.decodeUnknownSync(EventWithParticipants)(missingStart),
    ).toThrow();
    const encodedDetails = Schema.encodeSync(MmaEvent)(details);
    expect(() =>
      Schema.decodeUnknownSync(MmaEvent)({
        ...encodedDetails,
        timings: {},
      }),
    ).toThrow();
    for (const invalid of [
      { main: encodedDetails.timings.main },
      {
        early: encodedDetails.timings.early,
        prelims: encodedDetails.timings.main,
        main: encodedDetails.timings.prelims,
      },
    ]) {
      expect(() =>
        Schema.decodeUnknownSync(MmaEvent)({
          ...encodedDetails,
          timings: invalid,
        }),
      ).toThrow();
    }
    expect(() =>
      Schema.decodeUnknownSync(MmaEvent)({
        ...encodedDetails,
        timings: { ...encodedDetails.timings, early: null },
      }),
    ).toThrow();
  });
  it("requires a structured venue and a known fight placement", () => {
    const encoded = Schema.encodeSync(MmaEvent)(details);
    for (const venue of [null, "Test arena", { title: "Test arena" }]) {
      expect(() =>
        Schema.decodeUnknownSync(MmaEvent)({ ...encoded, venue }),
      ).toThrow();
    }
    const participant = card.participants[0];
    if (!participant) throw new Error("Expected fighter participant");
    for (const invalid of [
      { ...participant.details, placement: "unknown" },
      { ...participant.details, fightId: "" },
    ]) {
      expect(() => Schema.decodeUnknownSync(MmaParticipant)(invalid)).toThrow();
    }
  });
  it("formats broadcast segments across the DST fallback independently", () => {
    const text = mmaTimingText(
      {
        ...details,
        timings: {
          early: DateTime.makeUnsafe("2026-11-01T05:00:00Z"),
          prelims: DateTime.makeUnsafe("2026-11-01T05:30:00Z"),
          main: DateTime.makeUnsafe("2026-11-01T06:30:00Z"),
        },
      },
      ny,
    );
    expect(text).toContain("Prelims: Nov 1, 1:30 AM EDT");
    expect(text).toContain("Main card: Nov 1, 1:30 AM EST");
  });
});
