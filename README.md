# dotheyplaytoday

`dotheyplaytoday` is a sports notification app for a simple recurring
question: does my team play today?

Users subscribe to teams, choose a local send time and timezone, and get notified
only when a selected team has a game on their local date.

## What It Does

- Lets a user subscribe to supported sports teams.
- Treats game times as global instants and evaluates "today" in the user's
  timezone.
- Sends one subject-scoped notification when a subscribed team has one or more
  same-day events.
- Tracks successful sends so normal runs do not repeatedly notify for the same
  local day.
- Keeps the operational model simple: schedule data is imported, then an
  external cron can run the notify job on a regular interval.

## Designed To Extend

Sports are the first product scope, not a one-off model baked through the whole
system.

The core language is intentionally broader:

- A **subject** is something a user can follow, like an NBA team.
- An **event** is a scheduled item that can appear in one or more subject feeds,
  like a game.
- A **subscription** connects a user to a subject plus a notification schedule.

That shape keeps the first version focused on sports notifications while leaving
room for other event feeds later: more leagues, tournaments, campus groups,
venues, clubs, shows, artists, or other recurring event sources.

## State Of The Monorepo

### Tech Stack

The forward path is built around:

- TypeScript
- Effect
- Astro
- SQLite + Drizzle

### Codebase Shape

- `packages/core`: first core implementation and product-behavior reference.
- `packages/core-v2`: current domain model, schemas, persistence, subscriptions,
  event reads, and channel boundaries.
- `packages/api`: first API runtime.
- `packages/api-v2`: current signup API runtime on top of `core-v2`.
- `packages/jobs`: first migration and notify job runtime.
- `packages/jobs-v2`: current notify job runtime on top of `core-v2`.
- `packages/data`: seed/import data, including NBA subjects and events.
- `packages/web`: current frontend surface while the web direction moves toward
  Astro.
- `docs/rewrite`: canonical product, domain, and rebuild notes.
- `reference`: local source references for implementation patterns.

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
pnpm @core-v2 <cmd>
pnpm @api <cmd>
pnpm @api-v2 <cmd>
pnpm @web <cmd>
pnpm @jobs <cmd>
pnpm @jobs-v2 <cmd>
pnpm @data <cmd>
```
