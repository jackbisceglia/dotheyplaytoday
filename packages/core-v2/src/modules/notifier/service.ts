import { Context, Effect, Layer } from "effect";

import type { NotifierError } from "./channel/errors.js";
import { EmailChannel } from "./channel/email/service.js";
import type { Notification } from "./schema.js";

export type NotifierService = {
  readonly deliver: (
    notification: Notification,
  ) => Effect.Effect<void, NotifierError>;
};

export class Notifier extends Context.Service<Notifier, NotifierService>()(
  "@dtpt/core-v2/Notifier",
) {}

export const NotifierLayer = Layer.effect(
  Notifier,
  Effect.gen(function* () {
    const channel = yield* EmailChannel;

    const deliver: Notifier["Service"]["deliver"] = Effect.fn(
      "Notifier.deliver",
    )(function* (notification) {
      const recipient = notification.user.email;
      const rendered = channel.render(notification);

      yield* channel.send(recipient, rendered);
    });

    return Notifier.of({ deliver });
  }),
);
