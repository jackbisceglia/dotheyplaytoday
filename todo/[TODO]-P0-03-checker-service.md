---
id: "03"
title: Checker service with time utilities
description: Implement event checker that evaluates subscriptions including timezone conversion, due checks, and event matching
status: TODO
priority: P0
prereqs:
  - 02-json-data-access.md
---

**Acceptance:**

**Time utilities (part of subscriptions module):**

- [ ] `sendAtSecondsLocal` to UTC conversion using user's IANA timezone
- [ ] DST-aware conversion (compute at runtime, not cached)
- [ ] `isDue(subscription, user, now)` check with ±60s tolerance window
- [ ] `alreadySentToday(lastSentAt, user.timezone, now)` guard using user's local date
- [ ] Get user's current local date from UTC timestamp + timezone

**Checker service:**

- [ ] `Checker` service (Effect.Service) with method `check(context): Effect<Option<SportsEvent[]>>`
- [ ] Load events from `data/topics/{topicId}.json`
- [ ] Match events where `startUtc` falls on user's local date (target date)
- [ ] Return `Option.none()` if no events, `Option.some(events)` if matches found
- [ ] For daily notifications, multiple games return all events (caller aggregates into single email)

**Verify:**

- Time conversion handles DST transitions correctly
- Due check returns true within ±60s window, false outside
- `alreadySentToday` correctly compares user's local dates
- Returns events matching target date in user's timezone
- Returns none for dates with no events
- Correctly handles games spanning midnight

**Notes:**

- Place in `packages/core/src/modules/subscriptions/`
- The checker + time utils together evaluate "should this subscription trigger now?"
- Context input: `{ user: User, subscription: Subscription, targetDate: LocalDate }`
- Uses `JsonStorage` service to load topic data
- Use Temporal API or solid tz library (e.g., `date-fns-tz`, `luxon`)
- If orchestration logic grows (multiple callers), extract a scheduler module later
- Focus on MVP but keep extensible for future relative-to-event checking
