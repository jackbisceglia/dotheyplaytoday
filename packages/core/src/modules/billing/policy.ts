import type { User } from "../users/schema.js";
import type { billingSubscriptionsTable } from "./schema.js";

export const plans = {
  free: { teamLimit: 2 },
  pro: { teamLimit: 6, monthlyPriceCents: 199, currency: "usd" },
} as const;

type BillingSubscription = typeof billingSubscriptionsTable.$inferSelect;

export function resolveBillingAccess(
  user: Pick<User, "grandfatheredPro" | "stripeCustomerId">,
  subscriptions: readonly BillingSubscription[],
  now: number,
) {
  const active = subscriptions.find(
    (subscription) =>
      subscription.plan === "pro" &&
      (subscription.status === "active" ||
        subscription.status === "trialing") &&
      subscription.periodEnd !== null &&
      subscription.periodEnd.getTime() > now,
  );
  const latest =
    active ??
    [...subscriptions].sort(
      (a, b) =>
        (b.periodStart?.getTime() ?? 0) - (a.periodStart?.getTime() ?? 0),
    )[0];
  const source = user.grandfatheredPro
    ? "grandfathered"
    : active
      ? "stripe"
      : "free";
  const plan = source === "free" ? "free" : "pro";

  return {
    plan,
    source,
    teamLimit: plans[plan].teamLimit,
    subscriptionStatus: latest?.status ?? null,
    periodEnd: latest?.periodEnd?.toISOString() ?? null,
    cancelAtPeriodEnd: latest?.cancelAtPeriodEnd ?? false,
    hasBillingCustomer: user.stripeCustomerId !== null,
    canUpgrade:
      !user.grandfatheredPro &&
      !subscriptions.some(
        (subscription) =>
          subscription.stripeSubscriptionId &&
          !["canceled", "incomplete_expired"].includes(subscription.status),
      ),
  } as const;
}
