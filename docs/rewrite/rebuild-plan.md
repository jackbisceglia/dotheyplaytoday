# Rebuild Plan

## Guiding Strategy

Build the rewrite as vertical slices. Each slice should prove schema, persistence, service behavior, runtime wiring, and tests together before moving on.

Do not start by porting packages wholesale. Start with the smallest V1 path and pull forward only the parts that remain globally good.

## Phase 0 - Lock The Rewrite Baseline

Deliverables:

- Decide whether the rewrite happens in a new branch, new repo, or `packages/*` replacement path.
- Pin Effect v4 beta package versions in the workspace catalog.
- Keep Node + pnpm for the first pass unless there is a separate decision to move to Bun.
- Add a private `@dtpt/data` package for explicitly registered seed collections.
- Configure TypeScript strictness, ESLint, Prettier, Vitest, and Effect Language Service.
- Add package subpath exports early.
- Put shared Effect `HttpApi` contracts in `packages/core/src/contracts/`, not under `lib/`, because they are public cross-package boundaries.
- Preserve the existing typed Effect config pattern: core owns config values/provider helpers, package runtimes install providers/layers, services consume typed config.
- Keep database config under `packages/core/src/lib/database/config.ts` alongside database infrastructure.
- Give core scripts their own runtime assembly for seed commands instead of reusing API or jobs runtimes.
- Treat `modules/` as product/domain capabilities only; place database/runtime infrastructure under `lib/` such as `lib/database`.

Verification:

- Empty packages typecheck, lint, format, and test.
- Effect Language Service patch runs after install.
- `@effect/vitest` is configured for `it.effect` and `it.layer` tests.

## Phase 1 - Core Domain And Database Slice

Deliverables:

- Define core schemas for `User` with `unsubscribeTokenId`, `Subject`, `Event` with `sourceId` and `availability`, `EventParticipant`, `Subscription`, fixed local schedule, and sports details payloads.
- Define Drizzle tables: `users`, `subjects`, `events`, `event_participants`, `subscriptions`.
- Add `events.availability` with initial values `active` and `cancelled`; past/future status remains derived from `starts_at`.
- Generate Effect schemas from Drizzle for persisted rows.
- Add SQLite database layer using Effect SQL and Drizzle.
- Add shared database infrastructure errors: `DatabaseReadError`, `DatabaseWriteError`, and `DatabaseTransactionError` if needed.
- Add temporary SQLite test helper.
- Add seed/import script from the prototype data shape only if needed to validate end-to-end behavior.

Key decisions:

- No Redis/KVS.
- No `relative` schedule.
- No `enabled` unless a pause/resume workflow is added.
- Plain database failures use shared database errors instead of service-specific read/write wrappers.
- Service methods use predictable read names (`get`, `getByX`, `list`, `listByX`), meaning-based projections such as `Subscriptions.recipients`, and domain write names for invariant-bearing operations.
- `schedule_json` stores the fixed schedule tagged payload.
- Row-level variant tables use `kind` as a query projection of `details_json._tag`.
- `events.source_id` stores stable import identity formatted as `<eventType>:<source>:<uuid>` and is unique with `kind`.
- `events.availability` stores source-provided event availability, not past/future lifecycle state.
- `events.details_json` stores sports game event details.
- `event_participants.details_json` stores sports game participant details.

Verification:

- Schema boundary tests.
- Database error tests prove operation/context metadata is preserved.
- Drizzle migration or push creates all tables.
- SQLite roundtrip tests for each table.
- Event upsert tests prove repeated import by `(kind, source_id)` updates one event instead of creating duplicates.
- Event read tests prove cancelled events are excluded from normal subject-scoped reads and available only through an explicit cancelled-inclusive path.
- Subject schedule load returns deterministic event ordering through event participants.

## Phase 2 - Subscription Behavior Slice

Deliverables:

- Implement due-time calculation from local schedule and timezone.
- Implement local-date event matching.
- Ensure local-date event matching uses normal active-only event reads.
- Implement `localDayUtcRange` shared time utility for querying events by a user's local day.
- Implement already-sent local-date guard.
- Implement subscription replacement for one user by selected subject set, preserving the user's `unsubscribeTokenId` while resetting recreated subscriptions' `last_sent_at`.
- Add shared subscription policy for team cap and schedule increments.

Key decisions:

- Keep replacement behavior on `Subscriptions`; do not add a `SignupService` workflow abstraction in V1.

Verification:

- DST test.
- UTC previous/next local-day tests.
- Local-day UTC range tests for lagging, leading, and DST-changing timezones.
- Due window tests for 1 minute early and 5 minutes late.
- Duplicate suppression tests.
- Replace-for-user tests covering create, retain, delete, dedupe, cap rejection, and preserved `last_sent_at` for retained subscriptions.

## Phase 3 - Notifier And Notify Job Slice

Deliverables:

- Implement `Notifier` service contract.
- Implement email `NotifierChannel` layer.
- Implement Resend `NotifierChannelProvider` layer.
- Add dry-run notifier path.
- Implement notify job with explicit logs for skip, dry-run, send success, and send failure.
- Add CLI options: `--dry-run`, `--user <email>`, `--force`.

Key decisions:

- Notify orchestration depends on `Notifier`, `Users`, `Subscriptions`, `Subjects`, and `Events`, not Resend.
- The notifier module names the subordinate delivery boundaries as `NotifierChannel` and `NotifierChannelProvider`; define them as injectable service boundaries in `channels/service.ts` and `providers/service.ts` instead of shape-only contract files.
- A notifier `service.ts` file may be abstract or concrete: abstract files export the `Context.Service` boundary without a layer, while concrete implementation files provide the layer used by runtime composition.
- Email is the V1 `NotifierChannel`; Resend is the first email `NotifierChannelProvider` under `providers/email`.
- Notify orchestration stays in the job callsite; do not add a `NotifyService` in V1.
- Notify reads subscription recipients through `Subscriptions.recipients()` rather than mechanical `getAllWithUsers` naming.
- Notify remains subscription-first: load recipients, due-check in app, query same-day events by subject/local-day UTC range, send, then mark sent.
- Notify assembles the prepared `Notification` inline; do not add a builder/projection service in V1.
- Provider failures are per-subscription and do not stop later subscriptions.
- Data integrity or database read failures may abort the run.
- Inconsistent event participant graph tests abort the run.
- `last_sent_at` updates only after successful real send.
- Dry-run evaluates and reports would-send behavior without provider delivery or `last_sent_at` updates.
- `--user <email>` limits recipients to one normalized email address.
- `--force` bypasses subscription timing and already-sent guards, but still requires same-day events and updates `last_sent_at` after successful real sends.
- Database selection stays in environment/config/layers, not notify CLI flags.
- V1 sends one notification per due subscription/subject; per-user/per-game dedupe is deferred.
- Multiple same-day events for one subscribed subject are condensed into one notification.
- Send-before-mark tradeoff is accepted for V1; outbox/idempotent delivery is deferred.
- `markSent` failures after successful delivery are logged and do not stop later subscriptions.

Verification:

- Orchestration branch tests.
- Deterministic recipient and event ordering tests.
- Email rendering tests for text and HTML.
- Provider payload mapping tests.
- Retry and retry-exhaustion tests.
- Local dry-run against seeded SQLite.

## Phase 4 - Public Signup API Slice

Deliverables:

- Add shared HttpApi contract for signup.
- Add NBA sports subject catalog/seed data in `@dtpt/data`.
- Add sports event seed/import path that requires stable event source ids and resolves teams to existing subjects.
- Add signup domain flow: normalize email, upsert user, generate `unsubscribeTokenId` for new users, preserve it for existing users, and replace subscriptions.
- Add public write rate limiter.
- Add API route and error mapping.

Key decisions:

- Signup orchestration stays in the route callsite and uses table/domain services inside one transaction.
- Shared Effect `HttpApi` schemas live in `packages/core/src/contracts/`; API implements the contract and web consumes it through the typesafe client.
- Signup uses semantic submit naming for the client-facing operation and API handler rather than generic create/update language.
- Signup applies public-write rate limiting before opening the transaction, then maps domain/infrastructure errors to declared public HTTP errors at the route boundary.
- V1 stores sports league identity as `leagueId` details, not a separate `leagues` table.
- `pnpm @core seed:dev` imports all registered seed collections and may reset development data.
- `pnpm @core seed:prod` imports all registered seed collections, requires a typed CLI confirmation, must not modify users/subscriptions, and is non-destructive/upsert-only for catalog/schedule data.
- Seed scripts own seed orchestration directly: import registered `@dtpt/data` collections, write through domain services, and extract shared orchestration only after duplication appears.
- Seed collections are activated by explicit registration in `@dtpt/data`; V1 registers only NBA.
- Event imports update mutable facts for the same stable source id, including changed start times and explicit cancellation through `availability`.
- `POST /api/signup` returns `{ ok: true }` on success and maps validation/cap failures to public `400` errors.
- Public write rate limiting applies to signup and unsubscribe at the API boundary.
- Keep existing API scaffolding unless core contract implementation requires a change.

Verification:

- Handler tests for success, validation failure, cap rejection, invalid subject id, and rate limit.
- Persistence tests prove resubmission overwrites preferences for the same email.
- Import tests prove sports games write one event plus two participant edges and reject unresolved teams.

## Phase 5 - Landing Page Slice

Deliverables:

- Build signup landing page in SolidStart.
- Render team grid from decoded sports subject details.
- Capture timezone with fallback.
- Render fixed send-time options from shared policy.
- Submit to real API client.
- Show success and overwrite explanation.

Key decisions:

- Keep existing web scaffolding unless core contract consumption requires a change.

Verification:

- Client validation tests for bad email and over-cap selection.
- Manual local end-to-end signup writes to SQLite.
- Mobile and keyboard pass.

## Phase 6 - Unsubscribe Slice

Deliverables:

- Add opaque random unsubscribe token service.
- Add `GET /unsubscribe/:token` confirmation route that does not look up tokens or mutate subscriptions.
- Add `POST /api/unsubscribe` execution endpoint that hard-deletes the resolved user.
- Add opaque-token unsubscribe link to text and HTML emails.
- Cascade subscriptions from user deletion.

Key decisions:

- Unsubscribe is global for the user in V1, not per-subject.
- Unsubscribe hard-deletes the user record and cascades subscription deletion.
- Unsubscribe tokens are opaque random bearer capabilities stored on the user.
- Store raw unsubscribe tokens on users with a unique index; do not hash unsubscribe tokens in V1.
- Unsubscribe tokens do not contain embedded payloads, signatures, timestamps, or expiry in V1.
- GET requests do not look up tokens or mutate subscriptions so link scanners cannot silently unsubscribe users or probe token existence.
- V1 confirmation does not require email address re-entry.
- Re-signup after unsubscribe creates a fresh user row and unsubscribe token; old unsubscribe links do not affect the new signup.
- Unsubscribe orchestration stays in the API route callsite and uses `Users` inside one transaction; do not add an `UnsubscribeService` in V1.

Verification:

- Token sign/verify tests.
- Invalid token tests.
- GET confirmation route does not read or mutate subscriptions.
- Hard-delete unsubscribe tests, including cascading subscriptions.
- Repeated old-token post returns the generic terminal result after deletion.
- Email rendering tests for unsubscribe links.
- Manual confirmation click-through removes subscriptions.

## Phase 7 - Cutover And Cleanup

Deliverables:

- Remove prototype-only docs and scripts from the active path.
- Keep only the seed/import path needed for production cutover.
- Document production env vars and cron setup.
- Decide whether historical todo files remain archived or are removed.

Verification:

- Full checks pass.
- Fresh local setup from README works.
- Cron command dry-run works against a seeded database.
- Public signup plus notify plus unsubscribe work locally.

## Commit Strategy

Prefer semi-atomic commits by vertical slice:

1. Project baseline and Effect v4 pins.
2. Core database schema and test database helper.
3. Subscription scheduling behavior.
4. Notifier and notify job.
5. Signup API.
6. Landing page.
7. Unsubscribe.
8. Cutover docs and cleanup.

Each commit should leave the repo with targeted checks passing. Do not defer all validation to the end.
