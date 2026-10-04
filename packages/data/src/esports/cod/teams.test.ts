import { Schema } from "effect";
import { describe, expect, it } from "vitest";

import { EsportsSeed } from "../../schema/esports.js";
import { codCollection } from "./index.js";
import { subjects } from "./subjects.js";

describe("2027 Call of Duty League teams", () => {
  it("decodes as an esports seed with all twelve franchises", () => {
    expect(() =>
      Schema.decodeUnknownSync(EsportsSeed)(codCollection),
    ).not.toThrow();
    expect(subjects).toHaveLength(12);
    expect(new Set(subjects.map((team) => team.id)).size).toBe(12);
    expect(
      new Set(subjects.map((team) => team.details.abbreviation)).size,
    ).toBe(12);
  });

  it("follows the Boston franchise sale to M80", () => {
    const displays = subjects.map((team) => team.details.display);

    expect(displays).toContain("M80 Boston");
    expect(displays).not.toContain("Boston Breach");
  });

  it("rejects a match between the same team", () => {
    const match = {
      id: "00000000-0000-4000-8000-000000000999",
      _tag: "esports_match",
      sourceId: "esports_match:cdl:00000000-0000-4000-8000-000000000999",
      startsAt: "2026-12-04T20:00:00.000Z",
      availability: "active",
      details: { _tag: "esports_match", gameId: "cod" },
      participants: [
        {
          _tag: "esports_match",
          details: { _tag: "esports_match", title: "OpTic Texas" },
        },
        {
          _tag: "esports_match",
          details: { _tag: "esports_match", title: "OpTic Texas" },
        },
      ],
    };

    expect(() =>
      Schema.decodeUnknownSync(EsportsSeed)({
        ...codCollection,
        events: [match],
      }),
    ).toThrow("Esports match seeds must include two different teams");
  });
});
