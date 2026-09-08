import { Effect, Schema } from "effect";

import { Id } from "../../../lib/id/service.js";
import { EmailAddress } from "../../users/schema.js";
import type { EmailRendered } from "../render.js";
import { Email, type EmailDelivery } from "../service.js";

export type MagicLink = typeof MagicLink.Type;
export const MagicLink = Schema.Struct({
  recipient: EmailAddress,
  url: Schema.String,
});

export const deliverMagicLink = Effect.fn("MagicLink.deliver")(function* (
  recipient: EmailAddress,
  rendered: EmailRendered,
) {
  const email = yield* Email;
  const id = yield* Id;
  const delivery: EmailDelivery = {
    recipient,
    idempotencyKey: yield* id.generate(),
  };

  yield* email.send(delivery, rendered).pipe(
    Effect.tap(() =>
      Effect.logInfo("magic link: delivered", {
        user: recipient,
      }),
    ),
    Effect.tapCause((cause) =>
      Effect.logError("magic link: delivery failed", {
        cause,
        user: recipient,
      }),
    ),
  );
});
