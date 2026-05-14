# dotheyplaytoday

`dotheyplaytoday` answers a simple recurring question: does something I follow have an event today?

The current V1 rewrite target is sports-first. Users subscribe to teams, choose a local send time and timezone, and receive an email only when a selected team has a game on their local date.

## Tech Stack

- TypeScript
- pnpm workspaces
- Effect v4
- SQLite + Drizzle
- SolidStart web app
- Effect HTTP API
- Resend for email delivery

## Workspace

- `packages/core`: domain, schemas, persistence, config, notifier, seed/import logic
- `packages/api`: HTTP API runtime
- `packages/web`: SolidStart frontend
- `packages/jobs`: scheduled notify job runtime
- `docs/rewrite`: canonical rewrite planning docs
- `reference`: local source references for implementation patterns

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
```
