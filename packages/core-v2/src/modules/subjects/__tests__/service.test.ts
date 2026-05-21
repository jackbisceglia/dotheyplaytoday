import { describe, expect, it } from "@effect/vitest";
import { Effect, Layer, Schema } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";

import { DatabaseReadError } from "../../../lib/database/errors.js";
import { Database } from "../../../lib/database/service.js";
import { createTables, layerTest } from "../../../lib/database/test-setup.js";
import {
  Subject,
  SubjectId,
  SubjectInsert,
  subjectsTable,
} from "../schema.js";
import { SubjectNotFound, Subjects, SubjectsLayer } from "../service.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;

const layerSubjectsTest = SubjectsLayer.pipe(Layer.provideMerge(layerTest));

const subjectInput = {
  id: "00000000-0000-4000-8000-000000000301",
  _tag: "sports_team",
  details: {
    _tag: "sports_team",
    leagueId: "nba",
    location: "Boston",
    name: "Celtics",
    abbreviation: "BOS",
    slug: "boston-celtics",
  },
};

const secondSubjectInput = {
  id: "00000000-0000-4000-8000-000000000302",
  _tag: "sports_team",
  details: {
    _tag: "sports_team",
    leagueId: "nba",
    location: "Los Angeles",
    name: "Lakers",
    abbreviation: "LAL",
    slug: "los-angeles-lakers",
  },
};

const subjectId = SubjectId.make(subjectInput.id);
const secondSubjectId = SubjectId.make(secondSubjectInput.id);

const seedSubjects = Effect.gen(function* () {
  const database = yield* Database;
  const inserts = [
    encode(SubjectInsert)(decode(Subject)(subjectInput)),
    encode(SubjectInsert)(decode(Subject)(secondSubjectInput)),
  ];

  yield* database.insert(subjectsTable).values(inserts);
});

describe("v2 Subjects service", () => {
  it.effect("reads subjects by primary id and lists subjects deterministically", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedSubjects;

      const subjects = yield* Subjects;

      const byId = yield* subjects.get(subjectId);
      const listed = yield* subjects.list();

      expect(encode(Subject)(byId)).toEqual(subjectInput);
      expect(listed.map((subject) => subject.id)).toEqual([
        subjectId,
        secondSubjectId,
      ]);
      expect(listed.map((subject) => subject.details.name)).toEqual([
        "Celtics",
        "Lakers",
      ]);
    }).pipe(Effect.provide(layerSubjectsTest)),
  );

  it.effect("returns an empty list when no subjects exist", () =>
    Effect.gen(function* () {
      yield* createTables;

      const subjects = yield* Subjects;
      const listed = yield* subjects.list();

      expect(listed).toEqual([]);
    }).pipe(Effect.provide(layerSubjectsTest)),
  );

  it.effect("fails primary reads with SubjectNotFound when the row is missing", () =>
    Effect.gen(function* () {
      yield* createTables;

      const subjects = yield* Subjects;
      const error = yield* subjects.get(subjectId).pipe(Effect.flip);

      expect(error).toBeInstanceOf(SubjectNotFound);
      if (!(error instanceof SubjectNotFound)) {
        return;
      }
      expect(error.key).toBe("id");
      expect(error.value).toBe(subjectId);
    }).pipe(Effect.provide(layerSubjectsTest)),
  );

  it.effect("maps read failures with operation metadata at the query callsite", () =>
    Effect.gen(function* () {
      const subjects = yield* Subjects;
      const error = yield* subjects.get(subjectId).pipe(Effect.flip);

      expect(error).toBeInstanceOf(DatabaseReadError);
      if (!(error instanceof DatabaseReadError)) {
        return;
      }
      expect(error.operation).toBe("Subjects.get");
      expect(error.metadata).toEqual({ subjectId });
    }).pipe(Effect.provide(layerSubjectsTest)),
  );

  it.effect("decodes rows before returning subjects", () =>
    Effect.gen(function* () {
      yield* createTables;

      const sql = yield* SqlClient;
      yield* sql`
        INSERT INTO subjects (id, _tag, details)
        VALUES (
          '00000000-0000-4000-8000-000000000301',
          'sports_team',
          '{"_tag":"sports_team","leagueId":"mlb","location":"Boston","name":"Celtics","abbreviation":"BOS","slug":"boston-celtics"}'
        )
      `;

      const subjects = yield* Subjects;
      const error = yield* subjects.get(subjectId).pipe(Effect.flip);

      expect(error._tag).toBe("SchemaError");
    }).pipe(Effect.provide(layerSubjectsTest)),
  );
});
