import { Context, Effect, Layer } from "effect";

import type { NotifierError } from "./channel/errors.js";
import { EmailDelivery } from "./channel/email/delivery.js";
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
      const rendered = yield* channel.render(notification).pipe(Effect.orDie);
      const delivery = EmailDelivery.fromNotification(notification);

      yield* channel.send(delivery, rendered);
    });

    return Notifier.of({ deliver });
  }),
);
