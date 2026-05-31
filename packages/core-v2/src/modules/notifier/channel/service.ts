import { Context, Effect } from "effect";

import type { NotifierError } from "./errors.js";
import type { Notification } from "../schema.js";

export type ChannelService<TRecipient, TRendered> = {
  readonly render: (notification: Notification) => TRendered;
  readonly send: (
    to: TRecipient,
    rendered: TRendered,
  ) => Effect.Effect<void, NotifierError>;
};

export const Channel = {
  makeService:
    <Self, TRecipient, TRendered>() =>
    <const Id extends string>(id: Id) =>
      Context.Service<Self, ChannelService<TRecipient, TRendered>>()(id),
};
