import { describe, expect, it } from "@effect/vitest";
import { Schema } from "effect";

import { Subject, SubjectInsert } from "../schema.js";
import { SportLeagueIds } from "../variants/sport.schema.js";
import { MmaFighterSubject } from "../variants/mma.schema.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;

const subjectInput = {
  id: "00000000-0000-4000-8000-000000000301",
  _tag: "sports_team",
  details: {
    _tag: "sports_team",
    leagueId: "nba",
    location: "Boston",
    name: "Celtics",
    display: "Boston Celtics",
    abbreviation: "BOS",
    slug: "boston-celtics",
  },
};

describe("Subject model", () => {
  const fighter = {
    _tag: "mma_fighter",
    leagueId: "ufc",
    display: "Fighter",
  };

  it("decodes older fighter details with a null P4P rank", () => {
    const details = decode(MmaFighterSubject)(fighter);
    expect(details.p4p).toBeNull();
    expect(encode(MmaFighterSubject)(details)).toEqual({
      ...fighter,
      p4p: null,
    });
  });

  it("accepts null or a valid P4P rank and rejects invalid ranks", () => {
    for (const p4p of [null, 1, 10, 15]) {
      expect(decode(MmaFighterSubject)({ ...fighter, p4p }).p4p).toBe(p4p);
    }
    for (const p4p of [0, -1, 16, 1.5, "1"]) {
      expect(() => decode(MmaFighterSubject)({ ...fighter, p4p })).toThrow();
    }
  });

  it("lists supported league ids", () => {
    expect(SportLeagueIds).toEqual(["nba", "nfl", "mlb", "nhl"]);
  });

  it("rejects malformed subject-owned fields and details", () => {
    expect(() =>
      decode(Subject)({ ...subjectInput, id: "not-uuid" }),
    ).toThrow();
    expect(() =>
      decode(Subject)({ ...subjectInput, _tag: "campus_group" }),
    ).toThrow();
    expect(() =>
      decode(Subject)({
        ...subjectInput,
        details: { ...subjectInput.details, leagueId: "epl" },
      }),
    ).toThrow();
    expect(() =>
      decode(Subject)({
        ...subjectInput,
        details: { ...subjectInput.details, name: "" },
      }),
    ).toThrow();
  });

  it("encodes and decodes the subject row boundary", () => {
    const subject = decode(Subject)(subjectInput);
    const insert = encode(SubjectInsert)(subject);
    const selected = decode(Subject)(insert);

    expect(insert).toEqual(subjectInput);
    expect(selected._tag).toBe(subject._tag);
    expect(selected.details).toEqual(subject.details);
  });
});
