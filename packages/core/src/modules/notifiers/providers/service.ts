import { Context, Effect, Schema } from "effect";

export type NotifierMessage = EmailNotifierMessage;
export type EmailNotifierMessage = {
  channel: "email";
  to: string;
  title: string;
  body: string;
};

const errorBase = { channel: Schema.String, message: Schema.String };

export type NotifierError = NotifierRequestError | NotifierResponseError;
export class NotifierRequestError extends Schema.TaggedError<NotifierRequestError>()(
  "NotifierRequestError",
  { ...errorBase, cause: Schema.Defect },
) {}
export class NotifierResponseError extends Schema.TaggedError<NotifierResponseError>()(
  "NotifierResponseError",
  {
    ...errorBase,
    code: Schema.String,
    statusCode: Schema.NullOr(Schema.Number),
  },
) {}

export class Notifier extends Context.Tag("@dtpt/Notifier")<
  Notifier,
  {
    send: (message: NotifierMessage) => Effect.Effect<void, NotifierError>;
  }
>() {}
