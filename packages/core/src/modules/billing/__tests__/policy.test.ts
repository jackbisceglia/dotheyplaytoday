import { describe, expect, it } from "vitest";

import { resolveBillingAccess } from "../policy.js";
import type { billingSubscriptionsTable } from "../schema.js";

const now = Date.parse("2026-09-30T12:00:00Z");
const user = { grandfatheredPro: false, stripeCustomerId: "cus_test" };
const paid: typeof billingSubscriptionsTable.$inferSelect = {
  id: "billing-1",
  plan: "pro",
  userId: "user-1",
  stripeCustomerId: "cus_test",
  stripeSubscriptionId: "sub_test",
  status: "active",
  periodStart: new Date("2026-09-01"),
  periodEnd: new Date("2026-10-01"),
  cancelAtPeriodEnd: false,
  priceId: "price_pro",
  checkoutSessionId: null,
  createdAt: new Date("2026-09-01"),
  revision: 0,
};

describe("Pro access", () => {
  it("gives new users two picks and the existing cohort six for free permanently", () => {
    expect(resolveBillingAccess(user, [], now)).toMatchObject({
      plan: "free",
      teamLimit: 2,
    });
    expect(
      resolveBillingAccess(
        { ...user, grandfatheredPro: true },
        [{ ...paid, status: "canceled" }],
        now,
      ),
    ).toMatchObject({
      plan: "pro",
      source: "grandfathered",
      teamLimit: 6,
      canUpgrade: false,
    });
  });

  it("keeps all six picks until the paid period ends after cancellation", () => {
    const ending = {
      ...paid,
      cancelAtPeriodEnd: true,
    };
    expect(resolveBillingAccess(user, [ending], now)).toMatchObject({
      plan: "pro",
      teamLimit: 6,
      cancelAtPeriodEnd: true,
    });
    expect(
      resolveBillingAccess(user, [ending], paid.periodEnd?.getTime() ?? 0),
    ).toMatchObject({ plan: "free", teamLimit: 2 });
  });

  it.each([
    "incomplete",
    "incomplete_expired",
    "past_due",
    "unpaid",
    "paused",
    "canceled",
  ])("does not grant paid access for %s", (status) => {
    expect(resolveBillingAccess(user, [{ ...paid, status }], now).plan).toBe(
      "free",
    );
  });

  it("requires the Pro plan and a current paid period", () => {
    expect(
      resolveBillingAccess(user, [{ ...paid, plan: "other" }], now).plan,
    ).toBe("free");
    expect(
      resolveBillingAccess(user, [{ ...paid, periodEnd: null }], now).plan,
    ).toBe("free");
    expect(
      resolveBillingAccess(
        user,
        [{ ...paid, periodEnd: new Date(now - 1) }],
        now,
      ).plan,
    ).toBe("free");
  });

  it("uses an active subscription even when an old canceled record is present", () => {
    expect(
      resolveBillingAccess(user, [{ ...paid, status: "canceled" }, paid], now),
    ).toMatchObject({ plan: "pro", subscriptionStatus: "active" });
  });

  it("requires billing management for outstanding subscriptions to prevent another charge", () => {
    expect(
      resolveBillingAccess(user, [{ ...paid, status: "past_due" }], now)
        .canUpgrade,
    ).toBe(false);
    expect(
      resolveBillingAccess(user, [{ ...paid, status: "canceled" }], now)
        .canUpgrade,
    ).toBe(true);
  });
});
