---
id: "01"
title: Domain models and schemas
description: Implement User, Subscription, Event, and Topic data models with Effect Schema validation
status: TODO
priority: P0
prereqs:
  - 00-workspace-scaffold.md
---

**Acceptance:**

- [ ] `User` type with Effect Schema: `{ id, email, timezone }`
- [ ] `FixedSchedule` and `RelativeSchedule` discriminated union with Schema
- [ ] `Subscription` type: `{ id, userId, topicId, schedule, enabled, lastSentAt }`
- [ ] `SportsEvent` type: `{ id, startUtc, opponent }`
- [ ] `TopicData` type: wrapper for events array
- [ ] Validation for `sendAtSecondsLocal` (0-86399, 15-min aligned)
- [ ] Validation for `timeOffsetSeconds` (<= 0 for before-event only)

**Verify:**

- Schema decoders work correctly for valid JSON
- Invalid data fails with clear error messages

**Notes:**

- Store schemas in `packages/core/src/modules/<domain>/` (e.g., `modules/users/`, `modules/subscriptions/`)
- Use Effect's `Schema` module for runtime validation
- Follow discriminated union pattern for `FixedSchedule | RelativeSchedule`
- Reference Effect guides in `.reference/effect/` for Schema patterns
- Focus on MVP requirements but keep extensible
