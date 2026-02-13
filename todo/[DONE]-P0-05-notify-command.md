---
id: "05"
title: Notify command
description: Implement pnpm notify CLI command that orchestrates the notification job
status: DONE
priority: P0
prereqs:
  - 02-database-service.md
  - 03-checker-service.md
  - 04-notification-service.md
---

**Acceptance:**

- [x] `notify` script in `packages/scripts/` runnable via `pnpm notify`
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

- `pnpm notify -- --dry-run` runs end-to-end without Resend credentials and exits successfully
- `pnpm test -- packages/scripts/src/tests/notify.test.ts` passes orchestration coverage (due/send/update, skip paths, dry-run, notifier failure continue, fatal abort)
- `pnpm typecheck`, `pnpm lint`, and `pnpm format` pass for the full repo

**Notes:**

- Implemented in `packages/scripts/src/index.ts` with `runNotifyJob` orchestration + `--dry-run` CLI parsing
- Added `packages/scripts/src/tests/notify.test.ts` with 8 orchestration tests
- Relative schedules are explicitly skipped and logged for MVP
- Notifier transport failures are logged and processing continues; integrity/dependency failures abort the run
- Updated `packages/core/src/modules/database/service.ts` to resolve `data/` relative to module location so `pnpm notify` works when executed from `packages/scripts`
