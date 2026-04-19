---
id: "08"
title: Redis-backed persistence layer
description: Replace filesystem JSON persistence with Redis while keeping the Database service contract unchanged
status: WIP
priority: P0
prereqs:
  - 02-json-data-access.md
  - 05-notify-command.md
---

**Acceptance:**

- [ ] Superseded by `15-sqlite-migration-with-drizzle.md`; keep this item as historical context only.

- [ ] `Database` service API remains compatible for existing callers (`loadUsers`, `loadSubscriptions`, `loadTopic`, `updateSubscription`)
- [ ] Redis-backed KeyValueStore implementation is added under `packages/core/src/modules/kvs/` and can be composed into `Database.Default`
- [ ] Data layout in Redis preserves the current filesystem shape:
- users payload mirrors `packages/core/data/users.json`
- subscriptions payload mirrors `packages/core/data/subscriptions.json`
- topics use `topics/<topicId>` keys (no slug in the key)
- [ ] `loadTopic(topicId)` resolves via exact key lookup (`topics/<topicId>`)
- [ ] Existing tagged error surface is preserved and mapped for Redis operations (`DataFileNotFound`, `DataReadError`, `DataValidationError`, `DataWriteError`)
- [ ] Redis configuration is loaded with Effect Config (minimum: connection URL and optional key prefix)
- [ ] Tests cover database behavior using KeyValueStore-backed implementations

**Verify:**

- [ ] Run local Redis with persistence enabled and import seed data
- [ ] `pnpm test` passes
- [ ] `pnpm typecheck`, `pnpm lint`, and `pnpm format` pass
- [ ] `pnpm @jobs start:notify -- --dry-run` works with a provided KeyValueStore layer

**Notes:**

- Keep schema encode/decode behavior identical to the filesystem implementation so call sites do not change.
- Use a namespace prefix for keys (for example `dtpt:`) to avoid collisions in shared Redis instances.
- Document recommended Redis durability settings for this service (`appendonly yes`, `appendfsync everysec`) and expected trade-offs.
- Keep backend-specific code isolated so a future Effect KV backend swap is localized.
- Out of scope: changing notification business logic, schedule semantics, or domain schema shapes.
- Implementation uses `@effect/platform/KeyValueStore` as the single database dependency; backend selection now happens at the job layer.
- Runtime backend selection and seed migration command are deferred to a follow-up issue.
- Redis and filesystem keys intentionally omit `.json` (`users`, `subscriptions`, `topics/<topicId>`).
