import { Context, Effect } from "effect";

import type { Notification } from "../notification.js";
import type { ChannelDeliveryError } from "./errors.js";

export type ChannelService = {
  readonly deliver: (
    notification: Notification,
  ) => Effect.Effect<void, ChannelDeliveryError>;
};

export class Channel extends Context.Service<Channel, ChannelService>()(
  "@dtpt/core-v2/Channel",
) {}
