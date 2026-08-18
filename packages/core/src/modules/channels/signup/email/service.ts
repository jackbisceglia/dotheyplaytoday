import { Effect, Layer } from "effect";

import { Id } from "../../../../lib/id/service.js";
import { EmailChannelClient } from "../../email/clients/service.js";
import { SignupChannel } from "../service.js";
import { SignupEmailDelivery } from "./delivery.js";
import { renderSignupConfirmation } from "./render.js";

export const SignupEmailChannelLayer = Layer.effect(
  SignupChannel,
  Effect.gen(function* () {
    const client = yield* EmailChannelClient;
    const id = yield* Id;

    const deliver: SignupChannel["Service"]["deliver"] = Effect.fn(
      "SignupChannel.deliver",
    )(function* (confirmation) {
      const deliveryId = yield* id.generate();
      const rendered = yield* renderSignupConfirmation(confirmation).pipe(
        Effect.orDie,
      );

      yield* client.send(
        SignupEmailDelivery.make(confirmation, deliveryId),
        rendered,
      );
    });

    return SignupChannel.of({ deliver });
  }),
);
