import { DateTime } from "effect";

import type { EmailAddress } from "../../../users/schema.js";
import type { Notification } from "../../schema.js";

export type EmailDelivery = {
  readonly to: EmailAddress;
  readonly hash: string;
};

const deliveryHash = (notification: Notification) => {
  const [event] = notification.events;
  const localEventDate = DateTime.formatIsoDate(
    DateTime.setZone(event.startsAt, notification.user.timezone),
  );

  return [
    "dtpt",
    "notify",
    "v1",
    notification.subscription.id,
    localEventDate,
    notification.subscription.schedule.sendAtSecondsLocal,
  ].join(":");
};

export const EmailDelivery = {
  fromNotification: (notification: Notification): EmailDelivery => ({
    to: notification.user.email,
    hash: deliveryHash(notification),
  }),
};
