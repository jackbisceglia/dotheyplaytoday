import { Context, Effect } from "effect";

import type { ChannelClientError } from "../channels/errors.js";
import type { Recipient } from "../channels/schema.js";

export type ChannelClientService<TRendered> = {
  readonly send: (
    to: Recipient,
    rendered: TRendered,
  ) => Effect.Effect<void, ChannelClientError>;
};

export const ChannelClient = {
  makeService:
    <Self, TRendered>() =>
    <const Id extends string>(id: Id) =>
      Context.Service<Self, ChannelClientService<TRendered>>()(id),
};
