# PostgreSQL persistence test plan

## Purpose

This document records the database behavior worth testing after disposable
Alchemy-managed PlanetScale branches are available. It replaces the removed
SQLite suites; those implementations are not a compatibility target.

Reintroduce tests selectively from this plan. Prune cases that duplicate
schema, contract, or domain-only coverage, and update expectations to match
PostgreSQL behavior and the transaction model in place at that time.

## Test environment

Each database integration run should:

1. Generate a unique `infra-postgres-*` Alchemy stage.
2. Deploy the application stack against an isolated PlanetScale branch forked
   from the long-lived production database.
3. Apply checked-in migrations and create a least-privilege role for that
   branch.
4. Use the direct role URL for core service and seed tests.
5. Use the deployed API Worker through Hyperdrive for HTTP integration tests.
6. Disable Hyperdrive query caching.
7. Destroy only the disposable stage after the suite, including on failure.

Do not use Docker, Testcontainers, PGlite, or the production branch.

## Suite tree

```text
PostgreSQL persistence
├── migrations and schema
│   ├── applies every checked-in migration to an empty branch
│   ├── inserts and reads structured details and schedules without data loss
│   ├── rejects duplicate values protected by application uniqueness rules
│   ├── deletes parent rows and observes the expected cascades
│   ├── preserves application-generated text IDs exactly
│   └── orders and filters ISO-8601 text timestamps correctly
├── core services
│   ├── users
│   │   ├── reads by id, ids, email, and unsubscribe token
│   │   ├── reports UserNotFound for a missing primary read
│   │   ├── creates signup users with application-generated IDs
│   │   ├── preserves unsubscribe tokens and updates timezone on resubmission
│   │   ├── removes users by id
│   │   ├── decodes stored rows before returning domain values
│   │   ├── validates writes before executing SQL
│   │   └── maps read, write, and delete failures with operation metadata
│   ├── subjects
│   │   ├── upserts by checked-in subject ID
│   │   ├── reads by id and lists deterministically
│   │   ├── returns an empty list when no subjects exist
│   │   ├── reports SubjectNotFound for a missing primary read
│   │   ├── decodes stored rows before returning domain values
│   │   ├── adds feed edges idempotently
│   │   └── maps missing feed-edge parents and query failures
│   ├── events
│   │   ├── upserts by tag and source ID while preserving event ID
│   │   ├── preserves checked-in IDs during source-ID upserts
│   │   ├── reports EventNotFound for a missing primary read
│   │   ├── replaces and clears event-local participants
│   │   ├── validates replacement participants before deleting existing rows
│   │   ├── lists active subject events with participants in schedule order
│   │   ├── filters UTC text ranges and cancelled events correctly
│   │   └── validates event upserts before executing SQL
│   └── subscriptions
│       ├── lists subscriptions and notification recipients deterministically
│       ├── replaces and clears one user's selections
│       ├── rejects over-capacity and missing-subject replacements before deletion
│       ├── marks a subscription sent at a UTC instant
│       ├── reports a missing subscription from mark-sent
│       └── maps query failures with operation metadata
├── HTTP API through Worker and Hyperdrive
│   ├── subjects
│   │   └── returns decoded subjects ordered by id
│   ├── signup
│   │   ├── stores normalized users and selected subscriptions
│   │   ├── rejects unknown subject IDs
│   │   ├── maps subscription-cap rejection to the public error
│   │   ├── replaces selections while preserving the unsubscribe token
│   │   └── rate-limits before database writes
│   └── unsubscribe
│       ├── deletes the user and cascades subscriptions
│       ├── returns generic success for unknown and consumed tokens
│       ├── does not reuse old tokens after a fresh signup
│       ├── rejects malformed token shapes
│       └── rate-limits before database writes
├── seed actions through a direct PlanetScale role
│   ├── catalog
│   │   ├── registers only current league catalogs and explicit season data
│   │   ├── rejects invalid participants and duplicate source IDs before writing
│   │   ├── imports events, feed edges, and participants
│   │   ├── updates stable source IDs without duplication
│   │   ├── rejects feed edges with unresolved event source IDs
│   │   └── leaves users and subscriptions unchanged in production mode
│   ├── development users
│   │   ├── seeds users with subscriptions
│   │   ├── uses the safe default recipient
│   │   ├── honors SEED_EMAIL only for the default seed user
│   │   └── replaces subscriptions when seed definitions change
│   └── reset
│       └── clears every current seed table
└── transaction rollback
    ├── rolls back signup when subscription replacement fails
    ├── makes unsubscribe lookup and deletion atomic
    ├── rolls back subscription replacement on insert failure
    ├── rolls back participant replacement on insert or foreign-key failure
    ├── rolls back catalog import on any write failure
    └── rolls back development reset on any delete failure
```

The transaction behavior is implemented with Effect `SqlClient` interactive
transactions over the same `PgClient` used by Drizzle. The rollback cases remain pending provider-backed integration
coverage and must run only in the disposable environment above; do not replace
them with SQLite, Docker, Testcontainers, or PGlite approximations. Catalog
rollback coverage should use a deliberately small failing fixture while still
exercising the same single, serialized catalog transaction used in production.

## Existing coverage

Keep fast schema, domain, contract, scheduling, channel, and rendering tests in
the normal local suite. The opt-in test under
`packages/core/src/lib/database/__tests__/infra/` deploys the actual application
stack and remains the minimal connectivity check for Worker → Hyperdrive →
PlanetScale.
