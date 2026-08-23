import type { EmailAddress } from "../users/schema.js";
import type { Notification } from "./notification.js";
import { createDeliveryHash } from "./hash.js";

export type EmailDelivery = {
  readonly recipient: EmailAddress;
  readonly idempotencyKey: string;
};

export const EmailDelivery = {
  makeFromNotification: (notification: Notification): EmailDelivery => ({
    recipient: notification.user.email,
    idempotencyKey: createDeliveryHash(notification),
  }),
};
