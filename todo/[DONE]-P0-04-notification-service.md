---
id: "04"
title: Notification service
description: Implement email notification delivery using Resend
status: DONE
priority: P0
prereqs:
  - 01-domain-models-and-schemas.md
---

**Acceptance:**

- [x] `Notifier` service (Effect.Service) with method `send(user, events): Effect<void>` (non-empty events)
- [x] Integrate with Resend API for email delivery
- [x] Email content includes opponent name(s) and local tipoff time(s)
- [x] No email sent if events array is empty (caller ensures this, but service should guard)
- [x] Failed sends return error (don't update `lastSentAt` - handled by caller)

**Verify:**

- `pnpm test` passes (`notification-service.test.ts` + `notification-resend-provider.test.ts` cover rendering, empty guard, and failures)
- `pnpm format` passes
- `pnpm lint` passes
- `pnpm typecheck` passes

**Notes:**

- Implemented in `packages/core/src/modules/notifiers/` with provider split under `providers/`
- Added generic provider contract (`NotifierMessage`) and explicit Resend provider layer (`ResendProvider`)
- Resend uses official SDK wrapped in Effect service (`ResendClientService`) with fail-fast config
- Config now requires `RESEND_API_KEY` and `RESEND_FROM_EMAIL`
- Added light retry/backoff for transient failures (network + 429 + 5xx/application errors)
