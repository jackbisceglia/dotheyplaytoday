import { Schema } from "effect";

export class EmailRequestError extends Schema.TaggedError<EmailRequestError>()(
  "EmailRequestError",
  {
    message: Schema.String,
    cause: Schema.Defect(),
  },
) {}

export class EmailResponseError extends Schema.TaggedError<EmailResponseError>()(
  "EmailResponseError",
  {
    message: Schema.String,
    code: Schema.String,
    statusCode: Schema.NullOr(Schema.Number),
  },
) {}

export type EmailError = EmailRequestError | EmailResponseError;
