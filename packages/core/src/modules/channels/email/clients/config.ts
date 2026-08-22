import { Config } from "effect";

import { EmailAddress } from "../../../users/schema.js";

export type ResendConfig = Config.Success<typeof ResendConfig>;
export const ResendConfig = Config.all({
  apiKey: Config.redacted("RESEND_API_KEY"),
  from: Config.all({
    name: Config.string("RESEND_FROM_NAME").pipe(
      Config.withDefault("dotheyplaytoday"),
    ),
    email: Config.schema(EmailAddress, "RESEND_FROM_EMAIL"),
  }),
});
