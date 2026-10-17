import { Effect } from "effect";

import { Id } from "../../../lib/id/service.js";
import type { EmailAddress } from "../../users/schema.js";
import type { EmailRendered } from "../render.js";
import { EmailLayerResend } from "../resend.js";
import { Email } from "../service.js";

/** Sends one rendered transactional email with a fresh idempotency key. */
export const deliverTransactional = Effect.fn("TransactionalEmail.deliver")(
  function* (recipient: EmailAddress, rendered: EmailRendered) {
    const email = yield* Email;
    const id = yield* Id;

    yield* email.send(
      { recipient, idempotencyKey: yield* id.generate() },
      rendered,
    );
  },
  Effect.provide(EmailLayerResend),
);
