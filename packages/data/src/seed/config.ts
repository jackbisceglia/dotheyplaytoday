import { EmailAddressFromString } from "@dtpt/core";
import { Config, Schema } from "effect";

// Bump when checked-in production catalog data changes.
export const CatalogSeedVersion = "2026-08-15.1";

export const SeedStrategy = Config.schema(
  Schema.Literals(["dev", "skip"]),
  "SEED_STRATEGY",
).pipe(Config.withDefault("dev"));

export const SeedConfig = Config.all({
  email: Config.schema(EmailAddressFromString, "SEED_EMAIL").pipe(
    Config.withDefault("fan@example.com"),
  ),
});
