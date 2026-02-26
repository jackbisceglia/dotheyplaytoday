---
id: "07"
title: Sports event home or away context
description: Add required event site context and narrow sports events to home or away for notification phrasing
status: DONE
priority: P0
prereqs:
  - 01-domain-models-and-schemas.md
  - 04-notification-service.md
---

**Acceptance:**

- [x] `EventBase` includes required `site` field for all events
- [x] `SportsEvent` narrows `site` to `"home" | "away"`
- [x] Non-sports event types can use free-text site labels (for example, `"Las Vegas"`)
- [x] Topic event JSON validation requires site for sports events
- [x] Notification rendering conveys home/away context:
  - home uses `vs.`
  - away uses `@`
- [x] Subject/body formatting remains readable for both single-game and multi-game notifications
- [x] Existing tests and fixtures that decode `SportsEvent` are updated with site values

**Verify:**

- `pnpm test -- packages/core/src/tests/domain-models.test.ts`
- `pnpm test -- packages/core/src/tests/notification-service.test.ts`
- `pnpm test -- packages/core/src/tests/subscriptions.test.ts`
- `pnpm test -- packages/jobs/src/notify/index.test.ts`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm format`

**Notes:**

- Model this as event-level `site` context in `EventBase`, then override at `SportsEvent` for stronger validation
- Prefer explicit string literals over a boolean (clearer payloads and easier future extension)
- Include a same-PR data update for `packages/core/data/topics/*.json` so schema decoding does not break
- User-facing away phrasing uses `@`; body list lines use comma-time formatting for readability
- Keep venue/arena metadata out of scope for this item (no new `venue` object yet)
- If neutral-site games become a requirement, extend the union with `neutral` in a follow-up item
