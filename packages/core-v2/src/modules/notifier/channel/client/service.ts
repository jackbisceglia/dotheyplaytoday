import { Context, Effect } from "effect";

import type { ChannelClientError } from "../errors.js";

export type ChannelClientService<TDelivery, TRendered> = {
  readonly send: (
    delivery: TDelivery,
    rendered: TRendered,
  ) => Effect.Effect<void, ChannelClientError>;
};

export const ChannelClient = {
  makeService:
    <Self, TDelivery, TRendered>() =>
    <const Id extends string>(id: Id) =>
      Context.Service<Self, ChannelClientService<TDelivery, TRendered>>()(id),
};
