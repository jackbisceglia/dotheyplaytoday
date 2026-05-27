import { Effect, Schema } from "effect";

const fields = {
  operation: Schema.String,
  cause: Schema.optional(Schema.Defect),
  metadata: Schema.optional(Schema.Record(Schema.String, Schema.Unknown)),
};

export class DatabaseReadError extends Schema.TaggedErrorClass<DatabaseReadError>()(
  "DatabaseReadError",
  fields,
) {}

export class DatabaseWriteError extends Schema.TaggedErrorClass<DatabaseWriteError>()(
  "DatabaseWriteError",
  fields,
) {}

export class DatabaseDeleteError extends Schema.TaggedErrorClass<DatabaseDeleteError>()(
  "DatabaseDeleteError",
  fields,
) {}

export class DatabaseTransactionError extends Schema.TaggedErrorClass<DatabaseTransactionError>()(
  "DatabaseTransactionError",
  fields,
) {}

export const toReadError =
  (operation: string, metadata?: Readonly<Record<string, unknown>>) =>
  (cause: unknown) =>
    Effect.fail(
      new DatabaseReadError({
        operation,
        cause,
        metadata,
      }),
    );

export const mapToReadError =
  (operation: string, metadata?: Readonly<Record<string, unknown>>) =>
  <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    effect.pipe(
      Effect.mapError(
        (cause) =>
          new DatabaseReadError({
            operation,
            cause,
            metadata,
          }),
      ),
    );

export const toWriteError =
  (operation: string, metadata?: Readonly<Record<string, unknown>>) =>
  (cause: unknown) =>
    Effect.fail(
      new DatabaseWriteError({
        operation,
        cause,
        metadata,
      }),
    );

export const mapToWriteError =
  (operation: string, metadata?: Readonly<Record<string, unknown>>) =>
  <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    effect.pipe(
      Effect.mapError(
        (cause) =>
          new DatabaseWriteError({
            operation,
            cause,
            metadata,
          }),
      ),
    );
