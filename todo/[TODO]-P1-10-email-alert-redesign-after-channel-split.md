---
id: "10"
title: Email alert redesign after channel split
description: Preserve the interim minimal email UI improvements, then reimplement them on top of the channel-first notifier architecture
status: TODO
priority: P1
prereqs:
  - 09-channel-first-notifier-architecture.md
---

**Acceptance:**

- [ ] Reimplement the current minimal email redesign on top of `P1-09` channel architecture (not directly inside transport providers).
- [ ] Introduce email-channel rendering boundaries where `EmailNotifier` owns subject/text/html formatting.
- [ ] Ensure `EmailTransport` implementations (for example Resend) only send already-rendered payload and do not own formatting.
- [ ] Preserve the current single-game-first UX where single-game is the focal path and multi-game is a compact fallback (`Also today`).
- [ ] Keep multipart output (`text` + `html`) with plain-text parity for compatibility and accessibility.
- [ ] Keep HTML minimal and widely compatible (table-based structure + inline styles, no JS, no external assets).
- [ ] Keep dynamic value escaping in HTML output to prevent injection.
- [ ] Ensure top-level `Notifier` orchestration remains channel-agnostic and does not know email HTML details.
- [ ] Add regression tests so subject/text/html output and transport mapping remain stable.

**Verify:**

- [ ] `pnpm test -- packages/core/src/tests/notification-service.test.ts`
- [ ] Add and run `EmailNotifier` rendering tests (single game, multi-game fallback, escaping).
- [ ] Add and run `EmailTransport` contract tests (rendered payload passthrough).
- [ ] `pnpm test -- packages/core/src/tests/notification-resend-provider.test.ts`
- [ ] `pnpm @jobs start:notify -- --dry-run` verifies expected subject/text/html path.
- [ ] `pnpm typecheck`
- [ ] `pnpm lint`
- [ ] `pnpm format`

**Notes:**

- This item intentionally supersedes interim placement of formatting logic in provider code from the current branch state.
- Interim implementation snapshot (parity reference):
- `packages/core/src/modules/notifier/format.ts`
- `packages/core/src/modules/notifier/providers/service.ts`
- `packages/core/src/modules/notifier/service.ts`
- `packages/core/src/modules/notifier/providers/resend/service.ts`
- `packages/core/src/tests/notification-service.test.ts`
- `packages/core/src/tests/notification-resend-provider.test.ts`
- Target shape after `P1-09`:
- Caller selects notifier layer (`email` or `sms`) at composition time.
- Email-backed `Notifier` renders channel-specific content.
- `EmailTransport` (Resend/SES) delivers rendered payload.
- Keep scope focused on architecture-correct placement and parity with current minimal design. Avoid additional visual expansion in this task.
