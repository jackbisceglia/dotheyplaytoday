import { describe, expect, it } from "vitest";
import { Schema } from "effect";
import { Subject } from "@dtpt/core/modules/subjects/schema";
import { all } from "@dtpt/core/modules/mma/__tests__/fixtures";
import { getVisibleUfcFighters } from "../ufc.js";
import { getSubjectAbbreviation } from "../index.js";

const fighter = (suffix: string, display: string, p4p: number | null) =>
  Schema.decodeUnknownSync(Subject)({
    id: `10000000-0000-4000-8000-0000000000${suffix}`,
    _tag: "mma_fighter",
    details: { _tag: "mma_fighter", leagueId: "ufc", display, p4p },
  });
const first = fighter("11", "Zed Ranked", 1);
const second = fighter("12", "Alpha Ranked", 2);
const outsideTop10 = fighter("13", "Other Ranked", 11);
const unranked = fighter("14", "Brendan Allen", null);
const woman = fighter("15", "Natalia Silva", null);
const subjects = [second, unranked, all, outsideTop10, first, woman];

describe("UFC fighter browsing", () => {
  it("shows only the top 10 in rank order for empty or whitespace search", () => {
    expect(getVisibleUfcFighters(subjects, "")).toEqual([first, second]);
    expect(getVisibleUfcFighters(subjects, "   ")).toEqual([first, second]);
  });
  it("searches all fighters regardless of rank, alphabetically and ignoring case", () => {
    expect(getVisibleUfcFighters(subjects, "  RANKED ")).toEqual([
      second,
      outsideTop10,
      first,
    ]);
    expect(getVisibleUfcFighters(subjects, "allen")).toEqual([unranked]);
    expect(getVisibleUfcFighters(subjects, "silva")).toEqual([woman]);
    expect(getVisibleUfcFighters(subjects, "not a fighter")).toEqual([]);
  });
  it("keeps summary labels compact", () => {
    expect(getSubjectAbbreviation(unranked.details)).toBe("B. Allen");
    expect(getSubjectAbbreviation(all.details)).toBe("All cards");
  });
});
