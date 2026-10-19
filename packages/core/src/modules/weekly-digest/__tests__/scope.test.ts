import { describe, expect, it } from "vitest";

import { all, numbered, fighterA } from "../../mma/__tests__/fixtures.js";
import { Subject } from "../../subjects/schema.js";
import { supportsWeeklyDigest } from "../scope.js";
import { mets, college } from "./fixtures.js";

describe("weekly digest eligibility", () => {
  it("includes team, fighter, and coverage picks", () => {
    for (const subject of [mets, college, fighterA, all, numbered]) {
      expect(supportsWeeklyDigest(subject)).toBe(true);
    }
  });

  it("rejects subjects whose tag and details disagree", () => {
    for (const subject of [
      Subject.make({ ...fighterA, _tag: "sports_team" }),
      Subject.make({ ...all, _tag: "mma_fighter" }),
      Subject.make({ ...mets, _tag: "mma_tracking" }),
    ]) {
      expect(supportsWeeklyDigest(subject)).toBe(false);
    }
  });
});
