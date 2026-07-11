# Architecture

## Packages and dependencies

- `packages/core` owns domain models, shared HTTP contracts, persistence services, scheduling rules, and delivery channel boundaries.
- `packages/api` implements the public HTTP API using `core` contracts and services.
- `packages/jobs` implements notification orchestration and the scheduled worker using `core` services and channels.
- `packages/data` owns catalog, event, and development seed data and writes through `core` domain services.
- `packages/web` is the Astro frontend and consumes shared `core` contracts.

Dependencies point inward toward `core`. The API, jobs, data, and web packages do not provide domain abstractions for `core` or depend on one another for their primary behavior.

## Main flows

1. **Signup:** `web → shared core contract → api → users/subscriptions → database`
2. **Notify:** `Cloudflare cron or development trigger → jobs notify orchestration → subscriptions/events → channel → channel client → mark sent`
3. **Unsubscribe:** `web confirmation → shared core contract → api → user deletion → subscription cascade`

## Runtime and infrastructure

- The workspace uses TypeScript and the Effect v4 beta train pinned in the workspace catalog.
- The frontend is Astro and is built for Cloudflare.
- Domain persistence uses SQLite through Drizzle. Deployed persistence is Cloudflare D1.
- Alchemy composes deployed resources, including the D1 database and notification worker.
- A Cloudflare Worker cron starts scheduled production notification runs.
- Email delivery uses Resend. Dry runs use console delivery instead of the production provider.
- Runtime boundaries load environment configuration through typed Effect config.

Exact configuration names belong to `.env.template` and the config source files rather than this overview.

## Ownership and boundaries

- Shared public API contracts belong in `packages/core/src/contracts`.
- API handlers translate domain and infrastructure failures into public HTTP errors.
- Domain services do not depend on HTTP types.
- Notification orchestration depends on the `Channel` boundary.
- Channel rendering is separate from provider delivery through a channel client.
- Current Drizzle schemas and migrations define persisted structure.

## Testing and validation

- Persistence and domain tests use the real lightweight SQLite path where practical.
- Provider and network boundaries may use fakes.
- Behavior changes require focused tests covering the changed path.
- Repository-wide completion checks are `pnpm lint` and `pnpm typecheck`.
