import { describe, expect, it } from "@effect/vitest";
import { DateTime } from "effect";

import { isWeeklyDigestBatchTime, weeklyDigestWindow } from "../time.js";

const windowAt = (instant: string, timezone = "America/New_York") =>
  weeklyDigestWindow(
    DateTime.makeUnsafe(instant),
    DateTime.zoneMakeNamedUnsafe(timezone),
  );

describe("weekly digest timing", () => {
  it("selects exactly one Monday 9 AM Eastern batch across daylight saving changes", () => {
    for (const [chosen, skipped] of [
      ["2026-10-05T13:00:00Z", "2026-10-05T14:00:00Z"],
      ["2026-11-02T14:00:00Z", "2026-11-02T13:00:00Z"],
      ["2026-03-09T13:00:00Z", "2026-03-09T14:00:00Z"],
    ] as const) {
      expect(isWeeklyDigestBatchTime(DateTime.makeUnsafe(chosen))).toBe(true);
      expect(isWeeklyDigestBatchTime(DateTime.makeUnsafe(skipped))).toBe(false);
    }
    expect(
      isWeeklyDigestBatchTime(DateTime.makeUnsafe("2026-10-06T13:00:00Z")),
    ).toBe(false);
    expect(
      isWeeklyDigestBatchTime(DateTime.makeUnsafe("2026-10-05T13:15:00Z")),
    ).toBe(false);
  });

  it("queries local Monday midnight through next Monday midnight", () => {
    const window = windowAt("2026-10-05T13:00:00Z");
    expect(window.weekStart).toBe("2026-10-05");
    expect(DateTime.formatIso(window.from)).toBe("2026-10-05T04:00:00.000Z");
    expect(DateTime.formatIso(window.to)).toBe("2026-10-12T04:00:00.000Z");
  });

  it("handles DST without assuming that a week is 168 UTC hours", () => {
    const spring = windowAt("2026-03-02T14:00:00Z");
    const fall = windowAt("2026-10-26T13:00:00Z");
    expect(
      (DateTime.toEpochMillis(spring.to) -
        DateTime.toEpochMillis(spring.from)) /
        3_600_000,
    ).toBe(167);
    expect(
      (DateTime.toEpochMillis(fall.to) - DateTime.toEpochMillis(fall.from)) /
        3_600_000,
    ).toBe(169);
    expect(DateTime.formatIso(fall.to)).toBe("2026-11-02T05:00:00.000Z");
  });

  it("covers the same week even when the batch arrives on local Sunday, and supports fractional offsets", () => {
    const kiribati = windowAt("2026-10-05T09:00:00Z", "Pacific/Kiritimati");
    expect(kiribati.weekStart).toBe("2026-10-05");
    expect(DateTime.formatIso(kiribati.from)).toBe("2026-10-04T10:00:00.000Z");
    const kathmandu = windowAt("2026-10-05T13:00:00Z", "Asia/Kathmandu");
    expect(DateTime.formatIso(kathmandu.from)).toBe("2026-10-04T18:15:00.000Z");
    const honolulu = windowAt("2026-10-05T09:00:00Z", "Pacific/Honolulu");
    expect(honolulu.weekStart).toBe("2026-10-05");
    expect(DateTime.formatIso(honolulu.from)).toBe("2026-10-05T10:00:00.000Z");
  });
});
