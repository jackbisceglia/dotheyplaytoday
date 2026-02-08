---
id: "03"
title: Checker service with time utilities
description: Implement event checker that evaluates subscriptions including timezone conversion, due checks, and event matching
status: DONE
priority: P0
prereqs:
  - 02-json-data-access.md
---

**Acceptance:**

**Time utilities (part of subscriptions module):**

- [x] `sendAtSecondsLocal` to UTC conversion using user's IANA timezone
- [x] DST-aware conversion (compute at runtime, not cached)
- [x] `isDue({ subscription, user, now })` check with ±60s tolerance window
- [x] `isAlreadySentToday({ lastSentAt, tz, now })` guard using user's local date
- [x] Get user's current local date from UTC timestamp + timezone

**Checker service:**

- [x] `Checker` service (Effect.Service) with method `check(opts): Effect<Option<SportsEvent[]>>`
- [x] Load events from `data/topics/*{topicId}.json`
- [x] Match events where `startUtc` falls on user's local date (target date)
- [x] Return `Option.none()` if no events, `Option.some(events)` if matches found
- [x] For daily notifications, multiple games return all events (caller aggregates into single email)

**Verify:**

- Time conversion handles DST transitions correctly
- Due check returns true within ±60s window, false outside
- `isAlreadySentToday` correctly compares user's local dates
- Returns events matching target date in user's timezone
- Returns none for dates with no events
- Correctly handles games spanning midnight

**Notes:**

- Place in `packages/core/src/modules/subscriptions/`
- The checker + time utils together evaluate "should this subscription trigger now?"
- Context input: `{ user: User, subscription: Subscription, targetDate: LocalDate }`
- Uses `Database` service to load topic data
- Uses Effect `DateTime` and `Duration` utilities for timezone and tolerance logic
- If orchestration logic grows (multiple callers), extract a scheduler module later
- Focus on MVP but keep extensible for future relative-to-event checking
