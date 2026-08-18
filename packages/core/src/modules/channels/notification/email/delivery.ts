import type { EmailAddress } from "../../../users/schema.js";
import type { ChannelDelivery } from "../../client/service.js";
import type { Notification } from "../schema.js";
import { createDeliveryHash } from "../hash.js";

export type NotificationEmailDelivery = ChannelDelivery<EmailAddress>;

export const NotificationEmailDelivery = {
  makeFromNotification: (
    notification: Notification,
  ): NotificationEmailDelivery => ({
    recipient: notification.user.email,
    hash: createDeliveryHash(notification),
  }),
};
