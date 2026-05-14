# Rewrite Task Plan

This plan splits the rewrite into sequential reviewable tasks. Each task should become its own branch and PR, landing in order. The scopes are intentionally not tiny; the rewrite is substantial, but each PR should still have one coherent review story.

Before broad implementation in any task, complete one representative vertical slice and pause for a pattern check-in. The check-in should show schema shape, service boundaries, runtime/layer wiring, test style, naming conventions, and how the task's pieces compose. After the pattern is accepted, finish the rest of that same branch by following the approved shape.

## Task 1 - Core Models And Database Schema

Goal: establish the core model and database substrate without implementing the business-style CRUD services yet.

Scope:

- Pin/update Effect v4, Effect SQL, Drizzle, Vitest, lint, typecheck, and package export baseline as needed.
- Establish `packages/core/src/modules` for domain capabilities and `packages/core/src/lib` for infrastructure.
- Add typed database config under `packages/core/src/lib/database/config.ts`.
- Add the SQLite/Drizzle database layer and test database helper.
- Add shared database infrastructure errors: `DatabaseReadError`, `DatabaseWriteError`, and `DatabaseTransactionError` if needed.
- Define schemas and tables for `User`, `Subject`, `Event`, `EventParticipant`, `Subscription`, fixed local schedule, sports subject details, sports event details, and participant details.
- Add `events.source_id` for stable import identity and `events.availability` with `active | cancelled`; keep past/future derived from `starts_at`.
- Generate persisted row schemas from Drizzle and prove the row/domain encode/decode pattern with model-level helpers or test fixtures only.
- Add migrations or database push setup needed to create all tables.
- Keep business-style domain services, import upserts, signup, notify, and unsubscribe orchestration out of this branch.

Vertical slice check-in:

- Implement the `User` model slice first: domain schema, table, row schema, row/domain encode/decode proof, database layer usage, test helper, and tests.
- Pause for review of file layout, schema naming, Drizzle table shape, row/schema derivation, database config/layer shape, and encode/decode pattern.
- After the user model pattern is accepted, expand the same branch to subjects, events, participants, subscriptions, and schedule schemas.

Verification:

- Schema boundary tests for all domain models and tagged details.
- SQLite roundtrip tests for each table.
- Database error tests prove operation/context metadata is preserved.
- Migration or database push creates all tables.
- Row/domain encode/decode tests cover JSON details, `kind`, `source_id`, `availability`, schedule JSON, and nullable `last_sent_at`.
- `pnpm lint`
- `pnpm typecheck`

## Task 2 - Core Domain Services And Scheduling Behavior

Goal: implement the domain services and business-style CRUD behavior on top of the completed model/database substrate.

Scope:

- Implement `Users`, `Subjects`, `Events`, and `Subscriptions` services.
- Keep decode DB reads / encode DB writes at service boundaries.
- Implement `Users` methods needed by later flows: primary read, email read, unsubscribe-token read, signup upsert, and remove.
- Implement `Subjects.get` and `Subjects.list`.
- Implement `Events.get`, `Events.listBySubject`, and `Events.upsertWithParticipants`.
- Implement `Events.listBySubject` as the normal active-only event read, with explicit `includeCancelled` for tooling/debug reads.
- Implement `Events.upsertWithParticipants` using stable `(kind, source_id)` identity.
- Implement `Subscriptions.list`, `Subscriptions.recipients`, `Subscriptions.replaceForUser`, and `Subscriptions.markSent`.
- Implement local send-time due calculation, local-day UTC range, event local-date matching helpers, already-sent guard, team cap policy, and 15-minute schedule increments.
- Keep signup, notify, and unsubscribe orchestration out of this branch except where tests need minimal fixtures.

Vertical slice check-in:

- Implement the `Users` service first against the completed user model/table.
- Pause for review of `Context.Service` shape, Effect.fn style, transaction style, database errors, and service-level decode/encode before implementing the remaining services.
- After the user service pattern is accepted, expand the same branch to subjects, events, subscriptions, and scheduling behavior.

Verification:

- Service tests for users, subjects, events, and subscriptions.
- Event upsert tests prove repeated imports update one event instead of creating duplicates.
- Event read tests prove cancelled events are excluded by default and included only when requested.
- Deterministic ordering tests for subject-scoped event reads and subscription recipient projections.
- Local-day UTC range tests for lagging, leading, and DST-changing timezones.
- Due-window and duplicate-suppression tests.
- Replace-for-user tests for create, replace, dedupe, cap rejection, and `lastSentAt` reset behavior.
- `pnpm lint`
- `pnpm typecheck`

## Task 3 - Data Package, Seed, And Import Runtime

Goal: make the completed domain/database model runnable with checked-in V1 data.

Scope:

- Add private `@dtpt/data` package with explicit collection registry.
- Register NBA subjects and sports game event collections only for V1.
- Implement seed/import scripts in core with their own runtime assembly.
- Add `seed:dev` and `seed:prod`; production seed requires typed CLI confirmation.
- Keep seed orchestration in the script until real duplication appears.
- Ensure imports update mutable event facts for stable source ids, including `starts_at`, `availability`, details, and participants.
- Ensure production seed is non-destructive for users and subscriptions.

Vertical slice check-in:

- Implement one registered NBA team collection and one game collection through the seed script before adding the full dataset.
- Check that the registry shape, package boundary, script runtime, and upsert behavior are clear and not dependent on filesystem scanning.

Verification:

- Registry tests or import tests for explicit activation.
- Seed import tests for one event plus two participant edges.
- Changed start-time import updates the existing event.
- Cancelled import updates `availability`.
- Production seed confirmation test.
- Local `seed:dev` run against SQLite.
- `pnpm lint`
- `pnpm typecheck`

## Task 4 - Notifier And Notify Job

Goal: rebuild notification delivery and the scheduled job around the completed domain services.

Scope:

- Implement `Notifier`, `NotifierChannel`, and `NotifierChannelProvider` service boundaries.
- Implement email channel rendering and Resend email provider.
- Add dry-run notifier behavior.
- Implement notify job orchestration with `--dry-run`, `--user <email>`, and `--force`.
- Use `Subscriptions.recipients()`, due checks, `Events.listBySubject`, `Notifier`, then `Subscriptions.markSent`.
- Log skip reasons, send successes, provider failures, mark-sent failures, and run counts.
- Keep notify orchestration in the job callsite; do not introduce `NotifyService`.

Vertical slice check-in:

- Implement one due subscription that renders one email notification through a dry-run channel and marks sent only in the real-send path.
- Check that notifier folder structure, channel/provider boundaries, rendering inputs, logging, and send-before-mark behavior are right before adding all CLI branches.

Verification:

- Email text and HTML rendering tests.
- Provider payload mapping tests.
- Notify branch tests for skip, dry-run, force, user filter, send failure, and mark-sent failure.
- Inconsistent participant graph test aborts the run.
- Local dry-run against seeded SQLite.
- `pnpm lint`
- `pnpm typecheck`

## Task 5 - Signup API And Web Signup

Goal: expose the first public user-facing flow end to end.

Scope:

- Add shared signup `HttpApi` contract in `packages/core/src/contracts/` at rough behavior level, final literal payload/error details decided during implementation.
- Implement API signup route with validation, rate limiting, transaction boundary, `Users.upsertForSignup`, and `Subscriptions.replaceForUser`.
- Build the SolidStart signup page from decoded sports subject details.
- Capture timezone, fixed send time, team selection, success state, and resubmission/overwrite explanation.
- Keep signup orchestration in the route callsite; do not introduce `SignupService`.

Vertical slice check-in:

- Implement one minimal signup path from web form to API route to persisted user plus subscription before finishing UI polish and all error branches.
- Check that contract placement, route orchestration, transaction ownership, web client usage, and validation mapping are right.

Verification:

- Handler tests for success, validation failure, cap rejection, invalid subject id, and rate limit.
- Persistence tests prove same-email resubmission overwrites preferences and preserves `unsubscribeTokenId`.
- Client validation tests for bad email and over-cap selection.
- Manual local signup writes to SQLite.
- `pnpm lint`
- `pnpm typecheck`

## Task 6 - Unsubscribe And Cutover Cleanup

Goal: complete the V1 lifecycle and remove prototype-only active paths.

Scope:

- Add opaque unsubscribe-token generation if not already complete from the core service branch.
- Add confirmation page for `GET /unsubscribe/:token` that does not read or mutate database state.
- Add `POST /api/unsubscribe` that resolves the token and hard-deletes the user.
- Add unsubscribe links to email rendering.
- Verify cascade deletion of subscriptions.
- Document production env vars and cron setup.
- Remove or quarantine remaining prototype-only scripts and data paths from the active implementation.

Vertical slice check-in:

- Implement one unsubscribe token through email link rendering, confirmation page, post endpoint, user delete, and cascade check before adding final generic messaging and cleanup.
- Check that token semantics, scanner-safe GET behavior, generic public responses, and route transaction boundaries are right.

Verification:

- Token generation/shape tests.
- GET confirmation route does not read or mutate subscriptions.
- Hard-delete unsubscribe tests including cascade.
- Repeated old-token post returns generic terminal result.
- Email rendering tests for unsubscribe links.
- Manual signup, notify dry-run, unsubscribe, and re-signup flow.
- `pnpm lint`
- `pnpm typecheck`

## Branch Order

Suggested branch names:

1. `refactor/v2-core-models-db`
2. `refactor/v2-core-services`
3. `refactor/v2-data-seed`
4. `refactor/v2-notify`
5. `refactor/v2-signup`
6. `refactor/v2-unsubscribe-cutover`

Each branch should start from updated `main` after the previous PR lands.
