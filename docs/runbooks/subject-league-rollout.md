# Nested subject league rollout

Deploy the storage migration separately from the catalog refresh.

## 1. Merge and deploy the migration/code changes

The first-stage deployment keeps `CatalogSeedVersion` at `2026-10-14.1`.
`SeedProduction` runs when its `{ target, version }` input changes or deployment
is forced; implementation changes alone do not trigger it. Inspect the Alchemy
plan and confirm that `SeedProduction` is unchanged. Do not use `--force`, change
the database target, or otherwise rerun the catalog action during this phase.

Alchemy already configures `packages/data/migrations/postgres/` on the production
database and development branch resources. It discovers
`0006_subject_league_membership.sql` by filename and executes the migration and
its bookkeeping in one PostgreSQL transaction. Worker database bindings depend
on those resources. No manual production SQL invocation is required.

The migration only expands existing subject JSON:

- Adds nested `league` to MMA fighter/tracking subjects.
- Adds nested team membership, using a hand-authored mapping of all 124 existing
  professional team IDs to their reviewed league/conference affiliations.
- Keeps every existing field, including flat `leagueId`/`conferenceId`, so the
  previous workers can still read rows while new workers activate.
- Leaves already-nested membership unchanged. Invalid or unmapped membership
  aborts the migration rather than inventing a conference or partially applying
  the updates. Repair unexpected rows and retry before continuing deployment.
- Does not insert NCAA subjects or alter subject IDs, users, subscriptions,
  last-send state, events, or feeds.

New workers decode the expanded rows with the canonical nested schema; extra
legacy fields are ignored on read. No temporary application decoder is needed.
Existing professional teams therefore become readable before the later seed.

## 2. Merge the cleanup/catalog-version PR after the first deploy

The follow-on bumps `CatalogSeedVersion` to `2026-10-15.1` and adds
`0007_remove_legacy_subject_membership.sql`. A draft can be prepared earlier,
but do not merge it until the first code/migration deploy has succeeded and all
flat-only worker invocations have drained. Verify those rollout prerequisites
before marking it ready.

Migration 0007 removes the obsolete top-level `leagueId` and `conferenceId`
fields from every migrated subject, including rows absent from the catalog. It
refuses to remove fields from a row without valid nested membership and does not
touch event payloads. The version bump then reruns `SeedProduction`, introducing
the NCAA catalog and refreshing names/schedules. Normal upsert writes nested-only
JSON at the same subject IDs. Existing subscriptions and feed identities are
retained; normal MMA feed reconciliation still applies.

Do not combine the version bump with the first deployment: nested-only writes
would remove the fields that old workers still require. Once migration 0007
runs, rolling back to flat-only worker binaries is unsafe without restoring the
legacy fields as well, even if the subsequent seed fails. New workers can still
read the cleaned rows if the seed needs retrying. Re-running migration 0006 is
not a reverse migration.

## Regression test

Build core first, then run with an explicit empty local scratch database:

`UFC_TEST_DATABASE_URL=postgresql://...@127.0.0.1:PORT/dtpt_ufc_test pnpm exec vitest run packages/data/src/seed/legacy-subjects.integration.test.ts`

The test starts from pre-migration tables and real flat JSONB for every pro team
and both MMA subject kinds, applies the actual SQL before any catalog refresh,
checks legacy-field preservation and current subscription reads, then applies
the cleanup and separate seed. It covers cleanup of a noncatalog subject,
unchanged event membership, atomic failure for invalid/unmapped rows, and
idempotence of both migrations. All DDL/data roll back; without the explicit URL
the test is skipped.
