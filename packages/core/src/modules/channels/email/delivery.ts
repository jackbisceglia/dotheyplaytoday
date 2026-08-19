import type { EmailAddress } from "../../users/schema.js";
import type { Notification } from "../notification/schema.js";
import { createDeliveryHash } from "../hash.js";
import type { ChannelDelivery } from "../service.js";

export type EmailDelivery = ChannelDelivery<EmailAddress>;

export const EmailDelivery = {
  makeFromNotification: (notification: Notification): EmailDelivery => ({
    recipient: notification.user.email,
    hash: createDeliveryHash(notification),
  }),
};
