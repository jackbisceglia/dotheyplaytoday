import { describe, expect, it } from "@effect/vitest";
import {
  Database,
  Subject,
  SubjectInsert,
  subjectsTable,
} from "@dtpt/core";
import { createTables } from "@dtpt/core/lib/database/__tests__/setup";
import { Effect, Schema } from "effect";
import {
  HttpClient,
  HttpClientRequest,
} from "effect/unstable/http";

import { makeApiTestLayer } from "./__tests__/helpers.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;

const subjectInput = makeSubjectInput({
  id: "00000000-0000-4000-8000-000000000302",
  display: "New York Knicks",
  location: "New York",
  name: "Knicks",
  abbreviation: "NYK",
});

const secondSubjectInput = makeSubjectInput({
  id: "00000000-0000-4000-8000-000000000301",
  display: "Boston Celtics",
  location: "Boston",
  name: "Celtics",
  abbreviation: "BOS",
});

const layerSubjectsTest = makeApiTestLayer({ limit: 100, window: 60 });

describe("subjects route handler", () => {
  it.effect("returns decoded subjects ordered by id", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedSubjects([subjectInput, secondSubjectInput]);

      const response = yield* HttpClient.execute(
        HttpClientRequest.get("/api/subjects"),
      );

      expect(response.status).toBe(200);
      expect(yield* response.json).toEqual([secondSubjectInput, subjectInput]);
    }).pipe(Effect.provide(layerSubjectsTest)),
  );
});

function makeSubjectInput(input: {
  readonly id: string;
  readonly display: string;
  readonly location: string;
  readonly name: string;
  readonly abbreviation: string;
}) {
  return {
    id: input.id,
    _tag: "sports_team",
    details: {
      _tag: "sports_team",
      leagueId: "nba",
      display: input.display,
      location: input.location,
      name: input.name,
      abbreviation: input.abbreviation,
      slug: input.display.toLowerCase().replaceAll(" ", "-"),
    },
  };
}

function seedSubjects(subjects: readonly (typeof subjectInput)[]) {
  return Effect.gen(function* () {
    const database = yield* Database;
    const inserts = subjects.map((subject) =>
      encode(SubjectInsert)(decode(Subject)(subject)),
    );

    yield* database.insert(subjectsTable).values(inserts);
  });
}
