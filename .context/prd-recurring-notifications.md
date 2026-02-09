# PRD: Recurring Notification Service

**Date:** 2026-01-24
**Last Updated:** 2026-01-24

---

## Problem Statement

### What problem are we solving?

There is no generic, configurable way to notify users about recurring, domain-specific events. The current concept is limited to a single Celtics check, but the intended product is a reusable notification engine that can support any domain logic and schedule.

### Why now?

The foundational scheduling and notification architecture must be established before adding more teams, users, or notification types. Defining a consistent data model and trigger semantics now prevents ad-hoc logic and rework later.

### Who is affected?

- **Primary users:** The first end user (you) receiving Celtics game-day notifications.
- **Secondary users:** Future users with different teams or notification preferences.

---

## Proposed Solution

### Overview

Create a small notification engine that evaluates user subscriptions on a recurring schedule, runs `Subscriptions.check`, and sends an email when matching events are found. The MVP uses JSON-backed data sources and supports a future extension where notifications can be relative to event times (e.g., 30 minutes before tipoff).

### Core Concepts

- **Topic:** An event source identified by `topicId` (e.g., "celtics"). Maps to a JSON file containing events.
- **Event:** Something that happens at a specific time (game, match, etc.). Stored with UTC timestamps.
- **Subscription:** A user's request to be notified about events from a topic at a specific time.
- **Subscription check:** Generic logic (`Subscriptions.check`) that loads events from a topic and determines if any match the target date.

### User Experience

The user receives an email only on Celtics game days, delivered at the configured time in the user's local timezone.

#### User Flow: Celtics Daily Check

1. User has a subscription configured for a daily send time (10:00 AM local time).
2. Scheduler runs every 15 minutes and evaluates due subscriptions.
3. `Subscriptions.check` loads the Celtics schedule and determines if there is a game on the user's local date.
4. Email is sent only if there is a game; no email is sent otherwise.

---

## End State

When this PRD is complete, the following will be true:

- [ ] Users, subscriptions, and event schedules can be loaded from JSON-backed storage.
- [ ] Subscriptions define a recurring send time using a discriminated union schedule type.
- [ ] Scheduler runs on a 15-minute interval and evaluates due subscriptions with ±60s tolerance.
- [ ] `Subscriptions.check` sends emails only on game days, using schedule data from JSON.
- [ ] Documentation and basic run instructions exist.

---

## Success Metrics

### Quantitative

| Metric                       | Current | Target | Measurement Method        |
| ---------------------------- | ------- | ------ | ------------------------- |
| Game-day email delivery rate | 0%      | 100%   | Manual spot checks + logs |
| Duplicate sends per day      | N/A     | 0      | Manual verification       |

### Qualitative

- Users consistently receive game-day emails at the correct local time.
- The data model accommodates future relative-to-event notifications without schema changes.

---

## Acceptance Criteria

### Feature: Subscription Scheduling

- [ ] Subscriptions use a discriminated union for schedule: `{ type: 'fixed', sendAtSecondsLocal }` or `{ type: 'relative', timeOffsetSeconds }`.
- [ ] `sendAtSecondsLocal` represents seconds since midnight in the user's local timezone (0–86399).
- [ ] `sendAtSecondsLocal` must align to 15-minute intervals (0, 900, 1800, ..., 85500).
- [ ] `timeOffsetSeconds` must be <= 0 (before-event offsets only).
- [ ] Fixed and relative schedules are mutually exclusive (enforced by discriminated union).
- [ ] User timezone is stored on the user record (IANA format, e.g., "America/New_York").
- [ ] Schedule evaluation converts `sendAtSecondsLocal` to UTC at runtime using user's timezone (handles DST).
- [ ] Tolerance window is ±60 seconds around the computed UTC send time.
- [ ] `lastSentAt` timestamp prevents duplicate sends on the same user-local date.

### Feature: Subscription Check

- [ ] `Subscriptions.check` loads events from JSON file by `topicId`.
- [ ] Events are stored with UTC timestamps (ISO 8601 format).
- [ ] `Subscriptions.check` determines target date using user's local timezone at evaluation time.
- [ ] `Subscriptions.check` returns `Option<Event[]>` — matching events or none.
- [ ] For daily notifications, multiple games on same day result in a single email.

### Feature: Notification Delivery

- [ ] Notification delivery uses a single email channel (Resend).
- [ ] No email is sent on non-game days.
- [ ] Email content includes opponent and local tipoff time.
- [ ] Failed sends do not update `lastSentAt` (allows retry on next tick).

---

## Technical Context

### Existing Patterns

- `AGENTS.md` - Effect.Service module structure and conventions for future core modules.
- `packages/core/package.json` - Core package entry point for shared logic and services.
- `packages/scripts/package.json` - Script surface for running the notification job.

### Key Files

- `AGENTS.md` - Project structure and Effect.Service conventions.
- `packages/core/package.json` - Core service package configuration.
- `packages/scripts/package.json` - Script entry for `notify` command.

### System Dependencies

- Runtime: Bun
- Libraries: Effect, @effect/platform, @effect/platform-bun
- Email provider: Resend (initial)
- Data sources: JSON files for users, subscriptions, and event schedules
- Execution: External cron (every 15 minutes) invoking the `notify` script

### Data Model

#### User

```typescript
type User = {
  id: string;
  email: string;
  timezone: string; // IANA timezone, e.g., "America/New_York"
};
```

#### Subscription

```typescript
type FixedSchedule = {
  type: "fixed";
  sendAtSecondsLocal: number; // 0–86399, must align to 15-min intervals
};

type RelativeSchedule = {
  type: "relative";
  timeOffsetSeconds: number; // Must be <= 0 (before event)
};

type Schedule = FixedSchedule | RelativeSchedule;

type Subscription = {
  id: string;
  userId: string;
  topicId: string; // e.g., "celtics"
  schedule: Schedule;
  enabled: boolean;
  lastSentAt: string | null; // ISO 8601 timestamp
};
```

#### Event (Sports-specific)

```typescript
type SportsEvent = {
  id: string;
  startUtc: string; // ISO 8601, e.g., "2026-01-24T19:30:00Z"
  opponent: string;
  // Future: location, homeAway, etc.
};
```

#### Topic

```typescript
type Topic = {
  id: string;
  events: SportsEvent[];
};
```

#### Topic Data (JSON file structure)

```typescript
// File: data/topics/{topicId}.json
// `id` is derived from `{topicId}` when loading from storage.
type TopicFile = {
  events: SportsEvent[];
};
```

### Time Handling Strategy

| Data Type            | Storage Format                       | Reason                                   |
| -------------------- | ------------------------------------ | ---------------------------------------- |
| Event times          | UTC (ISO 8601)                       | Universal reference; no locale ambiguity |
| User send preference | Local seconds (`sendAtSecondsLocal`) | User intent; DST-adjusted at runtime     |
| User timezone        | IANA timezone string                 | Used for all conversions                 |
| `lastSentAt`         | UTC (ISO 8601)                       | Compared against user's local date       |

**Runtime conversion flow:**

1. Scheduler runs at some UTC instant
2. For each subscription with fixed schedule:
   - Compute: "What UTC time is `sendAtSecondsLocal` today in `user.timezone`?"
   - This computation automatically handles DST
3. Check if current UTC is within ±60s tolerance
4. If due, determine user's local date and check for matching events

---

## Risks & Mitigations

| Risk                                             | Likelihood | Impact | Mitigation                                                                       |
| ------------------------------------------------ | ---------- | ------ | -------------------------------------------------------------------------------- |
| Timezone conversion errors (DST, day boundaries) | Med        | High   | Store local time intent; compute UTC at runtime; use authoritative tz libraries. |
| Duplicate sends due to repeated cron ticks       | Low        | Med    | `lastSentAt` guard checks user's local date; ±60s tolerance prevents edge cases. |
| Schedule changes (game time moved)               | Med        | Med    | Always derive from current JSON rather than cached values.                       |

---

## Alternatives Considered

### Alternative 1: Store `nextRunAtUtc` cache

- **Description:** Persist next run time for each subscription and query due items by index.
- **Pros:** Efficient querying at scale.
- **Cons:** Derived state can become stale if source schedules change.
- **Decision:** Rejected for MVP; may be added later as an optimization.

### Alternative 2: Use cron strings per subscription

- **Description:** Store a cron string for each subscription instead of seconds-based schedule.
- **Pros:** Expressive recurrence rules.
- **Cons:** Hard to query; adds parser complexity for MVP.
- **Decision:** Rejected; use `sendAtSecondsLocal` to keep data model queryable.

### Alternative 3: Store `sendAtSecondsUtc` (pre-computed UTC)

- **Description:** Convert user's local time to UTC at write time and store UTC.
- **Pros:** No runtime conversion needed.
- **Cons:** Stale during DST transitions; user's perceived local time shifts.
- **Decision:** Rejected; store local intent and compute UTC at runtime.

### Alternative 4: Two nullable fields for schedule

- **Description:** Use `sendAtSecondsLocal: number | null` and `timeOffsetSeconds: number | null` instead of discriminated union.
- **Pros:** Simpler JSON structure.
- **Cons:** Invalid states representable; invariant must be enforced in code.
- **Decision:** Rejected; discriminated union prevents invalid states at type level.

---

## Non-Goals (v1)

- Multiple notification channels (SMS, push, WhatsApp).
- UI for managing subscriptions.
- Full audit trail of notifications.
- Week-of or monthly summary notifications.
- Positive `timeOffsetSeconds` (after-event notifications).
- Quiet hours / do-not-disturb windows.

---

## Interface Specifications

### CLI

```
pnpm notify

Description:
  Runs the notification evaluation job and sends any due notifications.
  Expected to be invoked by external cron every 15 minutes.
```

---

## Documentation Requirements

- [ ] README update for running the notification job locally.
- [ ] Short doc describing the JSON data format for users, subscriptions, and schedules.
- [ ] Notes on timezone handling assumptions and DST behavior.

---

## Resolved Questions

| Question                                                           | Resolution                                                                |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| What tolerance window should be used around send time?             | ±60 seconds (symmetric)                                                   |
| Should `timeOffsetSeconds` support positive offsets (after event)? | No; must be <= 0 (before-event only)                                      |
| How should DST be handled?                                         | Store local time intent; compute UTC at runtime using user's timezone     |
| What is the cron interval?                                         | 15 minutes; users select from 15-minute intervals                         |
| How are duplicate sends prevented?                                 | `lastSentAt` timestamp; skip if already sent on user's local date         |
| How are checks resolved by `topicId`?                              | `Subscriptions.check` loads events from `data/topics/{topicId}.json`      |
| What happens with multiple games on same day?                      | Single email for daily (fixed) notifications; separate for event-relative |

---

## Appendix

### Glossary

- **sendAtSecondsLocal:** Seconds since midnight in the user's local timezone representing the intended send time.
- **timeOffsetSeconds:** Seconds offset relative to an event's start time (must be <= 0, i.e., before event).
- **Topic:** An event source identified by `topicId`; maps to a JSON file containing events.
- **Subscription check:** `Subscriptions.check` logic that loads events from a topic and checks for matches against the target date.
- **Target date:** The user's local date at evaluation time, used to find matching events.

### Decision Log

| #   | Decision                                                                         |
| --- | -------------------------------------------------------------------------------- |
| 1   | Event times stored as UTC (ISO 8601)                                             |
| 2   | User preference stored as `sendAtSecondsLocal` (local time)                      |
| 3   | UTC computed at runtime using `user.timezone` — handles DST                      |
| 4   | Target date = user's local date at evaluation time                               |
| 5   | Cron interval = 15 minutes                                                       |
| 6   | Users select from 15-minute intervals                                            |
| 7   | Tolerance window = ±60 seconds (symmetric)                                       |
| 8   | Duplicate prevention via `lastSentAt` (user's local date comparison)             |
| 9   | `topicId` identifies event source                                                |
| 10  | Schedule = discriminated union (`fixed` \| `relative`)                           |
| 11  | Fixed/relative mutually exclusive (enforced by type)                             |
| 12  | `Subscriptions.check` loads events by `topicId`                                  |
| 13  | `Subscriptions.check` returns `Option<Event[]>`                                  |
| 14  | `Subscriptions.check` receives full context `{ user, subscription, targetDate }` |
| 15  | Event metadata = sports-specific with tag for future extension                   |
| 16  | Multiple games = single email for daily notifications                            |
| 17  | MVP = email only (Resend)                                                        |
| 18  | `lastSentAt` comparison uses user's local date                                   |
| 19  | Failed sends don't update `lastSentAt`                                           |
| 20  | `timeOffsetSeconds` modeled for event-relative (not implemented in MVP)          |
| 21  | Event-relative notifications send at any hour (no quiet hours)                   |
| 22  | `timeOffsetSeconds` must be <= 0 (before event only)                             |

### References

- `AGENTS.md` - Project conventions and Effect.Service guidance.
