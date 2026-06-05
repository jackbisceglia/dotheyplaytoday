import { Context, Effect } from "effect";

import type { NotifierError } from "./errors.js";
import type { Notification } from "../schema.js";

export type ChannelService<TDelivery, TRendered, TRenderError = never> = {
  readonly render: (
    notification: Notification,
  ) => Effect.Effect<TRendered, TRenderError>;
  readonly send: (
    delivery: TDelivery,
    rendered: TRendered,
  ) => Effect.Effect<void, NotifierError>;
};

export const Channel = {
  makeService:
    <Self, TDelivery, TRendered, TRenderError = never>() =>
    <const Id extends string>(id: Id) =>
      Context.Service<
        Self,
        ChannelService<TDelivery, TRendered, TRenderError>
      >()(id),
};
