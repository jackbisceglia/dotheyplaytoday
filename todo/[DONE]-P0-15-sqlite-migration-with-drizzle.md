---
id: "15"
title: SQLite migration with Drizzle + Effect SQL
description: Replace KVS-backed persistence with SQLite using Drizzle ORM while preserving current job behavior and CLI ergonomics
status: DONE
priority: P0
prereqs:
  - 02-json-data-access.md
  - 05-notify-command.md
---

**Acceptance:**

- [x] Persistence is SQLite-backed (no KVS dependency required for runtime job paths, including `notify`).
- [x] Transitional `DatabaseOld` compatibility is removed; surfaces call entity services and module services query SQLite directly.
- [x] New north-star persistence layer is `database` (Effect SQL + Drizzle composition, planar-style), which future entity services build on.
- [x] Database wiring is layered via Effect and uses config-driven connection selection (local/prod), not separate persistence implementations.
- [x] Drizzle schema + migration files are introduced and runnable in local dev.
- [x] Runtime uses Effect SQL SQLite client + Effect Drizzle integration.
- [x] Topic storage approach is explicitly chosen and documented (including trade-offs).
- [x] Persistence validation schemas are generated from Drizzle table defs via `drizzle-orm/effect-schema` (single source of truth; no duplicate row schema definitions).
- [x] `notify` continues to work with equivalent behavior/logging.
- [x] `tools inspect` is retired from this path (Drizzle/SQL tooling becomes the inspection/debug path).
- [x] CLI selection is moved to `--sqlite` with (`local` | `remote`) semantics.

**Verify:**

- [x] `pnpm typecheck`
- [x] `pnpm lint`
- [x] `pnpm format`
- [ ] `pnpm test`
- [ ] `pnpm @jobs start:notify -- --dry-run`
- [ ] Validate data with SQL tooling (for example Drizzle studio or targeted SQL query script)

**Decisions for V1:**

- Runtime database backend is always SQLite; environment differences are config only (URL/path, optional pragmas), not separate adapter implementations.
- Use Drizzle for schema and query authoring.
- Use Effect SQL + Effect Drizzle layers for dependency wiring and lifecycle.
- Keep domain APIs and caller behavior stable first; deeper domain refactors happen later.
- Back-compat service paths are not carried forward once entity services cover current callers.
- `tools inspect` is removed in this migration once SQLite runtime path is validated.

**Data model proposal:**

- `users`
  - `id` text primary key
  - `email` text not null unique
  - `timezone` text not null
- `subscriptions`
  - `id` text primary key
  - `user_id` text not null references `users(id)`
  - `topic_id` text not null
  - `schedule_type` text not null (`fixed` | `relative`)
  - `send_at_seconds_local` integer null
  - `time_offset_seconds` integer null
  - `enabled` integer/bool not null
  - `last_sent_at` text/timestamp null
  - check constraint to enforce schedule shape by `schedule_type`
  - index on (`user_id`), index on (`topic_id`)
- `topics`
  - `id` text primary key
  - `type` text not null (`sports` for current use)
  - `title` text not null (team name for sports)
- `topic_events`
  - `id` text primary key
  - `topic_id` text not null references `topics(id)`
  - `event_json` text/json not null (single event payload)
  - unique/index support on (`topic_id`, `id`)

SQLite note: SQLite supports JSON functions via JSON1; values are typically stored as TEXT, validated/queryable with JSON functions.

**Topic modeling recommendation:**

- Use a light relational split for V1:
  - `topics` carries stable metadata (`type`, `title`);
  - `topic_events` stores one JSON event per row (`event_json`) with `topic_id` relation.
- Rationale:
  - keeps basic relations and clean ownership;
  - keeps event payload flexible without over-modeling;
  - still supports `loadTopic(topicId)` by selecting topic + all related event rows.
- Keep an escape hatch: if event-level querying becomes central, progressively project selected event fields into typed columns.

- Old option considered and rejected for this item: single `topics.events_json` blob.

**Config + environment model:**

- Introduce a single database config service in core, consumed by jobs layer wiring.
- Proposed env surface:
  - `DATABASE_URL` (preferred; supports `file:` style SQLite URL), or
  - `DATABASE_PATH` (local convenience fallback).
- Selection rules:
  - if URL/path provided, use it;
  - otherwise derive local default path under repo data directory for dev.
- Keep existing runtime behavior spirit:
  - local/dev defaults to local file DB;
  - prod uses explicitly configured URL/path (Railway).

**CLI compatibility plan:**

- Replace KVS flags with `--sqlite` and explicit target values:
  - `--sqlite local`
  - `--sqlite remote`
- Do not carry forward `--kvs` aliases in this migration path.

**Layering plan (Effect):**

- Add core DB config service (`DatabaseConfig`) using Effect Config.
- Add core Drizzle/SQL module (planar-style) that exports:
  - typed Drizzle `Database` handle,
  - `SqliteLive` layer,
  - `DatabaseLive` layer (merged wiring).
- Entity services depend on the new SQLite database layer where they own persistence operations.
- Refactor core `modules/database/service.ts` toward the new SQL-backed direction; preserve caller-facing behavior through entity services rather than a database compatibility facade.
- Jobs commands provide only one persistence layer (`DatabaseLive`), plus existing notifier/entity layers.

**Migration plan:**

1. Add dependencies + base config wiring.
2. Add Drizzle schema for `users`, `subscriptions`, `topics`.
3. Add initial migration and local migration commands.
4. Implement SQL-backed `Database` methods with existing error mapping.
5. Update jobs wiring from KVS layer selection to `--sqlite` target selection + DB config selection.
6. Add/adjust tests for service behavior parity.
7. Retire `inspect` command path (or move it to SQL tooling scripts).
8. Validate commands locally with dry-run paths.

**Out of scope (this item):**

- Full columnar normalization of event payloads beyond `topic_events.event_json`.
- Business logic changes to scheduling/notification semantics.
- API/landing page feature work beyond required persistence compatibility.

**Implementation blueprint (carry-over patterns):**

- Goal of this section: avoid repeating research already done in `reference/effect` and `reference/planar`; implement directly from these patterns.

- Package/dependency shape to mirror:
  - Use Effect SQL + SQLite node client + Effect Drizzle integration (`@effect/sql`, `@effect/sql-sqlite-node`, `@effect/sql-drizzle`, `drizzle-orm`, `drizzle-kit`).
  - Ensure `drizzle-orm` is `>=1.0.0-beta.15` so `drizzle-orm/effect-schema` is available.
  - Keep dependencies in workspace `catalog:` style where applicable.

- Module/file layout proposal (core):
  - `packages/core/src/modules/database/config.ts`
    - `DatabaseConfig` service via Effect Config (`DATABASE_URL` / `DATABASE_PATH`, plus optional profile inputs).
  - `packages/core/src/modules/database/schema.ts`
    - Database module table defs (`users`, `subscriptions`, `topics`, `topic_events`) and exported schema object.
  - `packages/core/src/modules/database/providers/drizzle.ts`
    - typed Drizzle database handle from `@effect/sql-drizzle` (`database`), plus `SqliteLive` and `DatabaseLive` layer composition.
  - `packages/core/drizzle.config.ts`
    - drizzle-kit config that reads URL from env.
  - `packages/core/src/scripts/drizzle-kit.ts`
    - wrapper script pattern (same intent as planar) to resolve Effect config first, then invoke drizzle-kit.
    - keep this in `core` initially; only introduce a separate scripts package if this must be shared across multiple packages.
    - reason to keep wrapper: drizzle-kit config execution is sync-oriented and awkward with Effect runtime/config resolution; wrapper injects resolved env (`DATABASE_URL`) before running CLI actions.
  - `packages/core/src/modules/database/service.ts`
    - new SQL-backed north-star service (or direct re-export wrapper around typed database operations if service abstraction is intentionally thin).
  - entity service files under `packages/core/src/modules/<entity>/service.ts`
    - caller-facing CRUD/query APIs powered by SQLite queries.
  - `packages/core/src/lib/drizzle/*` (optional)
    - only for shared drizzle utility helpers that are not database-module-specific.

- Module/file layout proposal (jobs):
  - Replace `packages/jobs/src/lib/kvs.ts` usage with `packages/jobs/src/lib/sqlite.ts` (or equivalent) that maps `--sqlite local|remote` to config layer inputs.
  - `notify` should provide `DatabaseLive` and keep the rest of current layer composition stable.
  - `tools inspect` path is removed from migration critical path.

- Concrete layering pattern to copy (planar-style):
  - Define typed Drizzle database first, then provide it with a concrete SQL client layer.
  - Pattern:
    1. `const Database = Drizzle.make<typeof schema>({ schema })`
    2. `const SqliteLive = SqliteClient.layerConfig({ url: ... }).pipe(Layer.orDie)`
    3. `const DrizzleLive = Drizzle.layer.pipe(Layer.provide(SqliteLive))`
    4. `const DatabaseLive = Layer.mergeAll(SqliteLive, DrizzleLive)`
  - Keep layer constructor calls in constants (reuse same reference; avoid duplicate pools/clients).

- Config loading pattern to copy (Effect-first, updated from planar):
  - Use Effect Config service in core, not ad-hoc `process.env` reads in command code.
  - Keep secrets redacted where needed.
  - Jobs CLI flag (`--sqlite`) should select a profile, while actual URL/path resolution stays centralized in `DatabaseConfig`.
  - Prefer one runtime model (SQLite everywhere) and vary only config.

- Entity service persistence pattern:
  - Surfaces call entity services (`Users`, `Subscriptions`, `Topics`) instead of a database compatibility facade.
  - Entity services implement needed CRUD/query operations with SQL queries over the new schema; do not reintroduce KVS semantics internally.
  - New `database` module becomes the primitive persistence surface for entity services.

- Schema/table alignment pattern:
  - Use `createSelectSchema`, `createInsertSchema`, and `createUpdateSchema` from `drizzle-orm/effect-schema` against table definitions.
  - Treat Drizzle tables as the only persistence source of truth; do not hand-maintain duplicate row schemas.
  - Domain schemas (`User`, `Subscription`, `Topic`, `Event`) map from/to generated schemas at explicit boundaries only.
  - Avoid implicit transforms hidden in query callsites; use small mapper functions (for example `toSubscriptionRow`, `fromSubscriptionRow`).

- Query/modeling pattern for topics/events:
  - `loadTopic(topicId)` should:
    1. read `topics` metadata by `id`
    2. read `topic_events` rows by `topic_id`
    3. decode each `event_json` with existing `Event` schema
    4. return existing `Topic` shape (`{ id, events }`) for compatibility.
  - Keep ordering deterministic (for example by `topic_events.id`) to avoid behavior drift in tests.

- Migration/tooling workflow pattern:
  - Use drizzle-kit for migration generation/application.
  - Keep a small Effect runtime wrapper script for drizzle-kit so config resolution is identical between runtime and tooling.
  - Add a focused seed/import step from current JSON/KVS seed data into SQLite tables.

- Error mapping pattern:
  - Preserve existing domain error tags (`DataFileNotFound`, `DataReadError`, `DataValidationError`, `DataWriteError`) even though backend is SQL.
  - Map SQL errors into these tags at module boundaries so caller behavior/logging remains stable.
  - Keep parse/decode failures routed through existing schema validation error formatting approach.

- Test parity pattern:
  - Keep current behavior tests for notify/subscription flows.
  - Add migration-focused tests for:
    - schedule shape constraint persistence,
    - topic + topic_events roundtrip decoding,
    - `updateSubscription` upsert/update semantics,
    - local vs remote config selection via `--sqlite`.

**References to mirror:**

- Effect SQL SQLite layering patterns: `reference/effect/packages/sql-sqlite-node/src/SqliteClient.ts`
- Effect Drizzle integration: `reference/effect/packages/sql-drizzle/`
- Prior Drizzle config ergonomics: `reference/planar/packages/core/src/lib/drizzle/index.ts`, `reference/planar/packages/core/drizzle.config.ts`
