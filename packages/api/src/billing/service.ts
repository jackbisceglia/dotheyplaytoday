import { WebUrl } from "@dtpt/core/lib/config/web";
import { Database } from "@dtpt/core/lib/database/service";
import {
  mapToReadError,
  mapToWriteError,
  type DatabaseReadError,
  type DatabaseWriteError,
} from "@dtpt/core/lib/database/errors";
import { Id } from "@dtpt/core/lib/id/service";
import { resolveBillingAccess } from "@dtpt/core/modules/billing/policy";
import { billingSubscriptionsTable as subscriptions } from "@dtpt/core/modules/billing/schema";
import { usersTable, type User } from "@dtpt/core/modules/users/schema";
import { and, eq, isNull, sql } from "drizzle-orm";
import { Clock, Context, Effect, Layer, Redacted, Schema } from "effect";
import Stripe from "stripe";

import { BillingConfig, isBillingConfigured } from "./config.js";

export class BillingUnavailable extends Schema.TaggedError<BillingUnavailable>()(
  "BillingUnavailable",
  {},
) {}
export class BillingForbidden extends Schema.TaggedError<BillingForbidden>()(
  "BillingForbidden",
  {},
) {}
export class BillingInvalidRequest extends Schema.TaggedError<BillingInvalidRequest>()(
  "BillingInvalidRequest",
  {},
) {}
export class BillingProviderError extends Schema.TaggedError<BillingProviderError>()(
  "BillingProviderError",
  { cause: Schema.Defect() },
) {}
export class BillingInvalidSignature extends Schema.TaggedError<BillingInvalidSignature>()(
  "BillingInvalidSignature",
  {},
) {}

const customerIdOf = (customer: string | { id: string }) =>
  typeof customer === "string" ? customer : customer.id;

export class StripeBilling extends Context.Service<StripeBilling>()(
  "@dtpt/api/StripeBilling",
  {
    make: Effect.gen(function* () {
      const database = yield* Database;
      const id = yield* Id;
      const config = yield* BillingConfig;
      const home = new URL("/home", yield* WebUrl);
      const client = isBillingConfigured(config)
        ? new Stripe(Redacted.value(config.secretKey))
        : undefined;
      const configured = () =>
        client
          ? Effect.succeed(client)
          : Effect.fail(new BillingUnavailable({}));
      const provider = <A>(f: () => PromiseLike<A>) =>
        Effect.tryPromise({
          try: f,
          catch: (cause) => new BillingProviderError({ cause }),
        });
      const read = mapToReadError("StripeBilling.read");
      const write = mapToWriteError("StripeBilling.write");

      // Read the local revision BEFORE Stripe. If another sync writes while the
      // request is in flight, fetch again rather than overwrite it with old state.
      const syncSubscription = Effect.fn("StripeBilling.syncSubscription")(
        function* (subscriptionId: string, customerId: string) {
          const stripe = yield* configured();
          const [user] = yield* database
            .select({ id: usersTable.id })
            .from(usersTable)
            .where(eq(usersTable.stripeCustomerId, customerId))
            .pipe(read);
          if (!user) return; // This endpoint may share a Stripe account with other apps.
          for (let attempt = 0; attempt < 4; attempt++) {
            const previous = yield* database
              .select()
              .from(subscriptions)
              .where(eq(subscriptions.userId, user.id))
              .pipe(read);
            const current = yield* provider(() =>
              stripe.subscriptions.retrieve(subscriptionId),
            );
            if (customerIdOf(current.customer) !== customerId)
              return yield* new BillingInvalidRequest({});
            const item = current.items.data.find(
              (item) => item.price.id === config.priceId,
            );
            const existing = previous.find(
              (row) =>
                row.stripeSubscriptionId === current.id ||
                row.id === current.metadata.billingId,
            );
            if (!item && !existing) return;
            const snapshot = {
              plan: item ? "pro" : "unknown",
              userId: user.id,
              stripeCustomerId: customerId,
              stripeSubscriptionId: current.id,
              priceId:
                item?.price.id ?? current.items.data[0]?.price.id ?? null,
              status: current.status,
              periodStart: item
                ? new Date(item.current_period_start * 1000)
                : null,
              periodEnd: item ? new Date(item.current_period_end * 1000) : null,
              cancelAtPeriodEnd: current.cancel_at_period_end,
            };
            const saved = existing
              ? yield* database
                  .update(subscriptions)
                  .set({ ...snapshot, revision: existing.revision + 1 })
                  .where(
                    and(
                      eq(subscriptions.id, existing.id),
                      eq(subscriptions.revision, existing.revision),
                    ),
                  )
                  .returning({ id: subscriptions.id })
                  .pipe(write)
              : yield* database
                  .insert(subscriptions)
                  .values({ id: current.id, ...snapshot, revision: 1 })
                  .onConflictDoNothing()
                  .returning({ id: subscriptions.id })
                  .pipe(write);
            if (saved.length > 0) return;
          }
          return yield* new BillingProviderError({
            cause: new Error(
              "Concurrent billing sync did not converge; retry delivery.",
            ),
          });
        },
      );

      const sync = Effect.fn("StripeBilling.sync")(function* (user: User) {
        if (!user.stripeCustomerId) return;
        const stripe = yield* configured();
        let after: string | undefined;
        do {
          const page = yield* provider(() =>
            stripe.subscriptions.list({
              customer: user.stripeCustomerId ?? "",
              status: "all",
              limit: 100,
              ...(after ? { starting_after: after } : {}),
            }),
          );
          for (const subscription of page.data)
            yield* syncSubscription(subscription.id, user.stripeCustomerId);
          after = page.has_more ? page.data.at(-1)?.id : undefined;
        } while (after);
      });

      const checkout: (
        user: User,
      ) => Effect.Effect<
        { url: string },
        | BillingUnavailable
        | BillingForbidden
        | BillingInvalidRequest
        | BillingProviderError
        | DatabaseReadError
        | DatabaseWriteError
      > = Effect.fn("StripeBilling.checkout")(function* (user: User) {
        const stripe = yield* configured();
        if (user.grandfatheredPro) return yield* new BillingForbidden({});
        if (!user.emailVerified) return yield* new BillingInvalidRequest({});
        let customerId = user.stripeCustomerId;
        if (!customerId) {
          const customer = yield* provider(() =>
            stripe.customers.create(
              {
                email: user.email,
                metadata: { app: "dotheyplaytoday", userId: user.id },
              },
              { idempotencyKey: `dtpt-customer:${user.id}` },
            ),
          );
          yield* database
            .update(usersTable)
            .set({ stripeCustomerId: customer.id })
            .where(
              and(
                eq(usersTable.id, user.id),
                isNull(usersTable.stripeCustomerId),
              ),
            )
            .pipe(write);
          const [stored] = yield* database
            .select({ customerId: usersTable.stripeCustomerId })
            .from(usersTable)
            .where(eq(usersTable.id, user.id))
            .pipe(read);
          customerId = stored?.customerId ?? null;
          if (!customerId) return yield* new BillingInvalidRequest({});
        }
        yield* sync({ ...user, stripeCustomerId: customerId });
        const records = yield* database
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, user.id))
          .pipe(read);
        if (
          !resolveBillingAccess(user, records, yield* Clock.currentTimeMillis)
            .canUpgrade
        )
          return yield* new BillingInvalidRequest({});

        // The partial unique index and Stripe idempotency key share one attempt
        // across simultaneous tabs and retries, including a failed DB checkpoint.
        yield* database
          .insert(subscriptions)
          .values({
            id: yield* id.generate(),
            userId: user.id,
            plan: "pro",
            stripeCustomerId: customerId,
          })
          .onConflictDoNothing()
          .pipe(write);
        const [pending] = yield* database
          .select()
          .from(subscriptions)
          .where(
            and(
              eq(subscriptions.userId, user.id),
              eq(subscriptions.status, "incomplete"),
              isNull(subscriptions.stripeSubscriptionId),
            ),
          )
          .pipe(read);
        if (!pending) return yield* new BillingInvalidRequest({});
        if (pending.checkoutSessionId) {
          const existing = yield* provider(() =>
            stripe.checkout.sessions.retrieve(pending.checkoutSessionId ?? ""),
          );
          if (existing.status === "open" && existing.url)
            return { url: existing.url };
          if (existing.status === "complete") {
            yield* sync({ ...user, stripeCustomerId: customerId });
            return yield* new BillingInvalidRequest({});
          }
          yield* database
            .update(subscriptions)
            .set({
              status: "incomplete_expired",
              revision: sql`${subscriptions.revision} + 1`,
            })
            .where(
              and(
                eq(subscriptions.id, pending.id),
                isNull(subscriptions.stripeSubscriptionId),
              ),
            )
            .pipe(write);
          return yield* checkout({ ...user, stripeCustomerId: customerId });
        }
        // Recover a checkpoint failure by repeating the exact same Stripe call.
        // Expire unused attempts before Stripe can prune their idempotency key.
        const expiresAt =
          Math.floor(pending.createdAt.getTime() / 1000) + 23 * 60 * 60;
        if (
          expiresAt <
          Math.floor((yield* Clock.currentTimeMillis) / 1000) + 31 * 60
        ) {
          yield* database
            .update(subscriptions)
            .set({
              status: "incomplete_expired",
              revision: sql`${subscriptions.revision} + 1`,
            })
            .where(
              and(
                eq(subscriptions.id, pending.id),
                isNull(subscriptions.stripeSubscriptionId),
              ),
            )
            .pipe(write);
          return yield* checkout({ ...user, stripeCustomerId: customerId });
        }
        const session = yield* provider(() =>
          stripe.checkout.sessions.create(
            {
              mode: "subscription",
              customer: customerId,
              payment_method_types: ["card"],
              line_items: [{ price: config.priceId, quantity: 1 }],
              client_reference_id: user.id,
              subscription_data: {
                metadata: { app: "dotheyplaytoday", billingId: pending.id },
              },
              success_url: `${home.href}?billing=success`,
              cancel_url: `${home.href}?billing=canceled`,
              expires_at: expiresAt,
            },
            { idempotencyKey: `dtpt-pro-checkout:${pending.id}` },
          ),
        );
        if (!session.url)
          return yield* new BillingProviderError({
            cause: new Error("Stripe checkout URL missing"),
          });
        yield* database
          .update(subscriptions)
          .set({ checkoutSessionId: session.id })
          .where(eq(subscriptions.id, pending.id))
          .pipe(write);
        return { url: session.url };
      });

      const portal = Effect.fn("StripeBilling.portal")(function* (user: User) {
        const stripe = yield* configured();
        if (!user.stripeCustomerId) return yield* new BillingInvalidRequest({});
        return yield* provider(() =>
          stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId ?? "",
            return_url: `${home.href}?billing=returned`,
            ...(config.portalConfigurationId
              ? { configuration: config.portalConfigurationId }
              : {}),
          }),
        );
      });

      const webhook = Effect.fn("StripeBilling.webhook")(function* (
        payload: string,
        signature: string,
      ) {
        const stripe = yield* configured();
        const event = yield* Effect.tryPromise({
          try: () =>
            stripe.webhooks.constructEventAsync(
              payload,
              signature,
              Redacted.value(config.webhookSecret),
            ),
          catch: () => new BillingInvalidSignature({}),
        });
        switch (event.type) {
          case "customer.subscription.created":
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            yield* syncSubscription(
              event.data.object.id,
              customerIdOf(event.data.object.customer),
            );
            break;
          case "checkout.session.completed": {
            const session = event.data.object;
            if (session.subscription && session.customer)
              yield* syncSubscription(
                customerIdOf(session.subscription),
                customerIdOf(session.customer),
              );
            break;
          }
        }
      });
      return { checkout, portal, sync, webhook };
    }),
  },
) {}

export const StripeBillingLayer = Layer.effect(
  StripeBilling,
  StripeBilling.make,
);
