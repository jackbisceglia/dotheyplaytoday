import { Context, Effect } from "effect";

import type { ChannelClientError } from "../channels/errors.js";

export type ChannelClientService<TRecipient, TRendered> = {
  readonly send: (
    to: TRecipient,
    rendered: TRendered,
  ) => Effect.Effect<void, ChannelClientError>;
};

export const ChannelClient = {
  makeService:
    <Self, TRecipient, TRendered>() =>
    <const Id extends string>(id: Id) =>
      Context.Service<Self, ChannelClientService<TRecipient, TRendered>>()(
        id,
      ),
};
