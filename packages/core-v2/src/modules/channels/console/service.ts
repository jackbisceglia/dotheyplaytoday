import { DateTime, Effect } from "effect";

import type { Notification } from "../notification/schema.js";
import { Channel } from "../service.js";
import { ConsoleDelivery } from "./delivery.js";

export type ConsoleRendered = {
  readonly message: string;
};

export const ConsoleChannelLayer = Channel.makeLayer(
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
      const delivery = ConsoleDelivery.makeFromNotification(notification);
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
