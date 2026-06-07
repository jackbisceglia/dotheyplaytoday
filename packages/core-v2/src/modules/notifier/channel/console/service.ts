import { DateTime, Effect, Layer } from "effect";

import type { EmailAddress } from "../../../users/schema.js";
import { Channel } from "../service.js";

export type ConsoleRendered = {
  readonly message: string;
};

export class ConsoleChannel extends Channel.makeService<
  ConsoleChannel,
  EmailAddress,
  ConsoleRendered
>()("@dtpt/core-v2/ConsoleChannel") {}

export const ConsoleChannelLayer = Layer.succeed(
  ConsoleChannel,
  ConsoleChannel.of({
    render: (notification) => {
      const message = [
        `subscription=${notification.subscription.id}`,
        `user=${notification.user.email}`,
        `subject=${notification.subject.id}`,
        `events=${String(notification.events.length)}`,
        `sendAt=${DateTime.formatIso(notification.sendAt)}`,
      ].join(" ");

      return Effect.succeed({ message });
    },
    send: Effect.fn("ConsoleChannel.send")(function* (delivery, rendered) {
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
