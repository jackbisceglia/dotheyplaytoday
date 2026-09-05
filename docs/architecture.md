# Architecture

## Packages and dependencies

- `packages/core` owns domain models, shared HTTP contracts, persistence services, scheduling rules, notifier implementations, and provider-neutral transport boundaries.
- `packages/api` implements the public HTTP API using `core` contracts and services.
- `packages/jobs` implements notification orchestration and scheduled Workers
  using `core` services and notifiers. Internal operational jobs live under
  `src/ops`, grouped by concern.
- `packages/data` owns catalog, event, and development seed data and writes through `core` domain services.
- `packages/web` is the Solid 2 Start-mode frontend and consumes shared `core` contracts.

The feedback write path is intentionally small: its API handler validates the
shared contract and inserts directly through the `Database` service. The
operations Worker's feedback workflow reads directly for its preceding 12-hour
UTC window; there is no feedback domain service because neither path has
reusable domain behavior.

Dependencies point inward toward `core`. The API, jobs, data, and web packages do not provide domain abstractions for `core` or depend on one another for their primary behavior.

## Runtime and infrastructure

- TypeScript and Effect v4 beta.
- Solid 2 Start mode and Solid Router 2 on a Cloudflare Worker. Alchemy adopts
  Solid's `client` environment as static assets and its generated `ssr`
  Fetchable as the Worker entry.
- PlanetScale PostgreSQL and Drizzle, connected to Workers through Cloudflare Hyperdrive V1.
- Alchemy-provisioned PlanetScale database/branches/roles, Hyperdrive, public
  API Worker, notification Worker, operations Worker, and Web Worker. Each
  deployable owns its resource declaration in its package; `alchemy.run.ts`
  orchestrates them.
- Alchemy attaches the exact `production` stage to `dotheyplay.today`,
  `api.dotheyplay.today`, and `jobs.dotheyplay.today`. Other non-development
  stages prepend their normalized stage; `dev_*` stages keep development-only
  URLs and do not claim custom domains.
- The production stack manages HTTPS redirection and a conservative HSTS
  policy as Cloudflare zone settings. It adopts the existing Cloudflare zone,
  retains it on stack destruction, and exposes it to other stages through an
  Alchemy resource reference. Existing DNS records remain unmanaged until they
  are individually declared and adopted. No other stage manages the zone-wide
  settings.
- The API, notification, and operations Workers construct the existing
  `Database` Effect service from a Hyperdrive binding. Alchemy's PostgreSQL
  bridge scopes an `@effect/sql-pg` pool to each Worker event and exposes
  Drizzle's ordinary interactive transaction API; no connected pool is created
  at module scope or shared across invocations.
- Transactional workflows use Drizzle's Effect-native `database.transaction(...)`. Drizzle delegates to its underlying `PgClient.withTransaction(...)`, so domain-service queries inherit the transaction connection from Effect context and nested service transactions use savepoints without threading a transaction object through service APIs.
- Deployed Workers use Hyperdrive against the PlanetScale role's direct PostgreSQL origin. `alchemy dev` bypasses Hyperdrive and uses PlanetScale's pooled origin. Both require TLS; deployed Hyperdrive starts with an origin connection limit of five and has query caching disabled.
- Alchemy seed Actions connect directly to the stage role URL rather than a Worker binding. `pnpm dev:seed` recreates the personal development stage and seeds all subjects, NBA events, and the development user once; ordinary development restarts reuse that state. The exact `production` stage runs a versioned, non-destructive catalog-only import that does not modify users or subscriptions.
- Cloudflare Worker cron for scheduled notifications.
- A shared operations Worker hosts internal scheduled concerns. Its feedback
  workflow runs twice daily and sends recent feedback to the configured
  administrator. It selects the half-open 00:00–12:00 or 12:00–24:00 UTC
  submission window and uses that window as the provider idempotency key.
- Resend email delivery and console dry runs. Scheduled notifications depend on
  the `Notifier` service, with interchangeable email and console layers. The
  provider-neutral `Email` service sends complete outbound emails, and its
  Resend layer factory binds the required sender. Resend also owns SDK calls,
  API-key configuration, retry policy, and provider error mapping.
  Email-provider modules expose a resolved-options layer constructor and a
  Config-backed adapter with the same shape.
- Typed Effect config at runtime boundaries.

The notification Worker provisions the email notifier, which renders a
`Notification` and delegates separate delivery metadata and rendered content to
`Email`. The transactional signup-confirmation workflow bypasses `Notifier` and
provides the same concrete Resend email layer internally, while the API Worker
validates its configuration at startup. After a signup
transaction commits, the API constructs a complete confirmation without further
database reads and uses Alchemy's `WorkerExecutionContext.waitUntil` to attach
best-effort delivery to the Cloudflare request lifetime. Delivery failures are
logged in that background effect and do not alter the `{ ok: true }` response.
The operations Worker owns feedback's administrator config, digest rendering,
and a static Resend email layer with its operations-specific sender; `core`
retains the generic email rendering and provider boundaries used by that
workflow.

Web receives both an `API` service binding and the API Worker's complete
resolved URL. The shared typed API client loads a binding-backed HTTP transport
in the SSR environment and uses the public URL transport in the browser;
application calls are independent of that transport choice. API CORS and the
notification Worker consume the Web Worker's resolved URL through late
bindings, avoiding a props-level resource cycle without reconstructing deployed
URLs. See [Alchemy service URL wiring](./alchemy-service-urls.md).

Link previews are served from a committed `public/og.png`, rendered offline by
`pnpm @web og:generate` (`packages/web/scripts/og.ts`) through satori and resvg. Keeping
it a build artifact rather than a request-time route keeps native rendering
dependencies out of the deploy and gives crawlers a cacheable static asset.
Crawlers fetch `og:image` from their own servers rather than resolving it
against the page, so the tag is absolutized against the incoming request URL.

Web uses all-SSR rendering. The attempted mixed-render design was rejected
because Solid Start mode has no SSR route-prerender hook; producing a static
home document would require post-build output mutation coupled to Alchemy's
asset-finalization order. Cloudflare still serves hashed client assets before
unmatched requests enter the generated Solid Fetchable. Development disables
runtime dependency discovery only in the SSR Vite environment because
Alchemy's workerd runner cannot safely reload an SSR program during an
in-flight request; native ESM dependencies are transformed without
prebundling.

Local production deploys load `.env.production` through
`--env-file .env.production`. Pushes to `main` run the same exact `production`
stage through GitHub Actions, with the production GitHub environment injecting
provider and application configuration directly into the Alchemy process.
Production deploys are serialized, run repository checks before apply, and
verify the Web and API health endpoints after apply. Only pushes to `main` can
start the workflow; production has no manual dispatch path.

The `production` stage owns the retained PlanetScale database and production
branch. Other stages reference that database and own disposable development
branches on PlanetScale's PS-DEV size. Destroy non-production stages when they
are no longer needed so their branch billing stops. Alchemy applies checked-in
migrations before creating runtime roles, Workers, and seed Actions.

There is no automated D1 data transfer. Seeds rebuild catalog and development
data; the current production owner account must be recreated manually.

## Testing and validation

- Schema-only and domain-only tests continue to run locally.
- The removed SQLite suites are represented by the behavior-focused [PostgreSQL persistence test plan](./test-plan/postgres.md). Reintroduce and prune those cases against disposable Alchemy-managed branches.
- The opt-in PostgreSQL infrastructure test deploys a disposable database and Worker stack, queries PlanetScale through Worker → Hyperdrive, and destroys the stack. It requires both provider credentials.
- Provider and network boundaries may use fakes.
- Behavior changes require focused tests covering the changed path.
- Repository-wide completion checks are `pnpm lint` and `pnpm typecheck`.

Transaction rollback integration tests must run only against disposable
Alchemy-managed PlanetScale branches. They remain opt-in because local database
substitutes are not representative of the production transaction path.

Catalog imports decode the checked-in data and validate feed references before
opening one transaction. Event source IDs are resolved into feed edges while
that transaction serializes writes on its reserved PostgreSQL connection. This
deliberately trades import speed for full-catalog rollback and avoids concurrent
operations on one transaction connection. Seed Actions use the direct stage
role rather than a Worker or Hyperdrive connection, and catalog versions should
remain bounded so the transaction does not become an unbounded deployment
operation.

## Follow-up work

Separate follow-ups are:

1. Implement the remaining PostgreSQL persistence test plan against disposable Alchemy-managed branches.
2. Evaluate Alchemy `Drizzle.Schema` and generated migrations after the explicit migration flow is stable.
3. Evaluate native PostgreSQL `UUID` and `TIMESTAMPTZ` columns independently of this migration.
