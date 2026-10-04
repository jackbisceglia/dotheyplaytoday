import * as Stripe from "alchemy/Stripe";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Output from "alchemy/Output";
import { retain } from "alchemy/RemovalPolicy";
import { Effect, Redacted } from "effect";
import StripeSdk from "stripe";

import { plans } from "@dtpt/core/modules/billing/policy";

// Called by the stack only when BILLING_ENABLED is set. Resource IDs and the
// signing secret stay in Alchemy state and are bound directly to the API.
export const bindBillingResources = Effect.fn("Billing.bindResources")(
  function* (api: Cloudflare.Worker, stage: string) {
    const product = yield* Stripe.Product("Pro", {
      name: "dotheyplaytoday Pro",
      description: "Game-day email updates for up to six teams",
    }).pipe(retain(stage === "production"));
    const price = yield* Stripe.Price("ProMonthly", {
      product,
      currency: plans.pro.currency,
      unitAmount: plans.pro.monthlyPriceCents,
      recurring: { interval: "month" },
      lookupKey: `dtpt_pro_monthly_${stage}`,
    }).pipe(retain(stage === "production"));
    const portal = yield* Stripe.BillingPortalConfiguration("ProPortal", {
      name: "dotheyplaytoday billing",
      features: {
        invoiceHistory: { enabled: true },
        paymentMethodUpdate: { enabled: true },
        subscriptionCancel: { enabled: true, mode: "at_period_end" },
        subscriptionUpdate: { enabled: false },
      },
    });
    const webhook = yield* Stripe.WebhookEndpoint("BillingWebhook", {
      url: Output.interpolate`${api.url}/api/billing/webhook`,
      apiVersion: StripeSdk.API_VERSION,
      enabledEvents: [
        "checkout.session.completed",
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
      ],
    });
    yield* api.bind("StripeBilling", {
      env: {
        STRIPE_PRO_PRICE_ID: price.id,
        STRIPE_PORTAL_CONFIGURATION_ID: portal.id,
        STRIPE_WEBHOOK_SECRET: webhook.secret.pipe(
          Output.map((secret) => secret ?? Redacted.make("")),
        ),
      },
    });
  },
);
