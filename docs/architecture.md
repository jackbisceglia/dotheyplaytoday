# Architecture

## Packages and dependencies

- `packages/core` owns domain models, shared HTTP contracts, persistence services, scheduling rules, and delivery channel boundaries.
- `packages/api` implements the public HTTP API using `core` contracts and services.
- `packages/jobs` implements notification orchestration and the scheduled worker using `core` services and channels.
- `packages/data` owns catalog, event, and development seed data and writes through `core` domain services.
- `packages/web` is the Solid 2 Start-mode frontend and consumes shared `core` contracts.

Dependencies point inward toward `core`. The API, jobs, data, and web packages do not provide domain abstractions for `core` or depend on one another for their primary behavior.

## Runtime and infrastructure

- TypeScript and Effect v4 beta.
- Solid 2 Start mode and Solid Router 2 on a Cloudflare Worker. Alchemy adopts
  Solid's `client` environment as static assets and its generated `ssr`
  Fetchable as the Worker entry.
- PlanetScale PostgreSQL and Drizzle, connected to Workers through Cloudflare Hyperdrive V1.
- Alchemy-provisioned PlanetScale database/branches/roles, Hyperdrive, public
  API worker, notification worker, and Web Worker. Each deployable owns its
  resource declaration in its package; `alchemy.run.ts` orchestrates them.
- Workers temporarily use their `workers.dev` endpoints. The Web Worker has a
  stable stage-qualified name; the intended custom domains are documented in
  [Alchemy service URL wiring](./alchemy-service-urls.md) and will be restored
  after the DNS zone moves to Cloudflare.
- The API and notification workers construct the existing `Database` Effect service from a Hyperdrive binding. Alchemy's PostgreSQL bridge scopes an `@effect/sql-pg` pool to each Worker event and exposes Drizzle's ordinary interactive transaction API; no connected pool is created at module scope or shared across invocations.
- Deployed Workers use Hyperdrive against the PlanetScale role's direct PostgreSQL origin. `alchemy dev` bypasses Hyperdrive and uses PlanetScale's pooled origin. Both require TLS; deployed Hyperdrive starts with an origin connection limit of five and has query caching disabled.
- Alchemy seed Actions connect directly to the stage role URL rather than a Worker binding. Development may reset all seed data; the exact `production` stage runs a versioned, non-destructive catalog-only import that does not modify users or subscriptions.
- Cloudflare Worker cron for scheduled notifications.
- Resend email delivery and console dry runs.
- Typed Effect config at runtime boundaries.

Web receives both an `API` service binding and the API Worker's complete
resolved URL. The shared typed API client loads a binding-backed HTTP transport
in the SSR environment and uses the public URL transport in the browser;
application calls are independent of that transport choice. API CORS receives
the Web Worker's exact `workers.dev` origin from deployment configuration. See
[Alchemy service URL wiring](./alchemy-service-urls.md) for the remaining
custom-domain follow-up.

Web uses all-SSR rendering. The attempted mixed-render design was rejected
because Solid Start mode has no SSR route-prerender hook; producing a static
home document would require post-build output mutation coupled to Alchemy's
asset-finalization order. Cloudflare still serves hashed client assets before
unmatched requests enter the generated Solid Fetchable. Development disables
runtime dependency discovery only in the SSR Vite environment because
Alchemy's workerd runner cannot safely reload an SSR program during an
in-flight request; native ESM dependencies are transformed without
prebundling.

Production deploys load `.env.production` through `--env-file .env.production`.

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

## Follow-up work

Atomicity is intentionally not restored by this migration. A follow-up should
compose ordinary Effect services inside `db.transaction(...)` for signup,
unsubscribe, subscription replacement, participant replacement, catalog
seeding, and development reset. Provider and other external network work must
remain outside those transactions.

Separate follow-ups are:

1. Evaluate a `Registration` application service while restoring signup atomicity.
2. Implement the PostgreSQL persistence test plan against disposable Alchemy-managed branches.
3. Evaluate Alchemy `Drizzle.Schema` and generated migrations after the explicit migration flow is stable.
4. Evaluate native PostgreSQL `UUID` and `TIMESTAMPTZ` columns independently of this migration.
