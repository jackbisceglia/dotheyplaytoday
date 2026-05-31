import { Context, Effect } from "effect";

import type { NotifierError } from "./errors.js";
import type { Recipient } from "./schema.js";
import type { Notification } from "../schema.js";

export type ChannelService<TRendered> = {
  readonly render: (notification: Notification) => TRendered;
  readonly send: (
    to: Recipient,
    rendered: TRendered,
  ) => Effect.Effect<void, NotifierError>;
};

export const Channel = {
  makeService:
    <Self, TRendered>() =>
    <const Id extends string>(id: Id) =>
      Context.Service<Self, ChannelService<TRendered>>()(id),
};
