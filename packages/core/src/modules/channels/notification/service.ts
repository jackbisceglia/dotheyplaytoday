import { Context, Effect, Layer } from "effect";

import type { ChannelDeliveryError } from "../errors.js";
import type { Notification } from "./schema.js";

export type NotificationChannelDefinition<TRendered> = {
  readonly render: (
    notification: Notification,
  ) => Effect.Effect<TRendered, unknown>;
  readonly send: (
    notification: Notification,
    rendered: TRendered,
  ) => Effect.Effect<void, ChannelDeliveryError>;
};

export type NotificationChannelService = {
  readonly deliver: (
    notification: Notification,
  ) => Effect.Effect<void, ChannelDeliveryError>;
};

export class NotificationChannel extends Context.Service<
  NotificationChannel,
  NotificationChannelService
>()("@dtpt/core/NotificationChannel") {
  static makeLayer<TRendered, R = never, E = never>(
    Definition: Effect.Effect<NotificationChannelDefinition<TRendered>, E, R>,
  ) {
    return Layer.effect(
      NotificationChannel,
      Effect.gen(function* () {
        const { render, send } = yield* Definition;

        const deliver: NotificationChannel["Service"]["deliver"] = Effect.fn(
          "NotificationChannel.deliver",
        )(function* (notification) {
          const rendered = yield* render(notification).pipe(Effect.orDie);

          yield* send(notification, rendered);
        });

        return NotificationChannel.of({ deliver });
      }),
    );
  }
}
