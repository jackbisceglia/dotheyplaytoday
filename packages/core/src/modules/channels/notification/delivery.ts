import { DateTime } from "effect";

import { StringParts } from "../../../lib/string.js";
import type { EmailAddress } from "../../users/schema.js";
import type { ChannelDelivery } from "../client/service.js";
import type { Notification } from "./schema.js";

export type NotificationDelivery = ChannelDelivery<EmailAddress>;

export const NotificationDelivery = {
  make: (notification: Notification): NotificationDelivery => ({
    recipient: notification.user.email,
    hash: StringParts()
      .add(notification.subscription.id)
      .add(DateTime.formatIso(notification.sendAt))
      .make(":"),
  }),
};
