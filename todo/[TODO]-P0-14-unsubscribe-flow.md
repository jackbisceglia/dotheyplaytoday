---
id: "14"
title: Unsubscribe flow
description: Add signed unsubscribe links and end-to-end unsubscribe handling across the email, api, and web layers
status: TODO
priority: P0
prereqs:
  - 10-email-alert-redesign-after-channel-split.md
  - 11-web-and-api-scaffold.md
  - 12-public-signup-server-mvp.md
---

**Acceptance:**

- [ ] Add a core unsubscribe-token service that signs and validates unsubscribe tokens without exposing raw user identifiers in public links.
- [ ] Define unsubscribe scope as global email unsubscribe for the user, not per-team unsubscribe.
- [ ] Add an api endpoint that validates the token, resolves the user, removes all subscriptions for that user, and remains idempotent across repeated calls.
- [ ] Add a public web route that consumes the unsubscribe token and renders a clear terminal success or failure state.
- [ ] Update email rendering so unsubscribe links appear in both plain-text and html output.
- [ ] Replace the current hardcoded domain-only footer logic with an env-aware public web url suitable for local and production unsubscribe links.
- [ ] Keep user records after unsubscribe; only subscription rows are removed.
- [ ] Ensure unsubscribe execution does not leak whether a user exists beyond the generic route result.

**Verify:**

- [ ] Add tests for token sign and verify behavior, invalid token rejection, and idempotent `removeAllByUserId` unsubscribe execution.
- [ ] Add notifier rendering tests that assert unsubscribe links are present in both text and html email output.
- [ ] Manually verify clicking an unsubscribe link removes the user's subscriptions and shows the expected confirmation page.
- [ ] `pnpm typecheck`
- [ ] `pnpm lint`
- [ ] `pnpm format`

**Notes:**

- Keep unsubscribe delete-based to match user intent; this work should not introduce a soft-disable preference model.
- This item depends on the current email rendering shape in `packages/core/src/modules/notifier/email/index.ts` and should extend that layer rather than pushing formatting concerns into provider implementations.
- Preserve safe repeated-click behavior so old emails and duplicate requests do not cause noisy failures.
