# Pro billing handoff

Free includes two teams; Pro includes six for $1.99 USD/month. Existing accounts
receive permanent free Pro through migration 0006. No production migration,
deployment, or live Stripe provisioning was performed during implementation.

## Ownership

Better Auth handles sign-in and sessions. The app owns customer mapping, checkout,
portal access, and subscription synchronization through the standard Stripe SDK.
Alchemy's native Stripe provider owns the Product, Price, dedicated Portal
configuration, and WebhookEndpoint. Runtime billing does not depend on the auth
plugin or Alchemy's runtime Stripe bindings. Autumn is not needed for this single
plan and allowance.

The coordinated dependency upgrade uses Alchemy `2.0.0-beta.78`, Effect and its
platform/SQL packages `4.0.0-rc.115`, Drizzle `1.0.0-rc.5-ab785fc`, and Vitest 5.
Standalone Vite uses `@alchemy.run/cloudflare-runtime` beta.78, matching the
runtime used by Alchemy instead of the older Distilled Cloudflare plugin.
The transitive Effect versions are pinned together to prevent a newer release
from mixing incompatible runtime modules into the graph. The Postgres bridge uses
Alchemy's `Drizzle/Postgres` entrypoint, and the production migration table name
remains `dtpt_postgres_migrations`.

## Grandfathering

Migration 0006 adds `users.grandfathered_pro` with a false default and updates
existing users to true. This is a one-time database backfill, independent of
Stripe. Existing users keep six teams even without a payment method; later users
start with two. Do not rerun the UPDATE as an operational script: that would
include accounts created after rollout. The migration ledger runs it once.

This stack has not applied migration 0006 in production, so its schema can be
revised before merge. If any environment already applied an earlier version,
add a follow-up migration there rather than rerunning or changing its applied
migration. Never reset the original cohort to manufacture a new cutoff.

## Configure Stripe test mode

1. Leave `BILLING_ENABLED` false or unset to develop without Stripe credentials.
   Free and grandfathered users remain fully usable, and checkout is unavailable.
2. To provision test billing, set `BILLING_ENABLED=true` in the deployment
   environment, `STRIPE_API_KEY=sk_test_...` for Alchemy's provider, and
   `STRIPE_SECRET_KEY=sk_test_...` for the API runtime. Both keys must belong to the
   same Stripe account and mode. An Alchemy Stripe profile can supply the
   provisioning key instead; CI uses `STRIPE_API_KEY`.
3. Run the usual build and Alchemy plan/deploy workflow for your test stage.
   Alchemy provisions a stage-specific $1.99 monthly price, portal configuration,
   and webhook at `/api/billing/webhook` on the resolved API origin. The price ID,
   portal ID, and signing secret are bound into the API; there is no separate
   setup script or secret-copy step. Migration 0006 runs before the Workers start.
4. The dedicated portal enables invoices, payment-method updates, and cancellation
   at period end. Price switching and quantity changes are disabled. Other apps'
   default portal configuration is unaffected.
5. For Stripe CLI forwarding to a local API, use `stripe listen --forward-to
localhost:8080/api/billing/webhook` and configure its reported signing secret
   as `STRIPE_WEBHOOK_SECRET`. Manual runtime configuration also accepts
   `STRIPE_PRO_PRICE_ID` and `STRIPE_PORTAL_CONFIGURATION_ID`. CLI secrets differ
   from deployed endpoint secrets.

The endpoint subscribes to `checkout.session.completed`,
`customer.subscription.created`, `customer.subscription.updated`, and
`customer.subscription.deleted`. Its API version matches the installed Stripe
SDK. Resource IDs remain in Alchemy state; preserve that state when changing the
provisioning workflow. Production Product and Price use Alchemy's built-in retain
policy.

## Verify before live billing

- Create an account after migration: two teams, with a third rejected. Confirm
  its magic link, then open checkout from `/home`.
- Pay with Stripe's test card `4242 4242 4242 4242`: checkout return synchronizes
  access even before a webhook arrives. Pro can save six teams. A manually added
  `?billing=success` query parameter never grants paid access.
- Open checkout twice or from two tabs: the pending session is reused. Canceling
  checkout preserves the roster. After its session expires, a new attempt works.
- An account present before migration says “Pro · free forever”, has six teams,
  and is refused checkout by the API.
- Schedule cancellation in Manage billing: six teams remain available until the
  paid period ends. End the test subscription and verify two-team access. Extra
  saved teams stay visible; emails use the first two until the member chooses a
  Free roster or renews Pro.
- Test failed renewal: access falls back to Free, and the outstanding subscription
  must be repaired or canceled in the portal before another purchase.
- Unsubscribe from emails: paid and grandfathered accounts retain their identity
  and billing access. Unsubscribing does not cancel payment or free Pro.
- Replay signed events: snapshots converge on current Stripe state. Invalid
  signatures return 400; provider/storage failures return 500 so Stripe retries.

Tests exercise real migrations, Postgres queries, authenticated HTTP routes, and
signature verification with mocked Stripe network calls. Run `pnpm test`,
`pnpm lint`, `pnpm typecheck`, and the web build. Real Stripe checkout and deployment
still require a test-mode smoke run with credentials.

## Enable live payments

Use production-stage live keys from the same Stripe account, set
`BILLING_ENABLED=true`, and review the Alchemy plan before deploying. Confirm the
$1.99 monthly price and dedicated portal cancellation settings in Stripe.

There is no annual plan, trial, discount, or self-service account deletion. Tax
collection is not configured in this pass; decide launch regions and tax handling
before a wider paid launch.
