---
id: "05"
title: Notify command
description: Implement pnpm notify CLI command that orchestrates the notification job
status: TODO
priority: P0
prereqs:
  - 02-database-service.md
  - 03-checker-service.md
  - 04-notification-service.md
---

**Acceptance:**

- [ ] `notify` script in `packages/scripts/` runnable via `pnpm notify`
- [ ] Orchestration flow:
  1. Load all subscriptions
  2. Filter to enabled subscriptions only
  3. For each: check if due using time utilities
  4. Skip if `alreadySentToday` guard triggers
  5. Call checker to get matching events
  6. If events found, send notification
  7. On success, update `lastSentAt`
- [ ] Proper error handling and logging
- [ ] Exit code 0 on success, non-zero on failure

**Verify:**

- Running `pnpm notify` executes full flow
- Due subscriptions get notifications
- Non-due subscriptions are skipped
- `lastSentAt` updated only on successful send

**Notes:**

- Place in `packages/scripts/src/notify.ts`
- Use Effect's runtime to run the program
- Log each step (info level)
- Errors should be loud but not crash the whole job
- This is the entry point for cron (every 15 minutes)
