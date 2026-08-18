import { DateTime, Effect, Layer } from "effect";

import { NotificationDelivery } from "../delivery.js";
import type { Notification } from "../schema.js";
import { NotificationChannel } from "../service.js";

export type NotificationConsoleRendered = {
  readonly message: string;
};

export const NotificationConsoleChannelLayer = Layer.succeed(
  NotificationChannel,
  NotificationChannel.of({
    deliver: Effect.fn("NotificationChannel.console.deliver")(function* (
      notification: Notification,
    ) {
      const message = [
        `subscription=${notification.subscription.id}`,
        `user=${notification.user.email}`,
        `subject=${notification.subject.id}`,
        `events=${String(notification.events.length)}`,
        `sendAt=${DateTime.formatIso(notification.sendAt)}`,
      ].join(" ");

      const rendered: NotificationConsoleRendered = { message };
      const delivery = NotificationDelivery.make(notification);
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
