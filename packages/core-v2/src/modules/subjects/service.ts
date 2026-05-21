import { Context, Effect, Layer, Schema } from "effect";

import { DatabaseReadError } from "../../lib/database/errors.js";
import { Database } from "../../lib/database/service.js";
import { Subject } from "./schema.js";

export class SubjectNotFound extends Schema.TaggedErrorClass<SubjectNotFound>()(
  "SubjectNotFound",
  { key: Schema.Literal("id"), value: Schema.String },
) {}

export class Subjects extends Context.Service<
  Subjects,
  {
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
  }
>()("@dtpt/core-v2/Subjects") {}

const decodeSubject = Schema.decodeUnknownEffect(Subject);
const decodeSubjects = Schema.decodeUnknownEffect(Schema.Array(Subject));

export const SubjectsLayer = Layer.effect(
  Subjects,
  Effect.gen(function* () {
    const database = yield* Database;

    const get = Effect.fn("Subjects.get")(function* (
      subjectId: Subject["id"],
    ) {
      const row = yield* database.query.subjectsTable
        .findFirst({
          where: { id: subjectId },
        })
        .pipe(
          Effect.mapError(
            (cause) =>
              new DatabaseReadError({
                operation: "Subjects.get",
                cause,
                metadata: { subjectId },
              }),
          ),
        );

      if (!row) {
        return yield* new SubjectNotFound({ key: "id", value: subjectId });
      }

      const subject = yield* decodeSubject(row);

      return subject;
    });

    const list = Effect.fn("Subjects.list")(function* () {
      const rows = yield* database.query.subjectsTable
        .findMany({
          orderBy: { id: "asc" },
        })
        .pipe(
          Effect.mapError(
            (cause) =>
              new DatabaseReadError({
                operation: "Subjects.list",
                cause,
              }),
          ),
        );

      const subjects = yield* decodeSubjects(rows);

      return subjects;
    });

    return Subjects.of({
      get,
      list,
    });
  }),
);
