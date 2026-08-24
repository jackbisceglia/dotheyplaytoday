import { DateTime, Effect } from "effect";

import type { EmailAddress } from "../users/schema.js";
import type { Notification } from "./notification.js";
import { Notifier } from "./service.js";

type ConsoleDelivery = {
  readonly recipient: EmailAddress;
  readonly hash: string;
};

const makeConsoleDelivery = (notification: Notification): ConsoleDelivery => ({
  recipient: notification.user.email,
  hash: Notifier.createDeliveryHash(notification),
});

export type ConsoleRendered = {
  readonly message: string;
};

export const NotifierLayerConsole = Notifier.makeLayer(
  Effect.succeed({
    render: Effect.fn((notification: Notification) => {
      const message = [
        `subscription=${notification.subscription.id}`,
        `user=${notification.user.email}`,
        `subject=${notification.subject.id}`,
        `events=${String(notification.events.length)}`,
        `sendAt=${DateTime.formatIso(notification.sendAt)}`,
      ].join(" ");

      return Effect.succeed({ message });
    }),
    send: Effect.fn(function* (
      notification: Notification,
      rendered: ConsoleRendered,
    ) {
      const delivery = makeConsoleDelivery(notification);
      const details = [
        `recipient=${delivery.recipient}`,
        `hash=${delivery.hash}`,
        rendered.message,
      ].join(" ");

      yield* Effect.logInfo("Dry Run: Would deliver notification", {
        details,
      });
    }),
  }),
);
