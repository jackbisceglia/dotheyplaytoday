import { Effect, Schema } from "effect";

import { StringParts } from "../string.js";
import { serialize } from "../utils.js";

export type DatabaseError =
  | DatabaseReadError
  | DatabaseWriteError
  | DatabaseDeleteError
  | DatabaseTransactionError;

const utils = {
  format: (error: DatabaseError) =>
    StringParts()
      .add(`error=${error._tag}`)
      .add(`operation=${error.operation}`)
      .addNullable(error.metadata && `metadata=${serialize(error.metadata)}`)
      .make(" "),
};

const fields = {
  operation: Schema.String,
  cause: Schema.optional(Schema.Defect()),
  metadata: Schema.optional(Schema.Record(Schema.String, Schema.Unknown)),
};

export class DatabaseReadError extends Schema.TaggedErrorClass<DatabaseReadError>()(
  "DatabaseReadError",
  fields,
) {
  format() {
    return utils.format(this);
  }
}

export class DatabaseWriteError extends Schema.TaggedErrorClass<DatabaseWriteError>()(
  "DatabaseWriteError",
  fields,
) {
  format() {
    return utils.format(this);
  }
}

export class DatabaseDeleteError extends Schema.TaggedErrorClass<DatabaseDeleteError>()(
  "DatabaseDeleteError",
  fields,
) {
  format() {
    return utils.format(this);
  }
}

export class DatabaseTransactionError extends Schema.TaggedErrorClass<DatabaseTransactionError>()(
  "DatabaseTransactionError",
  fields,
) {
  format() {
    return utils.format(this);
  }
}

export const toReadError =
  (operation: string, metadata?: Readonly<Record<string, unknown>>) =>
  (cause: unknown) =>
    Effect.fail(new DatabaseReadError({ operation, cause, metadata }));

export const mapToReadError =
  (operation: string, metadata?: Readonly<Record<string, unknown>>) =>
  <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    effect.pipe(
      Effect.mapError(
        (cause) => new DatabaseReadError({ operation, cause, metadata }),
      ),
    );

export const toWriteError =
  (operation: string, metadata?: Readonly<Record<string, unknown>>) =>
  (cause: unknown) =>
    Effect.fail(new DatabaseWriteError({ operation, cause, metadata }));

export const mapToWriteError =
  (operation: string, metadata?: Readonly<Record<string, unknown>>) =>
  <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    effect.pipe(
      Effect.mapError(
        (cause) => new DatabaseWriteError({ operation, cause, metadata }),
      ),
    );
