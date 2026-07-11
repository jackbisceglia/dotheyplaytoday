import { Config, Effect, Redacted, Schema } from "effect";

import { unwrapAlchemyRedactedValue } from "../../../../lib/config/value.js";
import { EmailAddress } from "../../../users/schema.js";

export type ResendConfig = Config.Success<typeof ResendConfig>;
export const ResendConfig = Config.all({
  apiKey: Config.redacted("RESEND_API_KEY").pipe(
    Config.map((value) =>
      Redacted.make(unwrapAlchemyRedactedValue(Redacted.value(value))),
    ),
  ),
  from: Config.string("RESEND_FROM_EMAIL").pipe(
    Config.map(unwrapAlchemyRedactedValue),
    Config.mapOrFail((value) =>
      Schema.decodeUnknownEffect(EmailAddress)(value).pipe(
        Effect.mapError((error) => new Config.ConfigError(error)),
      ),
    ),
  ),
});
