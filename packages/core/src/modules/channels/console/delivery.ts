import type { EmailAddress } from "../../users/schema.js";
import type { Notification } from "../notification/schema.js";
import { createDeliveryHash } from "../hash.js";
import type { ChannelDelivery } from "../service.js";

export type ConsoleDelivery = ChannelDelivery<EmailAddress>;

export const ConsoleDelivery = {
  makeFromNotification: (notification: Notification): ConsoleDelivery => ({
    recipient: notification.user.email,
    hash: createDeliveryHash(notification),
  }),
};
