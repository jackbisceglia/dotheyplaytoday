import { DateTime, Effect } from "effect";

import type { Notification } from "./notification.js";
import { Notifier } from "./service.js";

const makeConsoleDelivery = (notification: Notification) => ({
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
