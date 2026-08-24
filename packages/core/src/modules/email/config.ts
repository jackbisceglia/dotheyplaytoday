import { Config } from "effect";

import { EmailAddress } from "../users/schema.js";

export type EmailOptions = Config.Success<typeof EmailConfig>;
export const EmailConfig = Config.all({
  from: Config.all({
    name: Config.string("EMAIL_FROM_NAME").pipe(
      Config.withDefault("dotheyplaytoday"),
    ),
    email: Config.schema(EmailAddress, "EMAIL_FROM_ADDRESS"),
  }),
});

export type ResendConfig = Config.Success<typeof ResendConfig>;
export const ResendConfig = Config.all({
  apiKey: Config.redacted("RESEND_API_KEY"),
});
