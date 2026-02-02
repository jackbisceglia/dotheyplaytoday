---
id: "04"
title: Notification service
description: Implement email notification delivery using Resend
status: TODO
priority: P0
prereqs:
  - 01-domain-models-and-schemas.md
---

**Acceptance:**

- [ ] `Notification` service (Effect.Service) with method `send(user, events): Effect<void>`
- [ ] Integrate with Resend API for email delivery
- [ ] Email content includes opponent name(s) and local tipoff time(s)
- [ ] No email sent if events array is empty (caller ensures this, but service should guard)
- [ ] Failed sends return error (don't update `lastSentAt` - handled by caller)

**Verify:**

- Successfully sends email with correct content
- Failed API calls produce proper error
- Email template renders correctly

**Notes:**

- Place in `packages/core/src/modules/notifications/`
- Email template: plain text for MVP, handle single/multiple games
- Use Resend SDK or raw fetch with Effect
- Config: Resend API key from environment
- Focus on MVP but keep extensible for future channels
