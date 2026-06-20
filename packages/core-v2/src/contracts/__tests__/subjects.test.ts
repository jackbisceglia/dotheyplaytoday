import { describe, expect, it } from "@effect/vitest";
import { Schema } from "effect";

import { SubjectId } from "../../modules/subjects/schema.js";
import { SubjectsResponse } from "../subjects.js";

const decodeSubjectsResponse = Schema.decodeUnknownSync(SubjectsResponse);

describe("subjects contract", () => {
  it("decodes the public subject catalog response", () => {
    const decoded = decodeSubjectsResponse([
      {
        id: "00000000-0000-4000-8000-000000000301",
        _tag: "sports_team",
        details: {
          _tag: "sports_team",
          leagueId: "nba",
          display: "Boston Celtics",
          location: "Boston",
          name: "Celtics",
          abbreviation: "BOS",
          slug: "boston-celtics",
        },
      },
    ]);

    expect(decoded).toEqual([
      {
        id: SubjectId.make("00000000-0000-4000-8000-000000000301"),
        _tag: "sports_team",
        details: {
          _tag: "sports_team",
          leagueId: "nba",
          display: "Boston Celtics",
          location: "Boston",
          name: "Celtics",
          abbreviation: "BOS",
          slug: "boston-celtics",
        },
      },
    ]);
  });
});
