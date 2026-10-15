# Nested subject league rollout

The catalog seed is the backfill: existing team and MMA JSON is replaced through
`Subjects.upsert` at the same subject IDs. It does not recreate subscriptions or
their last-send state. Existing feed identities remain intact; normal MMA event
feed reconciliation still applies. Catalog revision `2026-10-15.2` includes the
nested shape.

For this transition, `Subjects.get` and `Subjects.list` accept flat MMA membership
and flat sports membership **with a valid conference** at the persistence
boundary. They return canonical nested values, using the normal `p4p` and
NCAAM-only `league.apRank` decoding defaults. Reads do not rewrite JSON. Public
schemas and all writes remain nested-only. An existing malformed nested league
is never replaced by flat fields; other schema failures still propagate. MMA
seed ID/type collision validation remains in place.

## Deployment limits

This is bounded compatibility, **not a zero-downtime mixed-version rollout**:

- Deployed-main sports rows may have no conference. They remain unreadable until
  the catalog supplies the authoritative affiliation for that ID. No conference
  is guessed. Inventory IDs absent from the current catalog and repair them from
  an authoritative source before resuming readers; seeding cannot repair those.
- Subscription selection, subscription joins, and notification-recipient reads
  decode canonical subjects directly and require the completed backfill.
- Old API/jobs workers cannot decode nested JSON written by the new seed. New
  read compatibility cannot change already deployed old binaries.
- `SeedProduction` currently has no explicit resource dependency edge that
  guarantees worker activation ordering. Source order in `alchemy.run.ts` is not
  a deployment barrier. The ordinary deploy alone is insufficient coordination.

Use a coordinated maintenance cutover: pause scheduled jobs and traffic, drain
old invocations and stop old writers, run the updated seed successfully, verify
all subject rows against the canonical schema (including rows outside the
catalog), then activate only the new workers and resume traffic/jobs. Validate
subscription joins and notification selection as well as `Subjects.list` before
resuming. If seed fails, its transaction rolls back; keep readers paused and
resolve the reported data error. After a successful backfill, rolling back only
worker binaries is unsafe; a database restore/reverse migration would also be
required. A rolling deployment instead needs a separate staged expand/contract
release covering every reader and old-worker-compatible writes.

Remove the temporary persistence compatibility after canonical-row verification
and retirement of every flat writer. Keep the old-row regression test as the
record of the migration path.

## Regression test

`UFC_TEST_DATABASE_URL=postgresql://...@127.0.0.1:PORT/dtpt_ufc_test pnpm exec vitest run packages/data/src/seed/legacy-subjects.integration.test.ts`

Build core first (`pnpm --filter @dtpt/core build`). The test requires an empty
local scratch database, inserts real legacy JSONB, applies project migrations,
and rolls all DDL/data back. Without the explicit URL it is skipped.
