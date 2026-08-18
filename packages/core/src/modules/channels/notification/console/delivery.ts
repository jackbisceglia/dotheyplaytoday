import type { EmailAddress } from "../../../users/schema.js";
import type { ChannelDelivery } from "../../client/service.js";
import type { Notification } from "../schema.js";
import { createDeliveryHash } from "../hash.js";

export type ConsoleDelivery = ChannelDelivery<EmailAddress>;

export const ConsoleDelivery = {
  makeFromNotification: (notification: Notification): ConsoleDelivery => ({
    recipient: notification.user.email,
    hash: createDeliveryHash(notification),
  }),
};
