import { Context, type Effect } from "effect";

import type { ChannelDeliveryError } from "../errors.js";
import type { Notification } from "./schema.js";

export type NotificationChannelService = {
  readonly deliver: (
    notification: Notification,
  ) => Effect.Effect<void, ChannelDeliveryError>;
};

export class NotificationChannel extends Context.Service<
  NotificationChannel,
  NotificationChannelService
>()("@dtpt/core/NotificationChannel") {}
