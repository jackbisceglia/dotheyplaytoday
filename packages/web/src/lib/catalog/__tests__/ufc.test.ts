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
    details: { _tag: "mma_fighter", league: { id: "ufc" }, display, p4p },
  });
const first = fighter("11", "Zed Ranked", 1);
const second = fighter("12", "Alpha Ranked", 2);
const eleventh = fighter("13", "Other Ranked", 11);
const fifteenth = fighter("20", "Last Ranked", 15);
const unranked = fighter("14", "Brendan Allen", null);
const woman = fighter("15", "Natalia Silva", null);
const subjects = [second, unranked, all, fifteenth, eleventh, first, woman];

describe("UFC fighter browsing", () => {
  it("shows only the top 15 in rank order for empty or whitespace search", () => {
    expect(getVisibleUfcFighters(subjects, "")).toEqual([
      first,
      second,
      eleventh,
      fifteenth,
    ]);
    expect(getVisibleUfcFighters(subjects, "   ")).toEqual([
      first,
      second,
      eleventh,
      fifteenth,
    ]);
    expect(getVisibleUfcFighters(subjects, " ’- ")).toEqual([
      first,
      second,
      eleventh,
      fifteenth,
    ]);
  });
  it.each([
    ["16", "Jiří Procházka", "Jiri Prochazka"],
    ["17", "Benoît Saint Denis", "Benoit Saint Denis"],
    ["18", "Jan Błachowicz", "Jan Blachowicz"],
    ["19", "Sean O'Malley", "Sean OMalley"],
  ])("finds %s / %s with ASCII search %s", (suffix, display, query) => {
    const pick = fighter(suffix, display, null);
    const catalog = [...subjects, pick];
    expect(getVisibleUfcFighters(catalog, query)).toEqual([pick]);
    expect(getVisibleUfcFighters(catalog, display)).toEqual([pick]);
    expect(getVisibleUfcFighters(catalog, display.normalize("NFD"))).toEqual([
      pick,
    ]);
  });
  it("searches all fighters regardless of rank, alphabetically and ignoring case", () => {
    expect(getVisibleUfcFighters(subjects, "  RANKED ")).toEqual([
      second,
      fifteenth,
      eleventh,
      first,
    ]);
    expect(getVisibleUfcFighters(subjects, "allen")).toEqual([unranked]);
    expect(getVisibleUfcFighters(subjects, "ÁLLEN")).toEqual([unranked]);
    expect(getVisibleUfcFighters(subjects, "silva")).toEqual([woman]);
    expect(getVisibleUfcFighters(subjects, "not a fighter")).toEqual([]);
  });
  it("keeps summary labels compact", () => {
    expect(getSubjectAbbreviation(unranked.details)).toBe("B. Allen");
    expect(getSubjectAbbreviation(all.details)).toBe("All Cards");
  });
});
