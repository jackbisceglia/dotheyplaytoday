import { Context, Effect, Layer } from "effect";

import type { ChannelDeliveryError } from "./errors.js";
import type { Notification } from "./notification/schema.js";

export type ChannelDelivery<TRecipient> = {
  readonly recipient: TRecipient;
  readonly hash: string;
};

export type ChannelDefinition<TRendered> = {
  readonly render: (
    notification: Notification,
  ) => Effect.Effect<TRendered, unknown>;
  readonly send: (
    notification: Notification,
    rendered: TRendered,
  ) => Effect.Effect<void, ChannelDeliveryError>;
};

export type ChannelService = {
  readonly deliver: (
    notification: Notification,
  ) => Effect.Effect<void, ChannelDeliveryError>;
};

export class Channel extends Context.Service<Channel, ChannelService>()(
  "@dtpt/core-v2/Channel",
) {
  static makeLayer<TRendered, R = never, E = never>(
    Definition: Effect.Effect<ChannelDefinition<TRendered>, E, R>,
  ) {
    return Layer.effect(
      Channel,
      Effect.gen(function* () {
        const { render, send } = yield* Definition;

        const deliver: Channel["Service"]["deliver"] = Effect.fn(
          "Channel.deliver",
        )(function* (notification) {
          const rendered = yield* render(notification).pipe(Effect.orDie);

          yield* send(notification, rendered);
        });

        return Channel.of({ deliver });
      }),
    );
  }
}
