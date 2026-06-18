import { EmailAddressFromString } from "@dtpt/core-v2";
import { Config } from "effect";

export const SeedConfig = Config.all({
  email: Config.schema(EmailAddressFromString, "SEED_EMAIL").pipe(
    Config.withDefault("fan@example.com"),
  ),
});
