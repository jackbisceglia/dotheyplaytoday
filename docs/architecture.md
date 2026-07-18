# Architecture

## Packages and dependencies

- `packages/core` owns domain models, shared HTTP contracts, persistence services, scheduling rules, and delivery channel boundaries.
- `packages/api` implements the public HTTP API using `core` contracts and services.
- `packages/jobs` implements notification orchestration and the scheduled worker using `core` services and channels.
- `packages/data` owns catalog, event, and development seed data and writes through `core` domain services.
- `packages/web` is the Astro frontend and consumes shared `core` contracts.

Dependencies point inward toward `core`. The API, jobs, data, and web packages do not provide domain abstractions for `core` or depend on one another for their primary behavior.

## Runtime and infrastructure

- TypeScript and Effect v4 beta.
- Astro on Cloudflare.
- SQLite and Drizzle, with Cloudflare D1 when deployed.
- Alchemy-provisioned D1 and notification worker.
- Alchemy seed Actions import the registered catalog collections at deploy time. Development may reset all seed data; the exact `production` stage runs a versioned, non-destructive catalog-only import that does not modify users or subscriptions.
- Cloudflare Worker cron for scheduled notifications.
- Resend email delivery and console dry runs.
- Typed Effect config at runtime boundaries.

Production deploys load `.env.production` through `--env-file .env.production`.

## Testing and validation

- Persistence and domain tests use the real lightweight SQLite path where practical.
- Provider and network boundaries may use fakes.
- Behavior changes require focused tests covering the changed path.
- Repository-wide completion checks are `pnpm lint` and `pnpm typecheck`.
