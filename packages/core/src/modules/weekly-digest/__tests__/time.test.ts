import { describe, expect, it } from "@effect/vitest";
import { DateTime } from "effect";

import { weeklyDigestWindow } from "../time.js";

const windowAt = (instant: string, timezone = "America/New_York") =>
  weeklyDigestWindow(
    DateTime.makeUnsafe(instant),
    DateTime.zoneMakeNamedUnsafe(timezone),
  );

describe("weekly digest timing", () => {
  it("uses Monday 9 AM local with a one-hour retry window", () => {
    expect(windowAt("2026-10-05T12:59:59Z").isDue).toBe(false);
    expect(windowAt("2026-10-05T13:00:00Z").isDue).toBe(true);
    expect(windowAt("2026-10-05T13:59:59Z").isDue).toBe(true);
    expect(windowAt("2026-10-05T14:00:00Z").isDue).toBe(false);
    expect(windowAt("2026-10-06T13:00:00Z").isDue).toBe(false);
    expect(windowAt("2026-10-04T13:00:00Z").isDue).toBe(false);
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

  it("uses the user's Monday even if UTC is still Sunday, and supports fractional offsets", () => {
    const kiribati = windowAt("2026-10-04T19:00:00Z", "Pacific/Kiritimati");
    expect(kiribati.weekStart).toBe("2026-10-05");
    expect(kiribati.isDue).toBe(true);
    expect(windowAt("2026-10-05T03:15:00Z", "Asia/Kathmandu").isDue).toBe(true);
    expect(windowAt("2026-10-05T03:30:00Z", "Asia/Kolkata").isDue).toBe(true);
  });
});
