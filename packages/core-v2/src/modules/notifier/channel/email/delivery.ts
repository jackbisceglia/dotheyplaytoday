import { DateTime } from "effect";

import { StringParts } from "../../../../lib/string.js";
import type { EmailAddress } from "../../../users/schema.js";
import type { ChannelDelivery } from "../service.js";
import type { Notification } from "../../schema.js";

export type EmailDelivery = ChannelDelivery<EmailAddress>;

const deliveryHash = (notification: Notification) =>
  StringParts()
    .add(notification.subscription.id)
    .add(DateTime.formatIso(notification.sendAt))
    .make(":");

export const EmailDelivery = {
  makeFromNotification: (notification: Notification): EmailDelivery => ({
    recipient: notification.user.email,
    hash: deliveryHash(notification),
  }),
};
