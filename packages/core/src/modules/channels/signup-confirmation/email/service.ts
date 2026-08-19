import { Effect, Layer } from "effect";

import { Id } from "../../../../lib/id/service.js";
import { EmailChannelClient } from "../../email/clients/service.js";
import { SignupConfirmationChannel } from "../service.js";
import { SignupConfirmationEmailDelivery } from "./delivery.js";
import { renderSignupConfirmation } from "./render.js";

export const SignupConfirmationEmailChannelLayer = Layer.effect(
  SignupConfirmationChannel,
  Effect.gen(function* () {
    const client = yield* EmailChannelClient;
    const id = yield* Id;

    const deliver: SignupConfirmationChannel["Service"]["deliver"] = Effect.fn(
      "SignupConfirmationChannel.deliver",
    )(function* (confirmation) {
      const deliveryId = yield* id.generate();
      const rendered = yield* renderSignupConfirmation(confirmation).pipe(
        Effect.orDie,
      );

      yield* client
        .send(
          SignupConfirmationEmailDelivery.make(confirmation, deliveryId),
          rendered,
        )
        .pipe(
          Effect.tap(() =>
            Effect.logInfo("signup confirmation: delivered", {
              kind: confirmation._tag,
              user: confirmation.user.email,
            }),
          ),
          Effect.tapCause((cause) =>
            Effect.logError("signup confirmation: delivery failed", {
              cause,
              kind: confirmation._tag,
              user: confirmation.user.email,
            }),
          ),
        );
    });

    return SignupConfirmationChannel.of({ deliver });
  }),
);
