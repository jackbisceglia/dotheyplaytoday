import { Effect, Layer } from "effect";

import { Notifier } from "../../service.js";
import { ConsoleDelivery } from "./delivery.js";
import { ConsoleChannel } from "./service.js";

export const ConsoleNotifierLayer = Layer.effect(
  Notifier,
  Effect.gen(function* () {
    const channel = yield* ConsoleChannel;

    const deliver: Notifier["Service"]["deliver"] = Effect.fn(
      "ConsoleNotifier.deliver",
    )(function* (notification) {
      const rendered = yield* channel.render(notification);
      const delivery = ConsoleDelivery.makeFromNotification(notification);

      yield* channel.send(delivery, rendered);
    });

    return Notifier.of({ deliver });
  }),
);
