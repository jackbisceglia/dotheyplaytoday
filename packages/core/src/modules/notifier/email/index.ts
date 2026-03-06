import { Effect, Layer } from "effect";

import type { NonEmptyEvents } from "../../events/schema.js";
import { Notifier } from "../index.js";
import type { User } from "../../users/schema.js";
import { formatBody, formatEventSubject } from "./format.js";
import { EmailProvider } from "./providers.js";

export const NotifierLayerEmail = Layer.effect(
  Notifier,
  Effect.gen(function* () {
    const emailProvider = yield* EmailProvider;

    const send = Effect.fn("Notifier.send")(function* (
      user: User,
      events: NonEmptyEvents,
    ) {
      yield* emailProvider.send({
        to: user.email,
        subject: formatEventSubject({
          events,
          timezone: user.timezone,
        }),
        text: formatBody({ events, timezone: user.timezone }),
      });
    });

    return Notifier.of({ send });
  }),
);
