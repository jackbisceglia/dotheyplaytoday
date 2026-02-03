---
id: "01"
title: Domain models and schemas
description: Implement User, Subscription, Event, and Topic data models with Effect Schema validation
status: DONE
priority: P0
prereqs:
  - 00-workspace-scaffold.md
---

**Acceptance:**

- [x] `User` type with Effect Schema: `{ id, email, timezone }`
- [x] `FixedSchedule` and `RelativeSchedule` discriminated union with Schema
- [x] `Subscription` type: `{ id, userId, topicId, schedule, enabled, lastSentAt }`
- [x] `SportsEvent` type: `{ id, startUtc, opponent }`
- [x] `TopicData` type: wrapper for events array
- [x] Validation for `sendAtSecondsLocal` (0-86399, 15-min aligned)
- [x] Validation for `timeOffsetSeconds` (<= 0 for before-event only)

**Verify:**

- Schema decoders work correctly for valid JSON (tests in `packages/core/src/tests/domain-models.test.ts`)
- Invalid data fails with clear error messages (Schema refinements + failure test)

**Verification:**

- `pnpm format`
- `pnpm lint`
- `pnpm typecheck`

**Notes:**

- Store schemas in `packages/core/src/modules/<domain>/` (e.g., `modules/users/`, `modules/subscriptions/`)
- Use Effect's `Schema` module for runtime validation
- Follow discriminated union pattern for `FixedSchedule | RelativeSchedule`
- Reference Effect guides in `reference/effect/` for Schema patterns
- Focus on MVP requirements but keep extensible
