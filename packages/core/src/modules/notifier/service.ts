import { Context, DateTime, Effect, Layer } from "effect";

import { StringParts } from "../../lib/string.js";
import type { NotifierError } from "./errors.js";
import type { Notification } from "./notification.js";

export type NotifierLayerFactoryDefinition<TRendered> = {
  readonly render: (
    notification: Notification,
  ) => Effect.Effect<TRendered, unknown>;
  readonly send: (
    notification: Notification,
    rendered: TRendered,
  ) => Effect.Effect<void, NotifierError>;
};

export class Notifier extends Context.Service<
  Notifier,
  {
    readonly send: (
      notification: Notification,
    ) => Effect.Effect<void, NotifierError>;
  }
>()("@dtpt/core/Notifier") {
  static createDeliveryHash = (notification: Notification) =>
    StringParts()
      .add(notification.subscription.id)
      .add(DateTime.formatIso(notification.sendAt))
      .make(":");

  static makeLayer<TRendered, R = never, E = never>(
    definition: Effect.Effect<NotifierLayerFactoryDefinition<TRendered>, E, R>,
  ) {
    return Layer.effect(
      Notifier,
      Effect.gen(function* () {
        const implementation = yield* definition;

        const send: Notifier["Service"]["send"] = Effect.fn("Notifier.send")(
          function* (notification) {
            const rendered = yield* implementation
              .render(notification)
              .pipe(Effect.orDie);

            yield* implementation.send(notification, rendered);
          },
        );

        return Notifier.of({ send });
      }),
    );
  }
}
