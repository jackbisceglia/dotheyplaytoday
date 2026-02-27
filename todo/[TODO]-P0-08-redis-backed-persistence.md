---
id: "08"
title: Redis-backed persistence layer
description: Replace filesystem JSON persistence with Redis while keeping the Database service contract unchanged
status: TODO
priority: P0
prereqs:
  - 02-json-data-access.md
  - 05-notify-command.md
---

**Acceptance:**

- [ ] `Database` service API remains compatible for existing callers (`loadUsers`, `loadSubscriptions`, `loadTopic`, `updateSubscription`)
- [ ] Redis-backed implementation is added under `packages/core/src/modules/database/` and wired through `Database.Default`
- [ ] Data layout in Redis preserves the current filesystem shape:
  - users payload mirrors `packages/core/data/users.json`
  - subscriptions payload mirrors `packages/core/data/subscriptions.json`
  - topics preserve `topics/<topicId>-<slug>.json` semantics for lookup by topic id
- [ ] `loadTopic(topicId)` keeps current prefix-match behavior (`<topicId>-*.json`) when resolving topic data
- [ ] Existing tagged error surface is preserved and mapped for Redis operations (`DataFileNotFound`, `DataReadError`, `DataValidationError`, `DataWriteError`)
- [ ] Redis configuration is loaded with Effect Config (minimum: connection URL and optional key prefix)
- [ ] A one-time migration path is documented for importing current filesystem seed data into Redis
- [ ] Tests cover database behavior and notify orchestration using the Redis-backed layer

**Verify:**

- [ ] Run local Redis with persistence enabled and import seed data
- [ ] `pnpm test` passes, including notify orchestration tests
- [ ] `pnpm typecheck`, `pnpm lint`, and `pnpm format` pass
- [ ] `pnpm @jobs start:notify -- --dry-run` reads from Redis and logs expected processing flow
- [ ] Non-dry run writes `lastSentAt` to Redis and data survives Redis restart

**Notes:**

- Keep schema encode/decode behavior identical to the filesystem implementation so call sites do not change.
- Use a namespace prefix for keys (for example `dtpt:`) to avoid collisions in shared Redis instances.
- Document recommended Redis durability settings for this service (`appendonly yes`, `appendfsync everysec`) and expected trade-offs.
- Keep backend-specific code isolated so a future Effect KV backend swap is localized.
- Out of scope: changing notification business logic, schedule semantics, or domain schema shapes.
- Implementation uses `@effect/platform/KeyValueStore` as the single database dependency; backend selection now happens at the job layer.
- Runtime backend selection supports `NODE_ENV`, `DATABASE_BACKEND`, and CLI overrides (`--database-backend=`, `--use-redis`, `--use-filesystem`).
- Redis and filesystem keys intentionally omit `.json` (`users`, `subscriptions`, `topics/<topicId>-<slug>`).
- Topic lookup by id is implemented with a `topics/index` key that maps `topicId` to the stored topic key.
- Seed import command is `pnpm @jobs start:migrate -- --use-redis` (or `--use-filesystem` for local KV filesystem bootstrapping).
