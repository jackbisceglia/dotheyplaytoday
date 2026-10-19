import { describe, expect, it } from "@effect/vitest";

import { WeeklyDigestSchedule } from "../worker.js";

describe("weekly digest Cloudflare schedule", () => {
  it("registers Monday by name at both Eastern-time UTC candidates", () => {
    // Cloudflare uses 1=Sunday, unlike Unix cron. Testing only the handler's
    // Monday guard missed the October 19 batch: no Monday event was scheduled.
    // https://developers.cloudflare.com/workers/configuration/cron-triggers/#supported-cron-expressions
    expect(WeeklyDigestSchedule).toBe("0 13,14 * * MON");
  });
});
