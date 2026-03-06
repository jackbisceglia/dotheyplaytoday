import { Schema } from "effect";

export const NotifierChannel = Schema.Literal("email", "sms");
export type NotifierChannel = Schema.Schema.Type<typeof NotifierChannel>;

const providerErrorBase = { channel: NotifierChannel, message: Schema.String };

export type NotifierProviderError =
  | NotifierRequestError
  | NotifierResponseError;
export type NotifierError = NotifierChannelUnavailable | NotifierProviderError;

export class NotifierChannelUnavailable extends Schema.TaggedError<NotifierChannelUnavailable>()(
  "NotifierChannelUnavailable",
  { channel: Schema.String, message: Schema.String },
) {}
export class NotifierRequestError extends Schema.TaggedError<NotifierRequestError>()(
  "NotifierRequestError",
  { ...providerErrorBase, cause: Schema.Defect },
) {}
export class NotifierResponseError extends Schema.TaggedError<NotifierResponseError>()(
  "NotifierResponseError",
  {
    ...providerErrorBase,
    code: Schema.String,
    statusCode: Schema.NullOr(Schema.Number),
  },
) {}
