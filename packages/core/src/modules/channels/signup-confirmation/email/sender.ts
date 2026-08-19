import { Effect } from "effect";

import { Id } from "../../../../lib/id/service.js";
import { EmailChannelClient } from "../../email/clients/service.js";
import type { SignupConfirmation } from "../schema.js";
import { renderSignupConfirmation } from "./render.js";

export const makeSignupConfirmationEmailSender = Effect.gen(function* () {
  const client = yield* EmailChannelClient;
  const id = yield* Id;

  return Effect.fn("SignupConfirmationEmail.send")(function* (
    confirmation: SignupConfirmation,
  ) {
    const deliveryId = yield* id.generate();
    const rendered = yield* renderSignupConfirmation(confirmation).pipe(
      Effect.orDie,
    );

    yield* client
      .send({ recipient: confirmation.user.email, hash: deliveryId }, rendered)
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
});
