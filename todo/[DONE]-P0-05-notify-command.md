---
id: "05"
title: Notify command
description: Implement notify CLI command that orchestrates the notification job
status: DONE
priority: P0
prereqs:
  - 02-database-service.md
  - 03-checker-service.md
  - 04-notification-service.md
---

**Acceptance:**

- [x] `start:notify` script in `packages/jobs/` runnable via `pnpm @jobs start:notify`
- [x] Orchestration flow:
  1. Load all subscriptions
  2. Filter to enabled subscriptions only
  3. For each: check if due using time utilities
  4. Skip if `alreadySentToday` guard triggers
  5. Call `Subscriptions.check` to get matching events
  6. If events found, send notification
  7. On success, update `lastSentAt`
- [x] Proper error handling and logging
- [x] Exit code 0 on success, non-zero on failure

**Verify:**

- `pnpm @jobs start:notify -- --dry-run` runs end-to-end without Resend credentials and exits successfully
- `pnpm test -- packages/jobs/src/notify/index.test.ts` passes orchestration coverage (due/send/update, skip paths, dry-run, notifier failure continue, fatal abort)
- `pnpm typecheck`, `pnpm lint`, and `pnpm format` pass for the full repo

**Notes:**

- Implemented in `packages/jobs/src/notify/index.ts` with `runNotifyJob` orchestration + `--dry-run` CLI parsing
- Added `packages/jobs/src/notify/index.test.ts` with 8 orchestration tests
- Relative schedules are explicitly skipped and logged for MVP
- Notifier transport failures are logged and processing continues; integrity/dependency failures abort the run
- Updated `packages/core/src/modules/database/service.ts` to resolve `data/` relative to module location so `pnpm @jobs start:notify` works when executed from `packages/jobs`
