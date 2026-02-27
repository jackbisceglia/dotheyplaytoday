---
id: "06"
title: Seed data and documentation
description: Create sample JSON data for local testing and update README with setup/run instructions
status: DONE
priority: P0
prereqs:
  - 05-notify-command.md
  - 07-sports-event-home-away-context.md
---

**Acceptance:**

- [ ] Sample `packages/core/data/users.json` with test user
- [ ] Sample `packages/core/data/subscriptions.json` with Celtics subscription
- [ ] Sample `packages/core/data/topics/<topicId>-celtics.json` with upcoming games and required event `site`
- [ ] README updated with:
  - Project overview
  - Setup instructions (install, env vars)
  - How to run locally (`pnpm @jobs start:notify`)
  - JSON data format documentation
  - Event `site` field (required) and sports-specific values (`home`/`away`) with notification phrasing (`vs.`/`at`)
  - Timezone handling notes and DST behavior

**Verify:**

- Can clone repo, install deps, build, and run `pnpm @jobs start:notify` successfully
- README explains how to add new users/subscriptions
- Data format is clear and documented

**Notes:**

- Use realistic but fake data for testing
- Include both game-day and non-game-day examples in celtics.json
- Document the 15-minute cron interval
- Keep docs minimal but complete for MVP
