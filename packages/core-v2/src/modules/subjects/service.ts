import { Array, Context, Effect, Layer, Option, Schema } from "effect";

import {
  DatabaseReadError,
  DatabaseWriteError,
  mapToReadError,
  mapToWriteError,
} from "../../lib/database/errors.js";
import { Database } from "../../lib/database/service.js";
import type { EventId } from "../events/schema.js";
import { SubjectEventInsert, subjectEventsTable } from "./feed/schema.js";
import { Subject, SubjectInsert, subjectsTable } from "./schema.js";

export class SubjectNotFound extends Schema.TaggedErrorClass<SubjectNotFound>()(
  "SubjectNotFound",
  { key: Schema.Literal("id"), value: Schema.String },
) {}

export class Subjects extends Context.Service<
  Subjects,
  {
    readonly upsert: (
      subject: SubjectInsert,
    ) => Effect.Effect<Subject, DatabaseWriteError | Schema.SchemaError>;

    readonly get: (
      subjectId: Subject["id"],
    ) => Effect.Effect<
      Subject,
      SubjectNotFound | DatabaseReadError | Schema.SchemaError
    >;
    readonly list: () => Effect.Effect<
      readonly Subject[],
      DatabaseReadError | Schema.SchemaError
    >;

    readonly addEventToFeed: (input: {
      readonly subjectId: Subject["id"];
      readonly eventId: EventId;
    }) => Effect.Effect<void, DatabaseWriteError | Schema.SchemaError>;
  }
>()("@dtpt/core-v2/Subjects") {}

const decodeSubject = Schema.decodeUnknownEffect(Subject);
const decodeSubjects = Schema.decodeUnknownEffect(Schema.Array(Subject));
const encodeSubject = Schema.encodeEffect(SubjectInsert);
const encodeSubjectEvent = Schema.encodeEffect(SubjectEventInsert);

export const SubjectsLayer = Layer.effect(
  Subjects,
  Effect.gen(function* () {
    const database = yield* Database;

    const upsert: Subjects["Service"]["upsert"] = Effect.fn("Subjects.upsert")(
      function* (subject) {
        const insertable = yield* encodeSubject(subject);

        const rows = yield* database
          .insert(subjectsTable)
          .values(insertable)
          .onConflictDoUpdate({
            target: subjectsTable.id,
            set: {
              _tag: insertable._tag,
              details: insertable.details,
            },
          })
          .returning()
          .pipe(mapToWriteError("Subjects.upsert", { subjectId: subject.id }));

        const row = Array.head(rows);

        if (Option.isNone(row)) {
          return yield* new DatabaseWriteError({
            operation: "Subjects.upsert",
            metadata: { subjectId: subject.id },
          });
        }

        const upserted = yield* decodeSubject(row.value);

        return upserted;
      },
    );

    const get: Subjects["Service"]["get"] = Effect.fn("Subjects.get")(
      function* (subjectId: Subject["id"]) {
        const row = yield* database.query.subjectsTable
          .findFirst({
            where: { id: subjectId },
          })
          .pipe(mapToReadError("Subjects.get", { subjectId }));

        if (!row) {
          return yield* new SubjectNotFound({ key: "id", value: subjectId });
        }

        const subject = yield* decodeSubject(row);

        return subject;
      },
    );

    const list: Subjects["Service"]["list"] = Effect.fn("Subjects.list")(
      function* () {
        const rows = yield* database.query.subjectsTable
          .findMany({
            orderBy: { id: "asc" },
          })
          .pipe(mapToReadError("Subjects.list"));

        const subjects = yield* decodeSubjects(rows);

        return subjects;
      },
    );

    const addEventToFeed: Subjects["Service"]["addEventToFeed"] = Effect.fn(
      "Subjects.addEventToFeed",
    )(function* (input) {
      const insertable = yield* encodeSubjectEvent(input);

      yield* database
        .insert(subjectEventsTable)
        .values(insertable)
        .onConflictDoNothing()
        .pipe(mapToWriteError("Subjects.addEventToFeed", input));
    });

    return Subjects.of({
      upsert,
      get,
      list,
      addEventToFeed,
    });
  }),
);
