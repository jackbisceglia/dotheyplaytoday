import { Context, Effect, Layer } from "effect";

import type { NotifierDeliveryError } from "./errors.js";
import type { Notification } from "./notification.js";

export type NotifierDefinition<TRendered> = {
  readonly render: (
    notification: Notification,
  ) => Effect.Effect<TRendered, unknown>;
  readonly send: (
    rendered: TRendered,
  ) => Effect.Effect<void, NotifierDeliveryError>;
};

export type NotifierService = {
  readonly send: (
    notification: Notification,
  ) => Effect.Effect<void, NotifierDeliveryError>;
};

export class Notifier extends Context.Service<Notifier, NotifierService>()(
  "@dtpt/core/Notifier",
) {
  static makeLayer<TRendered, R = never, E = never>(
    Definition: Effect.Effect<NotifierDefinition<TRendered>, E, R>,
  ) {
    return Layer.effect(
      Notifier,
      Effect.gen(function* () {
        const { render, send: sendRendered } = yield* Definition;

        const send: Notifier["Service"]["send"] = Effect.fn("Notifier.send")(
          function* (notification) {
            const rendered = yield* render(notification).pipe(Effect.orDie);

            yield* sendRendered(rendered);
          },
        );

        return Notifier.of({ send });
      }),
    );
  }
}
