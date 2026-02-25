---
id: "07"
title: Sports event home or away context
description: Add required event site context and narrow sports events to home or away for notification phrasing
status: TODO
priority: P0
prereqs:
  - 01-domain-models-and-schemas.md
  - 04-notification-service.md
---

**Acceptance:**

- [ ] `EventBase` includes required `site` field for all events
- [ ] `SportsEvent` narrows `site` to `"home" | "away"`
- [ ] Non-sports event types can use free-text site labels (for example, `"Las Vegas"`)
- [ ] Topic event JSON validation requires site for sports events
- [ ] Notification rendering conveys home/away context:
  - home uses `vs.`
  - away uses `at`
- [ ] Subject/body formatting remains readable for both single-game and multi-game notifications
- [ ] Existing tests and fixtures that decode `SportsEvent` are updated with site values

**Verify:**

- `pnpm test -- packages/core/src/tests/domain-models.test.ts`
- `pnpm test -- packages/core/src/tests/notification-service.test.ts`
- `pnpm test -- packages/core/src/tests/subscriptions.test.ts`
- `pnpm test -- packages/scripts/src/tests/notify.test.ts`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm format`

**Notes:**

- Model this as event-level `site` context in `EventBase`, then override at `SportsEvent` for stronger validation
- Prefer explicit string literals over a boolean (clearer payloads and easier future extension)
- Include a same-PR data update for `packages/core/data/topics/*.json` so schema decoding does not break
- For away games, avoid awkward wording like `at <opponent> at <time>` in body copy
- Keep venue/arena metadata out of scope for this item (no new `venue` object yet)
- If neutral-site games become a requirement, extend the union with `neutral` in a follow-up item
