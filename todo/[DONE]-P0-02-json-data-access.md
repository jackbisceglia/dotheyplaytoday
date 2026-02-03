---
id: "02"
title: JSON data access layer
description: Implement JSON file loading and validation for users, subscriptions, and topic data
status: WIP
priority: P0
prereqs:
  - 01-domain-models-and-schemas.md
---

**Acceptance:**

- [ ] Data directory structure: `packages/core/data/users.json`, `packages/core/data/subscriptions.json`, `packages/core/data/topics/{topicId}.json`
- [ ] `Database` service (Effect.Service) with methods:
  - `loadUsers(): Effect<User[]>`
  - `loadSubscriptions(): Effect<Subscription[]>`
  - `loadTopic(topicId: string): Effect<TopicData>`
  - `updateSubscription(subscription: Subscription): Effect<void>`
- [ ] Proper error handling for missing/invalid files
- [ ] Schema validation at load time with meaningful error messages
- [ ] Support for saving/updating subscriptions (for `lastSentAt` updates)

**Verify:**

- Can load sample JSON files and parse into validated domain types
- Invalid JSON produces clear error path
- Missing topic files return error (topic should exist if subscribed)

**Notes:**

- Data files in `packages/core/data/` (outside src, temp persistence)
- Service in `packages/core/src/modules/database/`
- Use Effect's file system utilities (@effect/platform)
- Define `DataError` tagged error type for domain-specific failures
- Simple file overwrite is fine for MVP (no atomic writes needed)
- Investigate Effect native solutions: KeyValueStore, FileSystem, or other platform modules for easier implementation
- Focus on MVP but keep extensible for future relational DB migration
