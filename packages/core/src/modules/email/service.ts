import { Context, type Effect } from "effect";

import type { EmailAddress } from "../users/schema.js";
import type { EmailError } from "./errors.js";
import type { EmailRendered } from "./render.js";

export type EmailDelivery = {
  readonly recipient: EmailAddress;
  readonly idempotencyKey: string;
};

export type EmailFrom = {
  readonly name: string;
  readonly email: EmailAddress;
};

export type EmailOptions = {
  readonly from: EmailFrom;
};

export class Email extends Context.Service<
  Email,
  {
    readonly send: (
      delivery: EmailDelivery,
      rendered: EmailRendered,
    ) => Effect.Effect<void, EmailError>;
  }
>()("@dtpt/core/Email") {}
