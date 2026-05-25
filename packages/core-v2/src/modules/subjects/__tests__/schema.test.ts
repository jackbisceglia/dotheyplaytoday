import { describe, expect, it } from "@effect/vitest";
import { eq } from "drizzle-orm";
import { Effect, Schema } from "effect";

import { Database } from "../../../lib/database/service.js";
import { createTables, layerTest } from "../../../lib/database/__tests__/setup.js";
import { Subject, SubjectInsert, subjectsTable } from "../schema.js";
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
    abbreviation: "BOS",
    slug: "boston-celtics",
  },
};

describe("v2 Subject model", () => {
  it("lists supported league ids", () => {
    expect(SportLeagueIds).toEqual(["nba"]);
  });

  it("rejects malformed subject-owned fields and details", () => {
    expect(() => decode(Subject)({ ...subjectInput, id: "not-uuid" })).toThrow();
    expect(() =>
      decode(Subject)({ ...subjectInput, _tag: "campus_group" }),
    ).toThrow();
    expect(() =>
      decode(Subject)({
        ...subjectInput,
        details: { ...subjectInput.details, leagueId: "mlb" },
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

  it.effect("roundtrips through SQLite using the database layer", () =>
    Effect.gen(function* () {
      yield* createTables;

      const database = yield* Database;
      const insert = encode(SubjectInsert)(decode(Subject)(subjectInput));

      yield* database.insert(subjectsTable).values(insert);

      const rows = yield* database.select().from(subjectsTable);
      const decodedRows = decode(Schema.Array(Subject))(rows);
      const selectedRows = yield* database
        .select()
        .from(subjectsTable)
        .where(eq(subjectsTable.id, insert.id))
        .limit(1);
      const row = selectedRows[0];
      const decodedRow = decode(Subject)(row);
      const missingRows = yield* database
        .select()
        .from(subjectsTable)
        .where(eq(subjectsTable.id, "00000000-0000-4000-8000-000000009999"))
        .limit(1);
      const missingRow = missingRows[0];
      const firstRow = decodedRows[0];

      expect(decodedRows).toHaveLength(1);
      expect(firstRow).toBeDefined();
      if (!firstRow) {
        return;
      }
      expect(encode(Subject)(decodedRow)).toEqual(subjectInput);
      expect(encode(Subject)(firstRow)).toEqual(subjectInput);
      expect(missingRow).toBeUndefined();
    }).pipe(Effect.provide(layerTest)),
  );
});
