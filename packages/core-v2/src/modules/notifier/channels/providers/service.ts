import { Context, Effect } from "effect";

import type { Notification } from "../../notification.js";
import type {
  ChannelDeliveryError,
  ChannelProviderError,
} from "../errors.js";

export type ChannelProviderService<TRecipient, TRendered> = {
  readonly render: (notification: Notification) => TRendered;
  readonly send: (
    to: TRecipient,
    rendered: TRendered,
  ) => Effect.Effect<void, ChannelDeliveryError>;
};

export const ChannelProvider = {
  makeService:
    <Self, TRecipient, TRendered>() =>
    <const Id extends string>(id: Id) =>
      Context.Service<Self, ChannelProviderService<TRecipient, TRendered>>()(
        id,
      ),
};

export type ChannelProviderClientService<TRecipient, TRendered> = {
  readonly send: (
    to: TRecipient,
    rendered: TRendered,
  ) => Effect.Effect<void, ChannelProviderError>;
};

export const ChannelProviderClient = {
  makeService:
    <Self, TRecipient, TRendered>() =>
    <const Id extends string>(id: Id) =>
      Context.Service<
        Self,
        ChannelProviderClientService<TRecipient, TRendered>
      >()(id),
};
