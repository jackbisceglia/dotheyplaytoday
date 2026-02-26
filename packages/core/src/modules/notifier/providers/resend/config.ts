import { Config, Schema } from "effect";
import { EmailAddress } from "../../../users/schema.js";

export const ResendConfig = Config.all({
  key: Config.redacted(Config.string("RESEND_API_KEY")),
  from: Schema.Config("RESEND_FROM_EMAIL", EmailAddress),
});
