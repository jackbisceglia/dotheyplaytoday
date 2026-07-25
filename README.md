# dotheyplaytoday

`dotheyplaytoday` is a sports notification app for a simple recurring question: does my team play today?

Users subscribe to teams and receive a notification when their team has a game on their local calendar day. Teams and games are current implementations of the reusable **Subject** and **Event** concepts, allowing the product to support other subjects and event sources over time.

See [Product](docs/product.md) for intended behavior and [Architecture](docs/architecture.md) for the current system overview.

## Tech stack

- TypeScript and Effect
- Astro
- PlanetScale PostgreSQL and Drizzle
- Cloudflare Hyperdrive
- Alchemy and Cloudflare Workers

## Packages

- `packages/core`: domain models, contracts, persistence, scheduling, and channels.
- `packages/api`: public HTTP API.
- `packages/jobs`: scheduled notification worker and notify orchestration.
- `packages/data`: catalog, event, and development seed data.
- `packages/web`: Astro frontend.

## Commands

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
pnpm typecheck
```

PostgreSQL infrastructure is provisioned by Alchemy. Authenticate PlanetScale
with `alchemy login` or set `PLANETSCALE_API_TOKEN_ID`,
`PLANETSCALE_API_TOKEN`, and `PLANETSCALE_ORGANIZATION`. Cloudflare provider
authentication is also required for infrastructure commands.

The exact `production` stage owns the single `dotheyplaytoday` PlanetScale
database and its protected `production` default branch. Other stages reference
that database and create isolated remote development branches; there is no
Docker or local database path. Provision the production stage once before
starting a development stage so its database reference exists.

Checked-in PostgreSQL migrations live in
`packages/data/migrations/postgres/`. Alchemy applies them transactionally
before creating runtime roles and running seed Actions. Production seeding is a
versioned, non-destructive catalog import; development seeding resets and
reconstructs catalog, event, and development-user data.

Run the disposable Worker → Hyperdrive → PlanetScale integration smoke test
after the production database stack exists:

```bash
pnpm test:smoke:postgres
```

It requires Cloudflare and PlanetScale provider credentials, creates an
isolated non-production branch and compute resources, verifies a real API
query, and destroys only those disposable resources.

Package helpers:

```bash
pnpm @core <cmd>
pnpm @api <cmd>
pnpm @jobs <cmd>
pnpm @data <cmd>
pnpm @web <cmd>
```
