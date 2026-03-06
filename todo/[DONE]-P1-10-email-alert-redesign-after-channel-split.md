---
id: "10"
title: Email alert redesign after channel split
description: Preserve the interim minimal email UI improvements, then reimplement them on top of the channel-first notifier architecture
status: DONE
priority: P1
prereqs:
  - 09-channel-first-notifier-architecture.md
---

**Acceptance:**

- [x] Reimplement the current minimal email redesign on top of `P1-09` channel architecture (not directly inside provider layers).
- [x] Introduce email-channel rendering boundaries where `NotifierLayerEmail` owns subject/text/html formatting.
- [x] Ensure `EmailProvider` implementations (for example Resend) only send already-rendered payload and do not own formatting.
- [x] Preserve the current single-game-first UX where single-game is the focal path and multi-game is a compact fallback (`Also today`).
- [x] Keep multipart output (`text` + `html`) with plain-text parity for compatibility and accessibility.
- [x] Keep HTML minimal and widely compatible (table-based structure + inline styles, no JS, no external assets).
- [x] Keep dynamic value escaping in HTML output to prevent injection.
- [x] Ensure top-level `Notifier` orchestration remains channel-agnostic and does not know email HTML details.
- [x] Add regression tests so subject/text/html output and provider payload mapping remain stable.

**Verify:**

- [x] `pnpm exec vitest run packages/core/src/tests/notification-service.test.ts`
- [x] Added and ran `NotifierLayerEmail` rendering tests (single game, multi-game fallback, escaping).
- [x] Added and ran `EmailProvider` contract tests (rendered payload passthrough).
- [x] `pnpm exec vitest run packages/core/src/tests/notification-resend-provider.test.ts`
- [x] `pnpm @jobs start:notify --dry-run` verifies expected subject/text/html path.
- [x] `pnpm typecheck`
- [x] `pnpm lint`
- [x] `pnpm format`

**Notes:**

- This item intentionally supersedes interim placement of formatting logic in provider code from the current branch state.
- Interim implementation snapshot (parity reference):
- `packages/core/src/modules/notifier/email/format.ts`
- `packages/core/src/modules/notifier/email/index.ts`
- `packages/core/src/modules/notifier/email/providers.ts`
- `packages/core/src/modules/notifier/email/resend/index.ts`
- `packages/core/src/tests/notification-service.test.ts`
- `packages/core/src/tests/notification-resend-provider.test.ts`
- Target shape after `P1-09`:
- Caller selects notifier layer (`email` or `sms`) at composition time.
- Email-backed `Notifier` renders channel-specific content.
- `EmailProvider` (Resend/SES) delivers rendered payload.
- Landed implementation now keeps the email rendering logic directly in `packages/core/src/modules/notifier/email/index.ts`, with only local helpers for readability.
- `EmailMessage` supports multipart output while keeping `html` optional at the provider boundary; `NotifierLayerEmail` currently sends both `text` and `html`, and `EmailProviderLayerResend` only forwards `html` when present.
- Final visual direction is intentionally minimal and quick to scan: matchup first, local time second, and a compact `Also today` list only when needed.
