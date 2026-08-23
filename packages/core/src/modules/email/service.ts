import { Context, type Effect } from "effect";

import type { EmailAddress } from "../users/schema.js";
import type { EmailError } from "../notifier/errors.js";
import type { EmailRendered } from "./render.js";

export type EmailMessage = EmailRendered & {
  readonly recipient: EmailAddress;
  readonly idempotencyKey: string;
};

export type EmailService = {
  readonly send: (message: EmailMessage) => Effect.Effect<void, EmailError>;
};

export class Email extends Context.Service<Email, EmailService>()(
  "@dtpt/core/Email",
) {}
