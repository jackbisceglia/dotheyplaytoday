import { Schema } from "effect";

export type ChannelName = typeof ChannelName.Type;
export const ChannelName = Schema.Literals(["email"]);

const providerErrorFields = {
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

export class ChannelProviderRequestError extends Schema.TaggedErrorClass<ChannelProviderRequestError>()(
  "ChannelProviderRequestError",
  {
    ...providerErrorFields,
    cause: Schema.Defect,
  },
) {}

export class ChannelProviderResponseError extends Schema.TaggedErrorClass<ChannelProviderResponseError>()(
  "ChannelProviderResponseError",
  {
    ...providerErrorFields,
    code: Schema.String,
    statusCode: Schema.NullOr(Schema.Number),
  },
) {}

export type ChannelProviderError =
  | ChannelProviderRequestError
  | ChannelProviderResponseError;

export type ChannelDeliveryError = ChannelError | ChannelProviderError;
