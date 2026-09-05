import { EmailAddressFromString } from "@dtpt/core";
import { Config } from "effect";

// Bump when checked-in production catalog data changes.
export const CatalogSeedVersion = "2026-08-29.1";

export const SeedConfig = Config.all({
  email: Config.schema(EmailAddressFromString, "SEED_EMAIL").pipe(
    Config.withDefault("fan@example.com"),
  ),
});
