import { makeAuthFixture } from "../../auth/__tests__/fixtures.js";
import { randomUUID } from "node:crypto";
import { makeDatabaseLayer } from "./database.js";
import { HttpApiLayer } from "../../index.js";
import { Auth } from "../../auth/auth.js";
import { StripeBillingLayer } from "../service.js";
import { UsersLayer } from "@dtpt/core/modules/users/service";
import { BillingLayer } from "@dtpt/core/modules/billing/service";
import { Events } from "@dtpt/core/modules/events/service";
import { Subjects } from "@dtpt/core/modules/subjects/service";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { Id } from "@dtpt/core/lib/id/service";
import { RateLimiter } from "../../rate-limit/service.js";
import { CloudflareHttpApiPlatformLayer } from "@dtpt/core/lib/effect/http/cloudflare";
import { Context, Effect, FileSystem, Layer, Path } from "effect";
import { HttpRouter } from "effect/unstable/http";
import { describe, expect, it, vi, onTestFinished } from "vitest";

const provider = vi.hoisted(() => ({
  customers: { search: vi.fn(), create: vi.fn() },
  subscriptions: { list: vi.fn(), retrieve: vi.fn() },
  prices: { retrieve: vi.fn() },
  checkout: { sessions: { create: vi.fn(), retrieve: vi.fn() } },
  billingPortal: { sessions: { create: vi.fn() } },
  sign: (payload: string) => payload,
}));

vi.mock("stripe", async () => {
  const { default: Stripe } =
    await vi.importActual<typeof import("stripe")>("stripe");
  const actual = new Stripe("sk_test_signature_only");
  provider.sign = (payload) =>
    actual.webhooks.generateTestHeaderString({ payload, secret: "whsec_test" });
  return {
    default: class {
      customers = provider.customers;
      subscriptions = provider.subscriptions;
      prices = provider.prices;
      checkout = provider.checkout;
      billingPortal = provider.billingPortal;
      webhooks = actual.webhooks;
    },
  };
});

const configuration = {
  STRIPE_SECRET_KEY: "sk_test_fixture",
  STRIPE_WEBHOOK_SECRET: "whsec_test",
  STRIPE_PRO_PRICE_ID: "price_pro",
};
const accountId = "00000000-0000-4000-8000-000000000001";
const checkoutBody = {
  plan: "pro",
  successUrl: "https://www.example.com/home?billing=success",
  cancelUrl: "https://www.example.com/home?billing=canceled",
  disableRedirect: true,
};
const subscription = {
  id: "sub_test",
  object: "subscription",
  customer: "cus_test",
  status: "active",
  cancel_at_period_end: false,
  cancel_at: null,
  canceled_at: null,
  ended_at: null,
  trial_start: null,
  trial_end: null,
  schedule: null,
  metadata: {
    userId: accountId,
    referenceId: accountId,
    billingId: "billing-1",
  },
  items: {
    data: [
      {
        id: "si_test",
        quantity: 1,
        current_period_start: 1790812800,
        current_period_end: 4102444800,
        price: {
          id: "price_pro",
          type: "recurring",
          recurring: { interval: "month", usage_type: "licensed" },
        },
      },
    ],
  },
};

const makeFixture = async () => {
  vi.clearAllMocks();
  provider.customers.search.mockResolvedValue({ data: [] });
  provider.customers.create.mockResolvedValue({ id: "cus_test" });
  provider.subscriptions.list.mockResolvedValue({ data: [] });
  provider.subscriptions.retrieve.mockResolvedValue(subscription);
  provider.prices.retrieve.mockResolvedValue(subscription.items.data[0]?.price);
  provider.checkout.sessions.create.mockResolvedValue({
    id: "cs_test",
    url: "https://checkout.stripe.com/test",
    status: "open",
  });
  provider.checkout.sessions.retrieve.mockResolvedValue({
    id: "cs_test",
    status: "open",
    url: "https://checkout.stripe.com/test",
  });
  provider.billingPortal.sessions.create.mockResolvedValue({
    url: "https://billing.stripe.com/test",
  });
  const f = await makeAuthFixture(configuration);
  await f.database.query(
    "UPDATE users SET grandfathered_pro = false, unsubscribe_token = $1, id = $1",
    [accountId],
  );
  const signIn = async () => {
    await f.auth.client.handler(
      f.request("/sign-in/magic-link", { email: "user@example.com" }),
    );
    await Promise.all(f.pending);
    const url = f.sendConfirmationLink.mock.calls[0]?.[1];
    if (!url) throw new Error("Missing confirmation link");
    const response = await f.auth.client.handler(new Request(url));
    const cookie = response.headers.get("set-cookie")?.split(";", 1)[0];
    if (!cookie) throw new Error("Missing cookie");
    return cookie;
  };
  const databaseLayer = makeDatabaseLayer(f.database);
  const services = Layer.mergeAll(
    UsersLayer,
    BillingLayer,
    StripeBillingLayer,
  ).pipe(
    Layer.provideMerge(databaseLayer),
    Layer.provide(Layer.mock(Id, { generate: () => Effect.sync(randomUUID) })),
  );
  const web = HttpRouter.toWebHandler(
    HttpApiLayer.pipe(
      Layer.provide([
        services,
        Layer.succeed(Auth, f.auth),
        Layer.mock(Subjects, {}),
        Layer.mock(Events, {}),
        Layer.mock(Subscriptions, {}),
        Layer.mock(RateLimiter, { check: () => Effect.void }),
        CloudflareHttpApiPlatformLayer,
        FileSystem.layerNoop({}),
        Path.layer,
      ]),
      Layer.provide(f.layer),
    ),
  );
  onTestFinished(web.dispose);
  const request = (
    path: string,
    body: unknown,
    cookie?: string,
    origin = "https://www.example.com",
  ) =>
    web.handler(
      new Request(`https://api.example.com/api${path}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin,
          ...(cookie ? { cookie } : {}),
        },
        body: JSON.stringify(body),
      }),
      Context.empty(),
    );
  const event = (
    object: unknown,
    type = "customer.subscription.updated",
    signed = true,
  ) => {
    const payload = JSON.stringify({
      id: "evt_test",
      object: "event",
      type,
      data: { object },
    });
    return web.handler(
      new Request("https://api.example.com/api/billing/webhook", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "stripe-signature": signed ? provider.sign(payload) : "invalid",
        },
        body: payload,
      }),
      Context.empty(),
    );
  };
  const saveSubscription = () =>
    f.database.query(
      "INSERT INTO billing_subscriptions (id, plan, user_id, stripe_customer_id, stripe_subscription_id, status, period_start, period_end) VALUES ('billing-1', 'pro', $1, 'cus_test', 'sub_test', 'active', '2026-09-01', '2100-01-01')",
      [accountId],
    );
  return { ...f, signIn, request, event, saveSubscription };
};

describe("app-owned Stripe integration", () => {
  it("creates checkout for an existing verified account without granting Pro early", async () => {
    const f = await makeFixture();
    const cookie = await f.signIn();
    const response = await f.request("/billing/checkout", checkoutBody, cookie);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      url: "https://checkout.stripe.com/test",
    });
    const saved = (
      await f.database.query<{ id: string; status: string }>(
        "SELECT id, status FROM billing_subscriptions",
      )
    ).rows[0];
    if (!saved) throw new Error("Missing billing record");
    expect(provider.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        customer: "cus_test",
        line_items: [{ price: "price_pro", quantity: 1 }],
      }),
      expect.objectContaining({
        idempotencyKey: `dtpt-pro-checkout:${saved.id}`,
      }),
    );
    expect(
      (await f.database.query("SELECT status FROM billing_subscriptions")).rows,
    ).toEqual([{ status: "incomplete" }]);
    expect(
      (await f.request("/billing/checkout", checkoutBody, cookie)).status,
    ).toBe(200);
    expect(
      (await f.database.query("SELECT id FROM billing_subscriptions")).rows,
    ).toEqual([{ id: saved.id }]);
    expect(provider.checkout.sessions.create).toHaveBeenCalledTimes(1);
  });

  it("requires authentication, prevents cross-account references, and never charges grandfathered members", async () => {
    const f = await makeFixture();
    expect((await f.request("/billing/checkout", checkoutBody)).status).toBe(
      401,
    );
    const cookie = await f.signIn();
    // Client-supplied account and return URL fields cannot change server ownership.
    expect(
      (
        await f.request(
          "/billing/checkout",
          { referenceId: "someone-else", successUrl: "https://evil.example" },
          cookie,
          "https://evil.example",
        )
      ).status,
    ).toBe(403);
    await f.database.exec("UPDATE users SET grandfathered_pro = true");
    expect(
      (await f.request("/billing/checkout", checkoutBody, cookie)).status,
    ).toBe(403);
    expect(provider.checkout.sessions.create).not.toHaveBeenCalled();
    expect(provider.customers.create).not.toHaveBeenCalled();
  });

  it("directs past-due members to their existing billing", async () => {
    const f = await makeFixture();
    const cookie = await f.signIn();
    await f.saveSubscription();
    await f.database.exec(
      "UPDATE billing_subscriptions SET status = 'past_due'",
    );
    expect(
      (await f.request("/billing/checkout", checkoutBody, cookie)).status,
    ).toBe(400);
    expect(provider.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it("requires email verification before creating a checkout or customer", async () => {
    const f = await makeFixture();
    const cookie = await f.signIn();
    await f.database.exec("UPDATE users SET email_verified = false");
    expect(
      (await f.request("/billing/checkout", checkoutBody, cookie)).status,
    ).toBe(400);
    expect(provider.customers.create).not.toHaveBeenCalled();
    expect(provider.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it("verifies webhook signatures and reconciles repeated or out-of-order events to current Stripe state", async () => {
    const f = await makeFixture();
    await f.database.exec("UPDATE users SET stripe_customer_id = 'cus_test'");
    await f.saveSubscription();
    expect((await f.event(subscription, undefined, false)).status).toBe(400);
    expect(provider.subscriptions.retrieve).not.toHaveBeenCalled();
    provider.subscriptions.retrieve.mockResolvedValue({
      ...subscription,
      status: "canceled",
      canceled_at: 1790812800,
      ended_at: 1790812800,
    });
    expect((await f.event(subscription)).status).toBe(200);
    expect((await f.event(subscription)).status).toBe(200);
    expect(
      (await f.database.query("SELECT status FROM billing_subscriptions")).rows,
    ).toEqual([{ status: "canceled" }]);
  });

  it("returns a failed webhook delivery when synchronization fails so Stripe retries", async () => {
    const f = await makeFixture();
    await f.database.exec("UPDATE users SET stripe_customer_id = 'cus_test'");
    await f.saveSubscription();
    provider.subscriptions.retrieve.mockRejectedValue(
      new Error("Stripe temporarily unavailable"),
    );
    expect((await f.event(subscription)).status).toBe(500);
  });

  it("opens the customer portal for accounts with billing history", async () => {
    const f = await makeFixture();
    const cookie = await f.signIn();
    await f.database.exec("UPDATE users SET stripe_customer_id = 'cus_test'");
    const response = await f.request(
      "/billing/portal",
      { returnUrl: "https://www.example.com/home", disableRedirect: true },
      cookie,
    );
    expect(response.status).toBe(200);
    expect(provider.billingPortal.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: "cus_test",
        return_url: "https://www.example.com/home?billing=returned",
      }),
    );
  });
  it("synchronizes a completed purchase on return before a webhook arrives", async () => {
    const f = await makeFixture();
    const cookie = await f.signIn();
    expect((await f.request("/billing/checkout", {}, cookie)).status).toBe(200);
    const pending = (
      await f.database.query<{ id: string }>(
        "SELECT id FROM billing_subscriptions",
      )
    ).rows[0];
    if (!pending) throw new Error("Missing checkout attempt");
    const paid = { ...subscription, metadata: { billingId: pending.id } };
    provider.subscriptions.list.mockResolvedValue({
      data: [paid],
      has_more: false,
    });
    provider.subscriptions.retrieve.mockResolvedValue(paid);
    const response = await f.request("/billing/sync", {}, cookie);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ plan: "pro", teamLimit: 6 });
    expect(
      (await f.database.query("SELECT status FROM billing_subscriptions")).rows,
    ).toEqual([{ status: "active" }]);
    expect((await f.request("/billing/checkout", {}, cookie)).status).toBe(400);
    expect(provider.checkout.sessions.create).toHaveBeenCalledTimes(1);
  });

  it("uses the same pending attempt for simultaneous checkout requests", async () => {
    const f = await makeFixture();
    const cookie = await f.signIn();
    const responses = await Promise.all([
      f.request("/billing/checkout", {}, cookie),
      f.request("/billing/checkout", {}, cookie),
    ]);
    expect(responses.map((response) => response.status)).toEqual([200, 200]);
    const rows = (
      await f.database.query<{ id: string }>(
        "SELECT id FROM billing_subscriptions",
      )
    ).rows;
    expect(rows).toHaveLength(1);
    const [pending] = rows;
    if (!pending) throw new Error("Missing checkout attempt");
    const keys = provider.checkout.sessions.create.mock.calls.map(
      (call) =>
        (call[1] as { idempotencyKey?: string } | undefined)?.idempotencyKey,
    );
    expect(keys.length).toBeGreaterThan(0);
    expect(new Set(keys)).toEqual(new Set([`dtpt-pro-checkout:${pending.id}`]));
  });

  it("replaces an expired checkout with a new attempt and idempotency key", async () => {
    const f = await makeFixture();
    const cookie = await f.signIn();
    expect((await f.request("/billing/checkout", {}, cookie)).status).toBe(200);
    provider.checkout.sessions.retrieve.mockResolvedValue({
      status: "expired",
    });
    provider.checkout.sessions.create.mockResolvedValue({
      id: "cs_new",
      url: "https://checkout.stripe.com/new",
      status: "open",
    });
    const response = await f.request("/billing/checkout", {}, cookie);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      url: "https://checkout.stripe.com/new",
    });
    const rows = (
      await f.database.query(
        "SELECT status FROM billing_subscriptions ORDER BY created_at",
      )
    ).rows;
    expect(rows).toEqual([
      { status: "incomplete_expired" },
      { status: "incomplete" },
    ]);
    const keys = provider.checkout.sessions.create.mock.calls.map(
      (call) =>
        (call[1] as { idempotencyKey?: string } | undefined)?.idempotencyKey,
    );
    expect(new Set(keys).size).toBe(2);
  });

  it("refetches after a concurrent sync instead of overwriting cancellation with an older response", async () => {
    const f = await makeFixture();
    await f.database.exec("UPDATE users SET stripe_customer_id = 'cus_test'");
    await f.saveSubscription();
    let release!: (value: typeof subscription) => void;
    let started!: () => void;
    const fetching = new Promise<void>((resolve) => {
      started = resolve;
    });
    provider.subscriptions.retrieve.mockImplementationOnce(() => {
      started();
      return new Promise<typeof subscription>((resolve) => {
        release = resolve;
      });
    });
    provider.subscriptions.retrieve.mockResolvedValue({
      ...subscription,
      status: "canceled",
    });
    const slow = f.event(subscription);
    await fetching;
    expect((await f.event(subscription)).status).toBe(200);
    release(subscription);
    expect((await slow).status).toBe(200);
    expect(
      (
        await f.database.query(
          "SELECT status, revision FROM billing_subscriptions",
        )
      ).rows,
    ).toEqual([{ status: "canceled", revision: 2 }]);
    expect(provider.subscriptions.retrieve).toHaveBeenCalledTimes(3);
  });
});
