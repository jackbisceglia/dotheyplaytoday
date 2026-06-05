import { Context, Effect } from "effect";

import type { NotifierError } from "./errors.js";
import type { Notification } from "../schema.js";

export type ChannelDelivery<TRecipient> = {
  readonly recipient: TRecipient;
  readonly hash: string;
};

export type ChannelService<TRecipient, TRendered, TRenderError = never> = {
  readonly render: (
    notification: Notification,
  ) => Effect.Effect<TRendered, TRenderError>;
  readonly send: (
    delivery: ChannelDelivery<TRecipient>,
    rendered: TRendered,
  ) => Effect.Effect<void, NotifierError>;
};

export const Channel = {
  makeService:
    <Self, TRecipient, TRendered, TRenderError = never>() =>
    <const Id extends string>(id: Id) =>
      Context.Service<
        Self,
        ChannelService<TRecipient, TRendered, TRenderError>
      >()(id),
};
