import { describe, expect, it } from "@effect/vitest";
import { DateTime, Effect, Layer, Schema } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";

import {
  DatabaseReadError,
  DatabaseWriteError,
} from "../../../lib/database/errors.js";
import { Database } from "../../../lib/database/service.js";
import { createTables, layerTest } from "../../../lib/database/__tests__/setup.js";
import {
  EventId,
  EventInsert,
  EventSourceId,
  eventsTable,
} from "../../events/schema.js";
import { subjectEventsTable } from "../feed/schema.js";
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

const utc = (input: string) =>
  DateTime.toUtc(
    DateTime.makeZonedUnsafe(input, {
      timeZone: "UTC",
      adjustForTimeZone: true,
    }),
  );

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

const secondSubjectInput = {
  id: "00000000-0000-4000-8000-000000000302",
  _tag: "sports_team",
  details: {
    _tag: "sports_team",
    leagueId: "nba",
    location: "Los Angeles",
    name: "Lakers",
    display: "Los Angeles Lakers",
    abbreviation: "LAL",
    slug: "los-angeles-lakers",
  },
};

const subjectId = SubjectId.make(subjectInput.id);
const secondSubjectId = SubjectId.make(secondSubjectInput.id);
const eventId = EventId.make("00000000-0000-4000-8000-000000000701");

const eventInput = {
  id: eventId,
  _tag: "sports_game",
  sourceId: EventSourceId.make(
    "sports_game:test:00000000-0000-4000-8000-000000000701",
  ),
  startsAt: utc("2026-05-24T20:00:00"),
  availability: "active",
  details: {
    _tag: "sports_game",
    leagueId: "nba",
  },
} satisfies EventInsert;

const seedSubjects = Effect.gen(function* () {
  const database = yield* Database;
  const inserts = [
    encode(SubjectInsert)(decode(Subject)(subjectInput)),
    encode(SubjectInsert)(decode(Subject)(secondSubjectInput)),
  ];

  yield* database.insert(subjectsTable).values(inserts);
});

const seedEvent = Effect.gen(function* () {
  const database = yield* Database;
  const insert = encode(EventInsert)(eventInput);

  yield* database.insert(eventsTable).values(insert);
});

describe("Subjects service", () => {
  it.effect("upserts subjects by checked-in subject id", () =>
    Effect.gen(function* () {
      yield* createTables;

      const subjects = yield* Subjects;
      const first = yield* subjects.upsert(decode(Subject)(subjectInput));
      const second = yield* subjects.upsert(
        decode(Subject)({
          ...subjectInput,
          details: {
            ...subjectInput.details,
            name: "Updated Celtics",
            display: "Boston Updated Celtics",
          },
        }),
      );
      const listed = yield* subjects.list();

      expect(first.id).toBe(subjectId);
      expect(second.id).toBe(subjectId);
      expect(second.details.name).toBe("Updated Celtics");
      expect(listed).toHaveLength(1);
    }).pipe(Effect.provide(layerSubjectsTest)),
  );

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
          '{"_tag":"sports_team","leagueId":"nhl","location":"Boston","name":"Celtics","display":"Boston Celtics","abbreviation":"BOS","slug":"boston-celtics"}'
        )
      `;

      const subjects = yield* Subjects;
      const error = yield* subjects.get(subjectId).pipe(Effect.flip);

      expect(error._tag).toBe("SchemaError");
    }).pipe(Effect.provide(layerSubjectsTest)),
  );

  it.effect("adds an event to a subject feed idempotently", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedSubjects;
      yield* seedEvent;

      const subjects = yield* Subjects;
      const database = yield* Database;

      yield* subjects.addEventToFeed({ eventId, subjectId });
      yield* subjects.addEventToFeed({ eventId, subjectId });

      const rows = yield* database.select().from(subjectEventsTable);

      expect(rows).toEqual([{ eventId, subjectId }]);
    }).pipe(Effect.provide(layerSubjectsTest)),
  );

  it.effect("maps missing feed-edge parents to DatabaseWriteError", () =>
    Effect.gen(function* () {
      yield* createTables;

      const subjects = yield* Subjects;
      const database = yield* Database;
      const input = { eventId, subjectId };
      const error = yield* subjects.addEventToFeed(input).pipe(Effect.flip);
      const rows = yield* database.select().from(subjectEventsTable);

      expect(error).toBeInstanceOf(DatabaseWriteError);
      if (!(error instanceof DatabaseWriteError)) {
        return;
      }
      expect(error.operation).toBe("Subjects.addEventToFeed");
      expect(error.metadata).toEqual(input);
      expect(rows).toHaveLength(0);
    }).pipe(Effect.provide(layerSubjectsTest)),
  );
});
