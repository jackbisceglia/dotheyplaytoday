import { describe, expect, it } from "vitest";
import { DateTime, Schema } from "effect";

import { EventWithParticipants } from "../../events/participants/schema.js";
import { MmaCard } from "../../events/variants/mma.schema.js";
import { SubscriptionTiming } from "../../subscriptions/time.js";
import { hasSingleMmaCoverage, toggleSubject } from "../selection.js";
import { mmaTimingText } from "../time.js";
import { all, card, fighterA, fighterB, numbered, ny } from "./fixtures.js";

if (card.details._tag !== "mma_card") throw new Error("Expected MMA fixture");
const details = card.details;

describe("MMA selection and timing", () => {
  it("replaces coverage while preserving fighters, and counts it as one pick", () => {
    expect(toggleSubject([fighterA, fighterB, numbered], all)).toEqual([
      fighterA,
      fighterB,
      all,
    ]);
    expect(toggleSubject([fighterA, all], all)).toEqual([fighterA]);
    expect(toggleSubject([all], fighterA)).toEqual([all, fighterA]);
    expect(hasSingleMmaCoverage([numbered, all])).toBe(false);
    expect(hasSingleMmaCoverage([fighterA, all])).toBe(true);
  });
  it("uses earliest known broadcast start, never an individual fight time", () => {
    expect(mmaTimingText(details, ny)).toContain(
      "Main card: Oct 3, 10:00 PM EDT",
    );
    expect(mmaTimingText(details, ny)).toContain(
      "Individual fight times are not scheduled",
    );
    expect(
      SubscriptionTiming.formatLocalDate(
        card.startsAt,
        DateTime.zoneMakeNamedUnsafe("Asia/Tokyo"),
      ),
    ).toBe("2026-10-04");
  });
  it("requires event and main-card starts while allowing unannounced prelims", () => {
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
    const encodedDetails = Schema.encodeSync(MmaCard)(details);
    expect(() =>
      Schema.decodeUnknownSync(MmaCard)({
        ...encodedDetails,
        timings: {},
      }),
    ).toThrow();
    const mainOnly = Schema.decodeUnknownSync(MmaCard)({
      ...encodedDetails,
      timings: { mainCard: encodedDetails.timings.mainCard },
    });
    expect(mmaTimingText(mainOnly, ny)).not.toContain("Prelims:");
  });
  it("formats broadcast segments across the DST fallback independently", () => {
    const text = mmaTimingText(
      {
        ...details,
        timings: {
          prelims: DateTime.makeUnsafe("2026-11-01T05:30:00Z"),
          mainCard: DateTime.makeUnsafe("2026-11-01T06:30:00Z"),
        },
      },
      ny,
    );
    expect(text).toContain("Prelims: Nov 1, 1:30 AM EDT");
    expect(text).toContain("Main card: Nov 1, 1:30 AM EST");
  });
});
