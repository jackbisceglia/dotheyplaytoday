import { describe, expect, it } from "@effect/vitest";
import { Schema } from "effect";

import { Subject, SubjectInsert } from "../schema.js";
import { SportLeagueIds } from "../variants/sport.schema.js";

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
  it("lists supported league ids", () => {
    expect(SportLeagueIds).toEqual(["nba", "nfl", "mlb"]);
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
        details: { ...subjectInput.details, leagueId: "nhl" },
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
    expect(selected.details.name).toBe(subject.details.name);
    expect(selected.details.slug).toBe(subject.details.slug);
  });
});
