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
- Alchemy seed Actions connect directly to the stage role URL rather than a Worker binding. `pnpm dev:seed` recreates only the calling checkout's development stage and seeds all subjects, NBA events, and the development user once; ordinary development restarts reuse that state. The exact `production` stage runs a versioned, non-destructive catalog-only import that does not modify users or subscriptions.
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

### Authentication boundary

Better Auth is mounted in the API Worker at `/api/auth/*` through an
`HttpApi` group with GET and POST wildcard handlers. The handler adapts Effect's server request to
Better Auth's Web `Request`/`Response` boundary, sharing the API's credentialed
CORS middleware and Worker entry point. Better Auth owns endpoint validation and responses; the shared `HttpApi` group
only declares the wildcard transport routes.
The stack supplies the resolved API and Web URLs through `bindApiUrl` and
`bindWebUrl` helpers, keeping URL bindings outside resource construction.
Only magic-link authentication is enabled, signup is disabled, tokens are
hashed at rest, and sessions are persisted in `auth_sessions`. Cookies remain
host-only to the API origin and secure on HTTPS. API and Web origins are trusted.

The existing `users` table is Better Auth's user model. Its normalized email
and existing ID remain the identity key; no parallel application-user table is
created. Auth adds `name`, `email_verified`, `created_at`, and
`updated_at` columns; Better Auth's optional profile-image field is not stored.
The built-in `/update-user` endpoint is disabled until account editing is
implemented, so it cannot write unsupported profile fields.
`User` remains the single table-backed domain schema, and its insert schema
keeps database-managed defaults optional. The unused name is nullable and
optional on insert. Existing rows begin unverified and are claimed when a magic link
proves email ownership. The magic-link sender normalizes the address and asks
Better Auth's internal adapter to silently skip unknown addresses. Better Auth
also has signup disabled, so an unknown address cannot create a row missing
timezone or unsubscribe identity. Both known and unknown requests receive
Better Auth's ordinary success response.

`Auth.make` reads runtime configuration, opens a scoped Promise-native
`pg.Pool` through Hyperdrive, and constructs Better Auth with its Drizzle adapter.
Auth uses standard Promise-native Drizzle over that pool, reusing the existing
user, session, account, and verification table definitions. Drizzle owns the SQL
column names; auth no longer repeats column mappings. Adapter transactions are
enabled. Application persistence remains on Effect + Drizzle. Better Auth awaits
its database work before returning; its optional background-task handler is not
enabled. `Auth.make(connectionString)` accepts a resolved string; the Worker
resolves Hyperdrive credentials when building that layer during an invocation.
The pool has one connection and closes with the Worker execution scope.

Magic-link email uses the existing transactional Email/Resend workflow. After
eligibility is checked, delivery is registered directly with the Worker's
`waitUntil`; it needs no further database access and does not delay the response.
There is no separate auth task queue. Future protected handlers can use
`auth.api.getSession({ headers })` from the `Auth` service; no session-specific
or generic API wrapper is introduced before it has a consumer.

Auth rate limiting uses Better Auth's in-memory store, shared across auth
instances within a Worker isolate. It allows five magic-link requests and ten
verification attempts per client IP per minute, using Cloudflare's
`cf-connecting-ip` header. These are per-isolate limits, not a global quota;
multiple isolates and isolate restarts do not share counters. A distributed
limit would require shared storage or an edge rate-limiting rule.

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

One small repository script resolves a deterministic, fail-closed development
stage. A positively identified primary Git checkout uses `dev_<user>`. A linked
Git worktree uses `dev_<user>_<worktree-name>`, deriving the last component
from the worktree directory rather than its branch. The resolver follows
Alchemy's stage alphabet, sanitizes components, verifies Git's common directory
and worktree metadata, and never accepts a non-`dev_` result. All
worktree-aware commands therefore use the same stage: `pnpm -s alchemy:stage`
prints the current name, `pnpm dev` starts it, `pnpm dev:destroy` interactively
destroys it, and `pnpm dev:seed` destroys it with `--yes` before recreating and
starting it. The resolver is an Effect whose Git process, path, and
configuration capabilities come from Effect Platform. Package lifecycle
commands pass its result through Alchemy's supported `STAGE` input;
`alchemy.run.ts` remains an ordinary stack definition. Generic deployment
commands are unchanged and do not invoke the development-stage resolver.

Repository tooling targets Node.js 24.18.0 or newer, as documented in
`package.json` engines. The stage script runs directly through Node's native
TypeScript support. Only the stage subprocess uses pnpm's silent flag;
ordinary pnpm commands retain their normal diagnostics.

An abandoned stage can be removed after its linked worktree is gone by
reconstructing the documented stage from the former user and directory name,
then running `pnpm destroy --stage <stage>` from another checkout. The generic
destroy command remains available for this explicit cleanup path. Existing
shared `dev_<user>` state is neither migrated nor automatically destroyed by
the worktree-scoped scheme.

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
4. Add the Web auth client, account/manage routes, session-driven redirects,
   and authenticated team-management APIs. Cookie sharing across subdomains is
   intentionally still disabled; browser calls target the API origin with
   credentials.
