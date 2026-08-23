import { DateTime, Effect } from "effect";

import { ConsoleDelivery } from "./console-delivery.js";
import type { Notification } from "./notification.js";
import { Notifier } from "./service.js";

export type ConsoleRendered = ConsoleDelivery & {
  readonly message: string;
};

export const NotifierLayerConsole = Notifier.makeLayer(
  Effect.succeed({
    render: Effect.fn((notification: Notification) => {
      const delivery = ConsoleDelivery.makeFromNotification(notification);
      const message = [
        `subscription=${notification.subscription.id}`,
        `user=${notification.user.email}`,
        `subject=${notification.subject.id}`,
        `events=${String(notification.events.length)}`,
        `sendAt=${DateTime.formatIso(notification.sendAt)}`,
      ].join(" ");

      return Effect.succeed({ ...delivery, message });
    }),
    send: Effect.fn(function* (rendered: ConsoleRendered) {
      const details = [
        `recipient=${rendered.recipient}`,
        `hash=${rendered.hash}`,
        rendered.message,
      ].join(" ");

      yield* Effect.logInfo("Dry Run: Would deliver notification", {
        details,
      });
    }),
  }),
);
