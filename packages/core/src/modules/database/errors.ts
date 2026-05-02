import { Schema } from "effect";

export class DatabaseReadError extends Schema.TaggedError<DatabaseReadError>()(
  "DatabaseReadError",
  {
    operation: Schema.String,
    message: Schema.String,
  },
) {}

export class DatabaseWriteError extends Schema.TaggedError<DatabaseWriteError>()(
  "DatabaseWriteError",
  {
    operation: Schema.String,
    message: Schema.String,
  },
) {}
