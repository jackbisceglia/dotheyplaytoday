import { DateTime } from "effect";

import { StringParts } from "../../../lib/string.js";
import type { Notification } from "./schema.js";

export const createDeliveryHash = (notification: Notification) =>
  StringParts()
    .add(notification.subscription.id)
    .add(DateTime.formatIso(notification.sendAt))
    .make(":");
