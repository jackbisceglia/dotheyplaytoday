import { Context, Effect } from "effect";

import type { ChannelClientError } from "../errors.js";

export type ChannelDelivery<TRecipient> = {
  readonly recipient: TRecipient;
  readonly hash: string;
};

export type ChannelClientService<TRecipient, TRendered> = {
  readonly send: (
    delivery: ChannelDelivery<TRecipient>,
    rendered: TRendered,
  ) => Effect.Effect<void, ChannelClientError>;
};

export const ChannelClient = {
  makeService:
    <Self, TRecipient, TRendered>() =>
    <const Id extends string>(id: Id) =>
      Context.Service<Self, ChannelClientService<TRecipient, TRendered>>()(id),
};
