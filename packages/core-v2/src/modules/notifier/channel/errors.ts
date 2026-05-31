import { Schema } from "effect";

export type ChannelName = typeof ChannelName.Type;
export const ChannelName = Schema.Literals(["email"]);

const channelClientErrorFields = {
  channel: ChannelName,
  message: Schema.String,
};

export class ChannelError extends Schema.TaggedErrorClass<ChannelError>()(
  "ChannelError",
  {
    channel: ChannelName,
    message: Schema.String,
    cause: Schema.optional(Schema.Defect),
  },
) {}

export class ChannelClientRequestError extends Schema.TaggedErrorClass<ChannelClientRequestError>()(
  "ChannelClientRequestError",
  {
    ...channelClientErrorFields,
    cause: Schema.Defect,
  },
) {}

export class ChannelClientResponseError extends Schema.TaggedErrorClass<ChannelClientResponseError>()(
  "ChannelClientResponseError",
  {
    ...channelClientErrorFields,
    code: Schema.String,
    statusCode: Schema.NullOr(Schema.Number),
  },
) {}

export type ChannelClientError =
  | ChannelClientRequestError
  | ChannelClientResponseError;

export type NotifierError = ChannelError | ChannelClientError;
