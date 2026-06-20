# dotheyplaytoday

`dotheyplaytoday` is a sports notification app for a simple recurring question: does my team play today?

Users subscribe to teams and get notified only when their team has a game that day.

## What It Does

- Allows a user to subscribe to supported sports teams.
- Sends a notification when their subscribed team has an event that day.

## Designed To Extend

Sports are the initial scope, but teams and games are implementations of generic **Subject** and **Event** concepts.

Thus, the app can extend to more leagues, tournaments, campus groups, venues, clubs, shows, artists, or other recurring event sources.

## State Of The Monorepo

### Tech Stack

The forward path is built around:

- TypeScript
- Effect
- Astro
- SQLite + Drizzle

### Codebase Shape

- `packages/core`: current domain model, schemas, persistence, subscriptions,
  event reads, and channel boundaries.
- `packages/api`: HTTP API built on top of `core`.
- `packages/jobs`: notify job built on top of `core`.
- `packages/data`: seed/import data, including NBA subjects and events.
- `packages/web`: Astro signup frontend built on top of `core`.
- `docs/rewrite`: canonical product, domain, and rebuild notes.

## Coming Soon

- Finish the end-to-end V2 path for signup, notify, and unsubscribe.
- Move the frontend surface toward Astro.
- Expand sports data imports beyond the initial NBA seed path.
- Document production environment variables, deploy shape, and cron setup.

## Commands

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Package helpers:

```bash
pnpm @core <cmd>
pnpm @api <cmd>
pnpm @web <cmd>
pnpm @jobs <cmd>
pnpm @data <cmd>
```
