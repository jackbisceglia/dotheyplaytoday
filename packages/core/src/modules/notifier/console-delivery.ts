import type { EmailAddress } from "../users/schema.js";
import type { Notification } from "./notification.js";
import { createDeliveryHash } from "./hash.js";

export type ConsoleDelivery = {
  readonly recipient: EmailAddress;
  readonly hash: string;
};

export const ConsoleDelivery = {
  makeFromNotification: (notification: Notification): ConsoleDelivery => ({
    recipient: notification.user.email,
    hash: createDeliveryHash(notification),
  }),
};
