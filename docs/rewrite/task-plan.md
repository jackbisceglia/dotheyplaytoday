# Rewrite Task Plan

This plan splits the rewrite into sequential reviewable tasks. Each task should become its own branch and PR, landing in order. The scopes are intentionally not tiny; the rewrite is substantial, but each PR should still have one coherent review story.

Before broad implementation in any task, complete one representative vertical slice and pause for a pattern check-in. The check-in should show schema shape, service boundaries, runtime/layer wiring, test style, naming conventions, and how the task's pieces compose. After the pattern is accepted, finish the rest of that same branch by following the approved shape.

Current execution order intentionally starts with one end-to-end domain path instead of defining every table before any service exists. First land the `User` model/database blueprint. Then implement the `Users` service against that blueprint. After the user path is proven through model, database, and service layers, fan out the same pattern across subjects, events, participants, subscriptions, and scheduling behavior.

Implementation note: rewrite core work currently lives in `packages/core-v2` / `@dtpt/core-v2` so Effect v4 can move independently from the prototype `@dtpt/core` package. The public rewrite API follows the same boundary in `packages/api-v2` / `@dtpt/api-v2`; the prototype `packages/api` package remains preserved until cutover. The rewrite web app follows the same boundary in `packages/web-v2`, built with Astro rather than the prototype's SolidStart. Older broad docs that say `packages/core`, `packages/api`, or `packages/web` mean the rewrite v2 package boundary unless a task says otherwise.

## Task 1 - User Model And Database Blueprint

Goal: establish the rewrite package baseline, database substrate, and accepted model/table/schema pattern through the `User` slice only. Do not implement business-style CRUD services yet.

Scope:

- Pin/update Effect v4, Effect SQL, Drizzle, Vitest, lint, typecheck, and package export baseline as needed.
- Establish `packages/core-v2/src/modules` for domain capabilities and `packages/core-v2/src/lib` for infrastructure.
- Add typed database config under `packages/core-v2/src/lib/database/config.ts`.
- Add the SQLite/Drizzle database layer and test database helper.
- Add shared database infrastructure errors: `DatabaseReadError`, `DatabaseWriteError`, and `DatabaseTransactionError` if needed.
- Define the `User` schema/table slice with `unsubscribeToken`.
- Prove the row/domain encode/decode pattern with model-level tests and a SQLite roundtrip.
- Add shared table/schema helpers, such as snake_case Drizzle table creation and type-only table/schema contracts.
- Document any temporary database compatibility shim needed while waiting for official Drizzle SQLite Effect support.
- Keep business-style domain services, import upserts, signup, notify, and unsubscribe orchestration out of this branch.
- Keep `Subject`, `Event`, `SubjectEvent`, `Participant`, `Subscription`, schedule, and details schemas out of this branch unless a tiny shared primitive is required by the accepted `User` pattern.

Vertical slice check-in:

- Implement the `User` model slice: domain schema, table, row schema, row/domain encode/decode proof, database layer usage, test helper, and tests.
- Pause for review of file layout, schema naming, Drizzle table shape, row/schema derivation, database config/layer shape, and encode/decode pattern.
- Land this branch after the `User` model/database pattern is accepted. Do not fan out to the other models in this branch.

Verification:

- User schema boundary tests.
- User row/domain encode/decode tests.
- User SQLite roundtrip through the database layer and test setup.
- Type-only table/schema contract compiles.
- Package build for `@dtpt/core-v2`.
- `pnpm lint`
- `pnpm typecheck`

## Task 2 - Users Service End-To-End

Goal: implement the first business-style domain service against the accepted user model/database blueprint, proving the service shape before expanding to the rest of the domain.

Scope:

- Implement the `Users` service.
- Keep decode DB reads / encode DB writes at service boundaries.
- Keep service inputs as decoded domain values; raw API/input normalization belongs at route, job, seed, or importer boundaries.
- Use the shared `Id.SchemaBranded` / `Id.createFromBrandedSchema(EntityId)` pattern for generated ids.
- Implement `Users` methods needed by later flows: primary read, email read, unsubscribe-token read, signup upsert, and remove.
- Generate `unsubscribeToken` for new users and preserve it on signup resubmission.
- Map database failures to shared infrastructure errors with operation metadata.
- Use transaction boundaries where the user write semantics require them.
- Keep `Subjects`, `Events`, `Subscriptions`, signup API, notify, and unsubscribe orchestration out of this branch except where tests need tiny local fixtures.

Vertical slice check-in:

- Implement the `Users` service against the completed user model/table.
- Pause for review of `Context.Service` shape, `UsersLayer` naming, Effect.fn style, transaction style, database errors, domain-value inputs, id generation, and service-level decode/encode before future service work.
- Land this branch after the user service pattern is accepted. Do not fan out to the other services in this branch.

Verification:

- Users service tests for primary read, email read, unsubscribe-token read, signup upsert, token preservation, timezone overwrite, and remove.
- Database error tests prove operation/context metadata is preserved at real query callsites.
- Transaction tests for any multi-step user write behavior.
- Service-level decode-read / encode-write behavior is covered.
- `pnpm lint`
- `pnpm typecheck`

## Task 3 - Remaining Core Models, Services, And Scheduling

Goal: apply the accepted model/database/service pattern across the rest of the core domain.

Scope:

- Define schemas and tables for `Subject`, `Event`, `SubjectEvent`, `Participant`, `Subscription`, fixed local schedule, sports subject details, sports event details, and participant details.
- Add `events.source_id` for stable import identity and `events.availability` with `active | cancelled`; keep past/future derived from `starts_at`.
- Add migrations or database push setup needed to create all tables.
- Implement `Subjects`, `Events`, and `Subscriptions` services.
- Implement `Subjects.get` and `Subjects.list`.
- Implement `Events.get`, `Events.listBySubject`, `Events.upsert`, `Events.setParticipants`, and `Subjects.addEventToFeed`.
- Implement `Events.listBySubject` as the normal active-only event read, with explicit availability options for tooling/debug reads.
- Implement `Events.upsert` using stable `(_tag, source_id)` identity.
- Implement `Subscriptions.list`, `Subscriptions.listNotificationRecipients`, `Subscriptions.replaceForUser`, and `Subscriptions.markSent`.
- Implement local send-time due calculation, local-day UTC range, event local-date matching helpers, already-sent guard, subject allowance policy, and 15-minute schedule increments.
- Keep signup, notify, and unsubscribe orchestration out of this branch except where tests need minimal fixtures.

Vertical slice check-in:

- Start with the smallest remaining end-to-end slice that exercises a new shape, such as `Subject` model plus service.
- Pause only if the accepted `User` model/service blueprint does not cover the new shape. JSON details, relation-shaped reads, and subscription scheduling are the likely places to check in.
- After each new shape is accepted, fan out the same pattern across the remaining domain pieces.

Verification:

- Schema boundary tests for all remaining domain models and tagged details.
- SQLite roundtrip tests for each table.
- Row/domain encode/decode tests cover JSON details, `_tag`, `source_id`, `availability`, schedule JSON, and nullable `last_sent_at`.
- Service tests for subjects, events, and subscriptions.
- Event upsert tests prove repeated imports update one event instead of creating duplicates.
- Event read tests prove cancelled events are excluded by default and included only when requested.
- Deterministic ordering tests for subject-scoped event reads and subscription recipient projections.
- Local-day UTC range tests for lagging, leading, and DST-changing timezones.
- Due-window and duplicate-suppression tests.
- Replace-for-user tests for create, replace, dedupe, cap rejection, and `lastSentAt` reset behavior.
- `pnpm lint`
- `pnpm typecheck`

## Task 4 - Data Package, Seed, And Import Runtime

Goal: make the completed domain/database model runnable with checked-in V1 data.

Scope:

- Add private `@dtpt/data` package with explicit collection registry.
- Register sports subject and sports game event collections explicitly for V1.
- Implement seed/catalog scripts in core with their own runtime assembly.
- Add `seed:dev` and `seed:prod`; production seed requires typed CLI confirmation.
- Keep seed orchestration in the script until real duplication appears.
- Ensure imports update mutable event facts for stable source ids, including `starts_at`, `availability`, details, and participants.
- Ensure production seed is non-destructive for users and subscriptions.

Vertical slice check-in:

- Implement one registered team collection and one game collection through the seed script before adding full datasets.
- Check that the registry shape, package boundary, script runtime, and upsert behavior are clear and not dependent on filesystem scanning.

Verification:

- Registry tests or import tests for explicit activation.
- Seed import tests for one event plus two subject events and two participant records.
- Changed start-time import updates the existing event.
- Cancelled import updates `availability`.
- Production seed confirmation test.
- Local `seed:dev` run against SQLite.
- `pnpm lint`
- `pnpm typecheck`

## Task 5 - Channel And Notify Job

Goal: rebuild notification delivery and the scheduled job around the completed domain services.

Scope:

- Implement the `Channel` and `ChannelClient` service boundaries.
- Implement email channel rendering and Resend email channel client.
- Add dry-run channel behavior.
- Implement notify job orchestration with `--dry-run`, `--user <email>`, and `--force`.
- Use `Subscriptions.listNotificationRecipients()`, due checks, `Events.listBySubject`, `Channel`, then `Subscriptions.markSent`.
- Log skip reasons, send successes, provider failures, mark-sent failures, and run counts.
- Keep notify orchestration in the job callsite; do not introduce `NotifyService`.

Vertical slice check-in:

- Implement one due subscription that renders one email notification through a dry-run channel and marks sent only in the real-send path.
- Check that channels folder structure, channel/client boundaries, rendering inputs, logging, and send-before-mark behavior are right before adding all CLI branches.

Verification:

- Email text and HTML rendering tests.
- Channel client payload mapping tests.
- Notify branch tests for skip, dry-run, force, user filter, send failure, and mark-sent failure.
- Inconsistent participant graph test aborts the run.
- Local dry-run against seeded SQLite.
- `pnpm lint`
- `pnpm typecheck`

## Task 6 - Signup API And Web Signup

Goal: expose the first public user-facing flow end to end.

Scope:

- Add shared signup `HttpApi` contract in `packages/core/src/contracts/` at rough behavior level, final literal payload/error details decided during implementation.
- Implement API signup route with validation, rate limiting, transaction boundary, `Users.upsertForSignup`, and `Subscriptions.replaceForUser`.
- Build the Astro signup page in `packages/web-v2` from decoded sports subject details.
- Capture timezone, fixed send time, team selection, success state, and resubmission/overwrite explanation.
- Keep signup orchestration in the route callsite; do not introduce `SignupService`.

Vertical slice check-in:

- Implement one minimal signup path from web form to API route to persisted user plus subscription before finishing UI polish and all error branches.
- Check that contract placement, route orchestration, transaction ownership, web client usage, and validation mapping are right.

Verification:

- Handler tests for success, validation failure, cap rejection, invalid subject id, and rate limit.
- Persistence tests prove same-email resubmission overwrites preferences and preserves `unsubscribeToken`.
- Client validation tests for bad email and over-cap selection.
- Manual local signup writes to SQLite.
- `pnpm lint`
- `pnpm typecheck`

## Task 7 - Unsubscribe And Cutover Cleanup

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

## Post-Refactor Tasks

These are follow-up cleanup items surfaced while implementing the ordered rewrite tasks. Track them here without changing the current branch order.

- Define the V2 local database URL story, including a canonical local SQLite default and documented `DATABASE_URL` behavior for fresh-checkout seed and debug scripts.
- Move root `.env` loading into a shared V2 Effect utility or layer instead of hand-rolling package-local `ConfigProvider.fromDotEnv` setup. The shared helper should resolve the repo-root dotenv path explicitly so CLI cwd choices, package scripts, and `DATABASE_URL` path semantics are documented and consistent.
- Make the V2 dev seed notification recipient configurable or otherwise safe for shared local E2E. `seed:dev` should not commit a real personal mailbox as the default recipient for non-dry-run notify; use local config/env or a clearly safe example/test address, and document how to opt into a real recipient for Resend tests.
- Standardize Node CLI runtime wiring for V2 packages so domain layers, Node services, and root env loading compose in one obvious place.
- Add a web-v2 Vite environment provider/runtime so Astro dev and preview bind to the configured `PUBLIC_WEB_URL_PORT`. Until then, keep local `PUBLIC_WEB_URL_PORT` aligned with Astro's default dev server port, `4321`.
- Standardize V2 test names on a `should <behavior> when <condition>` style instead of current ad-hoc descriptions.

## Branch Order

Suggested branch names:

1. `refactor/v2-core-models-db`
2. `refactor/v2-users-service`
3. `refactor/v2-core-domain-slices`
4. `refactor/v2-data-seed`
5. `refactor/v2-notify`
6. `refactor/v2-signup`
7. `refactor/v2-unsubscribe-cutover`

Each branch should start from updated `main` after the previous PR lands.
