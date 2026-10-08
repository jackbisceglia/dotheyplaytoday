import { describe, expect, it } from "vitest";
import { DateTime, Schema } from "effect";

import { MmaDate } from "../../events/variants/mma.schema.js";
import { SubscriptionTiming } from "../../subscriptions/time.js";
import { hasSingleMmaCoverage, toggleSubject } from "../selection.js";
import {
  eventInRange,
  eventLocalDate,
  mmaCardStart,
  mmaTimingText,
} from "../time.js";
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
    expect(mmaCardStart(details)).toEqual(card.startsAt);
    expect(mmaTimingText(details, ny)).toContain(
      "Main card: Oct 3, 10:00 PM EDT",
    );
    expect(mmaTimingText(details, ny)).toContain(
      "Individual fight times are not scheduled",
    );
    expect(
      eventLocalDate(card, DateTime.zoneMakeNamedUnsafe("Asia/Tokyo")),
    ).toBe("2026-10-04");
  });
  it("handles date-only, dateless and cancelled cards without inventing instants", () => {
    const range = SubscriptionTiming.localDayUtcRange({
      nowUtc: DateTime.makeUnsafe("2026-10-03T12:00:00Z"),
      timezone: ny,
    });
    const unknownTime = {
      ...card,
      startsAt: null,
      details: {
        ...details,
        earlyPrelimsAt: null,
        prelimsAt: null,
        mainCardAt: null,
      },
    };
    expect(mmaCardStart(unknownTime.details)).toBeNull();
    expect(eventLocalDate(unknownTime, ny)).toBe("2026-10-03");
    expect(eventInRange(unknownTime, range, ny)).toBe(true);
    expect(
      eventInRange(
        { ...unknownTime, details: { ...unknownTime.details, date: null } },
        range,
        ny,
      ),
    ).toBe(false);
    expect(
      eventInRange(
        {
          ...unknownTime,
          details: { ...unknownTime.details, date: "2026-10-04" },
        },
        range,
        ny,
      ),
    ).toBe(false);
  });
  it("respects a 25-hour DST day and its exclusive end", () => {
    const range = SubscriptionTiming.localDayUtcRange({
      nowUtc: DateTime.makeUnsafe("2026-11-01T12:00:00Z"),
      timezone: ny,
    });
    expect(
      eventInRange(
        { ...card, startsAt: DateTime.makeUnsafe("2026-11-02T04:59:00Z") },
        range,
        ny,
      ),
    ).toBe(true);
    expect(eventInRange({ ...card, startsAt: range.to }, range, ny)).toBe(
      false,
    );
  });
  it("rejects impossible calendar dates", () => {
    expect(() => Schema.decodeUnknownSync(MmaDate)("2026-02-30")).toThrow();
    expect(Schema.decodeUnknownSync(MmaDate)("2028-02-29")).toBe("2028-02-29");
  });
});
