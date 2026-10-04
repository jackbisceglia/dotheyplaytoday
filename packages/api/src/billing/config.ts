import { Config, Redacted } from "effect";

export const BillingConfig = Config.all({
  secretKey: Config.Redacted("STRIPE_SECRET_KEY").pipe(
    Config.withDefault(Redacted.make("")),
  ),
  webhookSecret: Config.Redacted("STRIPE_WEBHOOK_SECRET").pipe(
    Config.withDefault(Redacted.make("")),
  ),
  priceId: Config.String("STRIPE_PRO_PRICE_ID").pipe(Config.withDefault("")),
  portalConfigurationId: Config.String("STRIPE_PORTAL_CONFIGURATION_ID").pipe(
    Config.withDefault(""),
  ),
});

export const isBillingConfigured = (
  config: Config.Success<typeof BillingConfig>,
) =>
  Redacted.value(config.secretKey).length > 0 &&
  Redacted.value(config.webhookSecret).length > 0 &&
  config.priceId.length > 0;
