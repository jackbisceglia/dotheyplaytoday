import { Context, Effect } from "effect";

import type { NotifierProviderError } from "../errors.js";

export type EmailMessage = {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
  readonly html?: string;
};

export class EmailProvider extends Context.Tag(
  "@dtpt/notifier/email/EmailProvider",
)<
  EmailProvider,
  {
    readonly send: (
      message: EmailMessage,
    ) => Effect.Effect<void, NotifierProviderError>;
  }
>() {}
