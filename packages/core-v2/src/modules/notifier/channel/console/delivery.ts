import { DateTime } from "effect";

import { StringParts } from "../../../../lib/string.js";
import type { EmailAddress } from "../../../users/schema.js";
import type { Notification } from "../../schema.js";
import type { ChannelDelivery } from "../service.js";

export type ConsoleDelivery = ChannelDelivery<EmailAddress>;

const deliveryHash = (notification: Notification) =>
  StringParts()
    .add(notification.subscription.id)
    .add(DateTime.formatIso(notification.sendAt))
    .make(":");

export const ConsoleDelivery = {
  makeFromNotification: (notification: Notification): ConsoleDelivery => ({
    recipient: notification.user.email,
    hash: deliveryHash(notification),
  }),
};
