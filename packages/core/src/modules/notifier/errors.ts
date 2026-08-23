import { Schema } from "effect";

export type NotifierName = typeof NotifierName.Type;
export const NotifierName = Schema.Literals(["email"]);

const emailErrorFields = {
  channel: NotifierName,
  message: Schema.String,
};

export class NotifierError extends Schema.TaggedErrorClass<NotifierError>()(
  "NotifierError",
  {
    channel: NotifierName,
    message: Schema.String,
    cause: Schema.optional(Schema.Defect()),
  },
) {}

export class EmailRequestError extends Schema.TaggedErrorClass<EmailRequestError>()(
  "EmailRequestError",
  {
    ...emailErrorFields,
    cause: Schema.Defect(),
  },
) {}

export class EmailResponseError extends Schema.TaggedErrorClass<EmailResponseError>()(
  "EmailResponseError",
  {
    ...emailErrorFields,
    code: Schema.String,
    statusCode: Schema.NullOr(Schema.Number),
  },
) {}

export type EmailError = EmailRequestError | EmailResponseError;

export type NotifierDeliveryError = NotifierError | EmailError;
