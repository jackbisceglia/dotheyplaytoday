import { Schema } from "effect";

const fields = {
  operation: Schema.String,
  cause: Schema.optional(Schema.Defect),
  metadata: Schema.optional(Schema.Record(Schema.String, Schema.Unknown)),
};

export class DatabaseReadError extends Schema.TaggedErrorClass<DatabaseReadError>(
  "DatabaseReadError",
)("DatabaseReadError", fields) {}

export class DatabaseWriteError extends Schema.TaggedErrorClass<DatabaseWriteError>(
  "DatabaseWriteError",
)("DatabaseWriteError", fields) {}

export class DatabaseTransactionError extends Schema.TaggedErrorClass<DatabaseTransactionError>(
  "DatabaseTransactionError",
)("DatabaseTransactionError", fields) {}
