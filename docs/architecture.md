# Architecture

## Packages and dependencies

- `packages/core` owns domain models, shared HTTP contracts, persistence services, scheduling rules, notifier implementations, and provider-neutral transport boundaries.
- `packages/api` implements the public HTTP API using `core` contracts and services.
- `packages/jobs` implements notification orchestration and scheduled Workers
  using `core` services and notifiers. Internal operational jobs live under
  `src/ops`, grouped by concern.
- `packages/data` owns catalog, event, and development seed data and writes through `core` domain services.
- `packages/web` is the Solid 2 Start-mode frontend and consumes shared `core` contracts.

The feedback write path is intentionally small: its API handler validates the
shared contract and inserts directly through the `Database` service. The
operations Worker's feedback workflow reads directly for its preceding 12-hour
UTC window; there is no feedback domain service because neither path has
reusable domain behavior.

Dependencies point inward toward `core`. The API, jobs, data, and web packages do not provide domain abstractions for `core` or depend on one another for their primary behavior.

## Runtime and infrastructure

- TypeScript and Effect v4 beta.
- Solid 2 Start mode and Solid Router 2 on a Cloudflare Worker. Alchemy adopts
  Solid's `client` environment as static assets and its generated `ssr`
  Fetchable as the Worker entry.
- PlanetScale PostgreSQL and Drizzle, connected to Workers through Cloudflare Hyperdrive V1.
- Alchemy-provisioned PlanetScale database/branches/roles, Hyperdrive, public
  API Worker, notification Worker, operations Worker, and Web Worker. Each
  deployable owns its resource declaration in its package; `alchemy.run.ts`
  orchestrates them.
- Alchemy attaches the exact `production` stage to `dotheyplay.today`,
  `api.dotheyplay.today`, and `jobs.dotheyplay.today`. Other non-development
  stages prepend their normalized stage; `dev_*` stages keep development-only
  URLs and do not claim custom domains.
- The production stack manages HTTPS redirection and a conservative HSTS
  policy as Cloudflare zone settings. It adopts the existing Cloudflare zone,
  retains it on stack destruction, and exposes it to other stages through an
  Alchemy resource reference. Existing DNS records remain unmanaged until they
  are individually declared and adopted. No other stage manages the zone-wide
  settings.
- The API, notification, and operations Workers construct the existing
  `Database` Effect service from a Hyperdrive binding. Alchemy's PostgreSQL
  bridge scopes an `@effect/sql-pg` pool to each Worker event and exposes
  Drizzle's ordinary interactive transaction API; no connected pool is created
  at module scope or shared across invocations.
- Transactional workflows use Drizzle's Effect-native `database.transaction(...)`. Drizzle delegates to its underlying `PgClient.withTransaction(...)`, so domain-service queries inherit the transaction connection from Effect context and nested service transactions use savepoints without threading a transaction object through service APIs.
- Deployed Workers use Hyperdrive against the PlanetScale role's direct PostgreSQL origin. `alchemy dev` bypasses Hyperdrive and uses PlanetScale's pooled origin. Both require TLS; deployed Hyperdrive starts with an origin connection limit of five and has query caching disabled.
- Alchemy seed Actions connect directly to the stage role URL rather than a Worker binding. `pnpm dev:seed` recreates only the calling checkout's development stage and seeds all subjects, real events starting within the current UTC day and the next one, and the development user once; the event window is frozen at stage creation, and ordinary development restarts reuse that state. The exact `production` stage runs a versioned, non-destructive catalog-only import that does not modify users or subscriptions.
- Cloudflare Worker cron for scheduled notifications.
- A shared operations Worker hosts internal scheduled concerns. Its feedback
  workflow runs twice daily and sends recent feedback to the configured
  administrator. It selects the half-open 00:00–12:00 or 12:00–24:00 UTC
  submission window and uses that window as the provider idempotency key.
- Resend email delivery and console dry runs. Scheduled notifications depend on
  the `Notifier` service, with interchangeable email and console layers. The
  provider-neutral `Email` service sends complete outbound emails, and its
  Resend layer factory binds the required sender. Resend also owns SDK calls,
  API-key configuration, retry policy, and provider error mapping.
  Email-provider modules expose a resolved-options layer constructor and a
  Config-backed adapter with the same shape.
- Typed Effect config at runtime boundaries.

### Authentication boundary

Better Auth is mounted in the API Worker at `/api/auth/*` through an
`HttpApi` group with GET and POST wildcard handlers. The handler adapts Effect's server request to
Better Auth's Web `Request`/`Response` boundary, sharing the API's credentialed
CORS middleware and Worker entry point. Better Auth owns endpoint validation and responses; the shared `HttpApi` group
only declares the wildcard transport routes.
The stack supplies the resolved API and Web URLs through `bindApiUrl` and
`bindWebUrl` helpers, keeping URL bindings outside resource construction.
Only magic-link authentication is enabled, Better Auth's own signup is disabled, tokens are
hashed at rest, and sessions are persisted in `auth_sessions`. Cookies remain
host-only to the API origin and secure on HTTPS. API and Web origins are trusted.

The existing `users` table is Better Auth's user model. Its normalized email
and existing ID remain the identity key; no parallel application-user table is
created. Auth adds `name`, `email_verified`, `created_at`, and
`updated_at` columns; Better Auth's optional profile-image field is not stored.
The built-in `/update-user` endpoint is disabled until account editing is
implemented, so it cannot write unsupported profile fields.
`User` remains the single table-backed domain schema, and its insert schema
keeps database-managed defaults optional. The unused name is nullable and
optional on insert. Migration 0004 initially marks existing rows unverified.
Its `created_at` default assigns preexisting rows the migration timestamp, not
their original signup dates; grandfathering must not infer signup dates from it.
Migration 0005 grants notification eligibility only to a fixed, owner-trusted
cohort; this is not proof of mailbox ownership and creates no sessions. New
rows retain the false default. Existing users still redeem a magic link to sign
in. The magic-link before hook normalizes the address and looks up the user once
through Better Auth's internal adapter. It carries the user with a normalized
email in request context; the sender silently skips unknown recipients. Better
Auth also has signup disabled, so an unknown address cannot create a row missing
timezone or unsubscribe identity. Both known and unknown requests receive
Better Auth's ordinary success response.

`Auth.make` reads runtime configuration, opens a scoped Promise-native
`pg.Pool` through Hyperdrive, and constructs Better Auth with its Drizzle adapter.
Auth uses standard Promise-native Drizzle over that pool, reusing the existing
user, session, account, and verification table definitions. Drizzle owns the SQL
column names; auth no longer repeats column mappings. Adapter transactions are
enabled. Application persistence remains on Effect + Drizzle. Better Auth awaits
its database work before returning; its optional background-task handler is not
enabled. `Auth.make(connectionString)` accepts a resolved string; the Worker
resolves Hyperdrive credentials when building that layer during an invocation.
The pool has one connection and closes with the Worker execution scope.

Magic-link email uses the existing transactional Email/Resend workflow. After
eligibility is checked, delivery is registered directly with the Worker's
`waitUntil`; it needs no further database access and does not delay the response.
There is no separate auth task queue. Protected reads use
`auth.use(client => client.api.getSession({ headers }))`; the adapter maps SDK
rejections to `AuthRequestError` and also exposes the underlying `auth.client`.
Both reads validate the session user ID through `UserId.makeEffect` and delegate
persistence and decoding to `Users.get` and `Subscriptions.listForUser`.
Responses, including errors, set `Cache-Control: no-store`.

Auth rate limiting uses Better Auth's in-memory store, shared across auth
instances within a Worker isolate. It allows five magic-link requests and ten
verification attempts per client IP per minute, using Cloudflare's
`cf-connecting-ip` header. These are per-isolate limits, not a global quota;
multiple isolates and isolate restarts do not share counters. A distributed
limit would require shared storage or an edge rate-limiting rule.

`Subscriptions.listNotificationRecipients()` restricts its relational database
query to `user.emailVerified: true`. Both normal and forced notification runs
load recipients through that query, so pending users never enter event lookup,
scheduling, delivery, or last-sent processing. Force only bypasses due-time and
already-sent guards after recipient selection. Persisted confirmation makes
saved subscriptions eligible for subsequent runs under ordinary scheduling
rules; no notification hook, immediate send, or last-sent reset is involved.
Grandfathering and the companion pending-registration implementation form one
deployment unit with this filter; see the [rollout audit](./runbooks/production-deploy.md#notification-eligibility-and-grandfathering-rollout).

Registration uses the API write limiter before persistence or link issuance;
direct Better Auth server API calls bypass its HTTP rate-limit middleware.
The user handler owns the transaction that calls `Users.create` and saves the
selected subscriptions and schedule. New users have `emailVerified: false` and
`name: null`. The unique normalized-email constraint arbitrates concurrent
inserts. `Users.create` unwraps Drizzle's Effect Cause and maps only the email
constraint violation to `UserAlreadyExists`. After rollback, the handler
requests a magic link and returns `DuplicateSignup` (409), preserving the
existing user's settings. Successful creation requests a link after commit.
Issuance failures are logged without undoing preferences or changing either
response, so a later request can issue a replacement.

The notification Worker provisions the email notifier, which renders a
`Notification` and delegates separate delivery metadata and rendered content to
`Email`. Separate transactional confirmation and sign-in views bypass
`Notifier` and provide the same concrete Resend email layer internally. Better
Auth's magic-link callback reuses the recipient from request context to select
the view by `emailVerified`, without another lookup or email normalization. It
forwards the generated URL unchanged. A shared Better Auth before hook selects
the Web `/home` route through `callbackURL`, adding `confirmation=1` only for users
unverified at issuance. It sets `errorCallbackURL` to the Web root without the
marker. The hook covers both registration's server API calls and standalone HTTP
sign-in, retaining validation of caller-supplied URLs. The recipient context is
server-owned and scoped to each issuance, so concurrent requests remain isolated
and callback selection and email copy use the same verification snapshot. The
sender reads the typed, server-owned user directly from the endpoint context
without decoding the internal value again. Tokens are hashed, expire after 15
minutes, and are single-use. Issuance is
awaited while the auth pool is open; `WorkerExecutionContext.waitUntil` owns
email delivery, which needs no further database access. Delivery failures are
logged without changing the registration response. The old team-picks signup
email is no longer sent.

Email headlines are pre-rendered PNG tiles rather than live text. No Gmail
client loads web fonts, and forced dark modes recolor text but leave images
alone, so the brand's condensed display type on an ink panel only survives as
an image. Each email owns its headline copy as lines, the last word of which the
brand sets in kelly, and passes `EmailView` a `Headline` from `core`'s
`email/headline.ts`: a tiled headline built with `makeTiledHeadline`, or a
live-text `TextHeadline` like the feedback digest's. `buildHeadlineImagePath`
names each image after its copy, so the email and the renderer agree on the
file. `pnpm @web assets:generate` collects every tiled headline's lines,
including one per catalog team, and renders them into the web app's
`public/email/headlines/`, which is committed and served with the site. Rerun
it after building core and data whenever headline copy, the catalog, or the
artwork changes. Body copy uses each platform's system UI font.

The operations Worker owns feedback's administrator config, digest rendering,
and a static Resend email layer with its operations-specific sender; `core`
retains the generic email rendering and provider boundaries used by that
workflow.

Web receives both an `API` service binding and the API Worker's complete
resolved URL. The shared typed API client loads a binding-backed HTTP transport
in the SSR environment and uses the public URL transport in the browser;
application calls are independent of that transport choice. API CORS and the
notification Worker consume the Web Worker's resolved URL through late
bindings, avoiding a props-level resource cycle without reconstructing deployed
URLs. See [Alchemy service URL wiring](./alchemy-service-urls.md).

Link previews are served from a committed `public/og.png`, rendered offline by
`pnpm @web assets:generate` (`packages/web/scripts/og.ts`) through satori and resvg. Keeping
it a build artifact rather than a request-time route keeps native rendering
dependencies out of the deploy and gives crawlers a cacheable static asset.
Crawlers fetch `og:image` from their own servers rather than resolving it
against the page, so the tag is absolutized against the incoming request URL.

Web uses all-SSR rendering. The attempted mixed-render design was rejected
because Solid Start mode has no SSR route-prerender hook; producing a static
home document would require post-build output mutation coupled to Alchemy's
asset-finalization order. Cloudflare still serves hashed client assets before
unmatched requests enter the generated Solid Fetchable. Development disables
runtime dependency discovery only in the SSR Vite environment because
Alchemy's workerd runner cannot safely reload an SSR program during an
in-flight request; native ESM dependencies are transformed without
prebundling.

Local production deploys load `.env.production` through
`--env-file .env.production`. Pushes to `main` run the same exact `production`
stage through GitHub Actions, with the production GitHub environment injecting
provider and application configuration directly into the Alchemy process.
Production deploys are serialized, run repository checks before apply, and
verify the Web and API health endpoints after apply. Only pushes to `main` can
start the workflow; production has no manual dispatch path.

The `production` stage owns the retained PlanetScale database and production
branch. Other stages reference that database and own disposable development
branches on PlanetScale's PS-DEV size. Destroy non-production stages when they
are no longer needed so their branch billing stops. Alchemy applies checked-in
migrations before creating runtime roles, Workers, and seed Actions.

One small repository script resolves a deterministic, fail-closed development
stage. A positively identified primary Git checkout uses `dev_<user>`. A linked
Git worktree uses `dev_<user>_<worktree-name>`, deriving the last component
from the worktree directory rather than its branch. The resolver follows
Alchemy's stage alphabet, sanitizes components, verifies Git's common directory
and worktree metadata, and never accepts a non-`dev_` result. All
worktree-aware commands therefore use the same stage: `pnpm -s alchemy:stage`
prints the current name, `pnpm dev` starts it, `pnpm dev:destroy` interactively
destroys it, and `pnpm dev:seed` destroys it with `--yes` before recreating and
starting it. The resolver is an Effect whose Git process, path, and
configuration capabilities come from Effect Platform. Package lifecycle
commands export its result through Alchemy's `ALCHEMY_STAGE` environment
variable; the lookup is case-sensitive and ignores uppercase `STAGE`.
`alchemy.run.ts` remains an ordinary stack definition. Generic deployment
commands are unchanged and do not invoke the development-stage resolver.

Repository tooling targets Node.js 24.18.0 or newer, as documented in
`package.json` engines. The stage script runs directly through Node's native
TypeScript support. Only the stage subprocess uses pnpm's silent flag;
ordinary pnpm commands retain their normal diagnostics.

An abandoned stage can be removed after its linked worktree is gone by
reconstructing the documented stage from the former user and directory name,
then running `pnpm destroy --stage <stage>` from another checkout. The generic
destroy command remains available for this explicit cleanup path. Existing
shared `dev_<user>` state is neither migrated nor automatically destroyed by
the worktree-scoped scheme.

There is no automated D1 data transfer. Seeds rebuild catalog and development
data; the current production owner account must be recreated manually.

### Dashboard data and editing

The dashboard's user and subscription data is a `getPreferences` router query.
Its schedule is a separate `getEvents` router query backed by authenticated
`GET /api/user/events`. The endpoint takes identity from the session and
timezone from the stored user, returns each subscription with its events and
participants, and sets `Cache-Control: no-store`. Core `Events.listForUser`
accepts the session's user ID and composes `Users.get`,
`Subscriptions.listForUser`, and concurrent `Events.listBySubject` calls,
querying active events from today's local midnight through the exclusive
midnight fourteen calendar days later. `SubscriptionTiming.localUtcRange` accepts
a day count and preserves local midnight boundaries across DST;
`localDayUtcRange` is its one-day wrapper. The UI flattens subscription events
into rows, deduplicates normalized participant sets within the same league and
start time, and sorts by start time then event ID, using the timezone already
loaded by `getPreferences` for dates and times.
The `/home` route preloads both private queries on the client only, because
the API cookie lives in the browser, so they load alongside the authenticated
shell's session check.
The dashboard has an `Errored` boundary but deliberately no `Loading`: its
pending read holds the transition, so the authenticated shell keeps its splash
(or blank screen) until the whole page can render with its data, under the same
200ms/400ms thresholds as the session check. The router keeps an entry only
while something reads it, or for a few seconds after, so private data doesn't
outlive the signed-in page. The form derives its saved roster and delivery
times from that data and initializes a separate draft when editing begins. Successful writes
revalidate preferences and events; cancelled or failed writes never replace it.

Signup and the dashboard editor share the `getSubjects` router query and the
presentational `ui/TeamPicker`. The `/home` route preloads the public catalog,
and the dashboard reads it from mount, not the picker that only mounts
while editing, so the entry stays cached and the editor opens without a second
fetch. Selection feedback lives beside the shared picker rather than under
signup.

## Testing and validation

API contract tests live in `packages/core/src/contracts/__tests__`, named for
their owning contract modules. The assembled HTTP API and its transaction
fixture live in `packages/api/src/__tests__`; auth and rate-limiter tests stay
beside those services. Browser typed-client tests live in
`packages/web/src/lib/__tests__`. HTTP write tests mock persistence and verify
orchestration, not database rollback.

- Schema-only and domain-only tests continue to run locally.
- The removed SQLite suites are represented by the behavior-focused [PostgreSQL persistence test plan](./test-plan/postgres.md). Reintroduce and prune those cases against disposable Alchemy-managed branches.
- The opt-in PostgreSQL infrastructure test deploys a disposable database and Worker stack, queries PlanetScale through Worker → Hyperdrive, and destroys the stack. It requires both provider credentials.
- Provider and network boundaries may use fakes.
- Behavior changes require focused tests covering the changed path.
- Repository-wide completion checks are `pnpm lint` and `pnpm typecheck`.

Transaction rollback integration tests must run only against disposable
Alchemy-managed PlanetScale branches. They remain opt-in because local database
substitutes are not representative of the production transaction path.

Catalog imports decode the checked-in data and validate feed references before
opening one transaction. By default, seeding skips events whose `startsAt` is
before yesterday at 00:00 UTC, using one cutoff for the import. Events exactly
at the cutoff are included. Filtering happens before database calls and also
removes feed references to skipped events from the import; existing historical
events, participants, and feed rows remain untouched. Correction imports can
explicitly use `seedCatalog({ strategy: "all" })` for the checked-in catalog, or
`seedCatalog({ collections, strategy: "all" })` for supplied data. The default
strategy is `"future"`. This cutoff applies only to seeding; shared
`Events.upsert` remains unrestricted. Event source IDs are resolved into feed edges while
that transaction serializes writes on its reserved PostgreSQL connection. This
deliberately trades import speed for full-catalog rollback and avoids concurrent
operations on one transaction connection. Seed Actions use the direct stage
role rather than a Worker or Hyperdrive connection, and catalog versions should
remain bounded so the transaction does not become an unbounded deployment
operation.

### Lint policy

Each package's `oxlint.config.ts` imports and extends the root config with
`extends: [base]`. `pnpm lint` keeps the recursive package workflow. The root
config enables `options.typeAware` using `oxlint-tsgolint`, so package scripts
and direct `oxlint` runs need no flag. Build dependent packages before linting,
as production CI already does. `pnpm typecheck` runs TypeScript 7 (native `tsc`) patched by `@effect/tsgo`;
Oxlint's native checker supplies lint diagnostics, not Effect language-service
diagnostics. The web config omits the obsolete `baseUrl` option while preserving
its relative `~/*` mapping.

The root config explicitly preserves the previous ESLint recommended and
TypeScript strict/stylistic type-checked rule policy, including unused `_`
exemptions and `type` declarations. `no-unnecessary-condition` and
`prefer-optional-chain` are explicitly enabled despite their nursery status in
the migration tool. Strict-mode-only `no-dupe-args` and `no-octal` have no Oxlint
equivalent. Prettier remains the formatter.

Anti-slop is vendored under `tooling/oxlint/anti-slop`, with revision
and licenses recorded there. Enabled rules reject chained assertions, unexplained
assertions, known-value widening, unsafe assertion round trips, broad object
parameters and unknown return/type-alias contracts, reflective property access
and calls, conditional empty-object spreads, and repeated eager array passes or
accumulator copying. `as const` does not require a safety comment.

The conditional-spread rule is locally tailored to require `exactOptional` for
optional field construction. It preserves property omission and expression-based
construction. `exactOptional` omits only `undefined`; truthy-only conditions must
still be represented explicitly, such as passing `enabled ? value : undefined`
to the helper. The rule provides no automatic rewrite because an
arbitrary condition may have different omission semantics. Local changes are
recorded in the vendored provenance file.

The adoption deliberately leaves these upstream policies disabled:

- Unknown input parameters, runtime `typeof`, and broad dictionaries require
  separate decisions about error/I/O boundaries and diagnostic metadata.
- Module mocking requires reviewing existing auth and Resend test seams.
- Shape naming requires reviewing exported configuration aliases.
- Spacing remains a formatting choice; adopting it would create an unrelated
  repository-wide whitespace diff.
- Effect-specific rules remain opt-in: tagged literals are legitimate encoded
  seed data, and constructor naming also matches plain functions such as
  `makeTiledHeadline`.

Two existing event-service tests retain narrowly suppressed chained assertions
for deliberately partial database fixtures. All remaining non-const assertions
must state their specific invariant in a nearby rule-qualified comment:
`lint(anti-slop/require-safety-comment-for-type-assertion): reason`. Moving those
tests to a full driver seam is a separate testing refactor.

## Follow-up work

Separate follow-ups are:

1. Implement the remaining PostgreSQL persistence test plan against disposable Alchemy-managed branches.
2. Evaluate Alchemy `Drizzle.Schema` and generated migrations after the explicit migration flow is stable.
3. Evaluate native PostgreSQL `UUID` and `TIMESTAMPTZ` columns independently of this migration.
4. Add account email/timezone editing. Cookie sharing
   across subdomains is intentionally still disabled; browser calls target the
   API origin with credentials.

## Public API

- `GET /api/user`: authenticated user's email and timezone.
- `POST /api/user`: save a new unverified user and subscriptions, then request a confirmation link; duplicate signup requests another link and returns 409 without changing preferences.
- `GET /api/user/subscription`: authenticated user's subscriptions with subjects.
- `POST /api/user/subscription`: replace the session user's one to four teams and fixed send time atomically; retained subscriptions preserve IDs and last-sent state.
- `POST /api/user/unsubscribe`: delete the authenticated user when no token is supplied, or the token owner for an unauthenticated email link.
- Better Auth `/api/auth/*`, subjects, feedback, and ping retain their existing routes.

Contracts follow OpenCode's instance HttpApi structure: each domain exports a
`*Api`, and `contracts/api.ts` composes them with chained `addHttpApi` calls.
The shared contracts remain in `core`; matching implementation files live in
`api/src/handlers` and export `*GroupLayer` layers built with `HttpApiBuilder.group`.
The API root provides each group layer directly, including `UserGroupLayer`
and `SubscriptionGroupLayer`.
Registration and unsubscribe contracts live with the user group in
`contracts/user.ts`. `UserApi` composes both groups and applies `/user` once;
the subscription group declares only `/subscription`. The generated
client exposes `user.get()`, `user.create()`, `user.unsubscribe()`, and
`subscription.list()` / `subscription.update()`. Read responses compose existing domain schemas;
there is no Account model. Identity comes exclusively from the session.

Browser API requests include credentials. API cookies remain host-only, so Web
SSR cannot assume it has the session cookie. After a browser verifies a session,
Web stores a non-authoritative local auth hint. A synchronous document script
uses that hint to replace-navigate root visits to `/home` before the SSR landing
page paints; the authenticated route still verifies the real session and clears
stale hints. In-app visits never paint the landing page for a signed-in session
either: the landing route renders nothing once the session is authenticated,
and the header wordmark links signed-in visitors to `/home`. The root route exposes sign-in through a query-driven modal, and
`/home` provides confirmation, sign-out, and unsubscribe entry points. The dashboard loads private preferences in the browser and shares its team
picker with signup. Its edit draft supports save/cancel, team removal, and send
time changes; account email/timezone editing remains separate work. Existing
emailed links land on Web `/unsubscribe/:token`, whose typed caller uses the
new endpoint; no legacy API alias is needed.

## Infrastructure dependencies

The infrastructure uses Alchemy beta.78, Effect rc.117,
and Drizzle rc.5. Platform and SQL packages share the same Effect version.
Effect rc.118 and stable 4.0 require a newer Drizzle build: the currently
supported build still references the removed SQL import paths and Schema APIs.
The Node platform's shared package is pinned to rc.117 because its dependency
range otherwise accepts the incompatible stable release.
Alchemy's PostgreSQL bridge uses the `Drizzle/Postgres` entrypoint; the
production migration ledger retains its existing table name. Standalone Vite
uses the matching `@alchemy.run/cloudflare-runtime` package. The API uses
Alchemy's `Http.Platform` layer for its fileless HTTP platform services.
