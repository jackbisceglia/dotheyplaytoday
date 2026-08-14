import { Effect, Schema } from "effect";
import type { SqlClient } from "effect/unstable/sql/SqlClient";
import * as SqlError from "effect/unstable/sql/SqlError";

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

export const mapTransactionError =
  (operation: string, metadata?: Readonly<Record<string, unknown>>) =>
  <A, E, R>(effect: Effect.Effect<A, E | SqlError.SqlError, R>) => {
    const makeError = (cause: SqlError.SqlError) =>
      new DatabaseTransactionError({ operation, cause, metadata });

    return effect.pipe(
      Effect.mapError((cause) =>
        SqlError.isSqlError(cause) ? makeError(cause) : cause,
      ),
      // Effect SQL currently defects on COMMIT/ROLLBACK failures.
      Effect.catchDefect((cause) =>
        SqlError.isSqlError(cause)
          ? Effect.fail(makeError(cause))
          : Effect.die(cause),
      ),
    );
  };

export const withTransaction = (sql: SqlClient) => {
  function transaction<A, E, R>(
    operation: string,
    effect: Effect.Effect<A, E, R>,
  ): Effect.Effect<A, E | DatabaseTransactionError, R>;
  function transaction<A, E, R>(
    operation: string,
    metadata: Readonly<Record<string, unknown>>,
    effect: Effect.Effect<A, E, R>,
  ): Effect.Effect<A, E | DatabaseTransactionError, R>;
  function transaction<A, E, R>(
    ...args:
      | readonly [operation: string, effect: Effect.Effect<A, E, R>]
      | readonly [
          operation: string,
          metadata: Readonly<Record<string, unknown>>,
          effect: Effect.Effect<A, E, R>,
        ]
  ): Effect.Effect<A, E | DatabaseTransactionError, R> {
    if (args.length === 2) {
      const [operation, effect] = args;

      return sql.withTransaction(effect).pipe(mapTransactionError(operation));
    }

    const [operation, metadata, effect] = args;

    return sql
      .withTransaction(effect)
      .pipe(mapTransactionError(operation, metadata));
  }

  return transaction;
};
