# dotheyplaytoday

`dotheyplaytoday` is a sports notification app for a simple recurring question: does my team play today?

Users subscribe to supported teams and receive a notification when their team has a game on their local calendar date. Teams and games are current implementations of the reusable **Subject** and **Event** concepts, allowing the product to support other sports and event sources over time.

See [Product](docs/product.md) for intended behavior and [Architecture](docs/architecture.md) for the current system overview.

## Tech stack

- TypeScript and Effect
- Astro
- SQLite and Drizzle, with Cloudflare D1 in production
- Alchemy and Cloudflare Workers
- Resend email delivery

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

Package helpers:

```bash
pnpm @core <cmd>
pnpm @api <cmd>
pnpm @jobs <cmd>
pnpm @data <cmd>
pnpm @web <cmd>
```
