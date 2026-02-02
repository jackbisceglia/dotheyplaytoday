---
id: "06"
title: Seed data and documentation
description: Create sample JSON data for local testing and update README with setup/run instructions
status: TODO
priority: P0
prereqs:
  - 05-notify-command.md
---

**Acceptance:**

- [ ] Sample `packages/core/data/users.json` with test user
- [ ] Sample `packages/core/data/subscriptions.json` with Celtics subscription
- [ ] Sample `packages/core/data/topics/celtics.json` with upcoming games
- [ ] README updated with:
  - Project overview
  - Setup instructions (install, env vars)
  - How to run locally (`pnpm notify`)
  - JSON data format documentation
  - Timezone handling notes and DST behavior

**Verify:**

- Can clone repo, install deps, and run `pnpm notify` successfully
- README explains how to add new users/subscriptions
- Data format is clear and documented

**Notes:**

- Use realistic but fake data for testing
- Include both game-day and non-game-day examples in celtics.json
- Document the 15-minute cron interval
- Keep docs minimal but complete for MVP
