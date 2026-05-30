# Effect v4 And Engineering Practices

## Source Reference Policy

Use source first:

- `reference/effectv4/` is the primary Effect v4 source reference.
- `reference/opencode/packages/opencode/AGENTS.md` contains compact Effect v4 module and service rules.
- `reference/opencode/packages/opencode/specs/effect/migration.md` has practical service, scoped fiber, and cache patterns.
- `reference/t3code/package.json` and `reference/t3code/packages/effect-*` show another Effect v4 beta train with typed protocols and scoped fibers.
- `reference/effect/` is useful as library source/test evidence when it matches the current v4 API being used.

Use external docs or `effect-solutions` only as a last resort when local source references do not answer the question.

## Effect v4 Defaults

- Pin all Effect v4 packages used by the rewrite to the same beta train. While the prototype packages still depend on the v3 workspace catalog, `@dtpt/core-v2` may direct-pin its v4 packages locally so the old code does not break. Move v4 pins into the workspace catalog only after the prototype packages no longer need the v3 catalog.
- Prefer exact pins while Effect v4 is beta.
- Start the fresh build on v4 instead of migrating a large v3 surface later.
- Verify package APIs against local source references before writing code.
- Keep the Effect Language Service installed and patched.

## Service Patterns

Use Effect v4 `Context.Service`; do not use v3 `Context.Tag`, `Context.GenericTag`, `Effect.Tag`, or `Effect.Service` patterns.

Use `yield* Service` inside `Effect.gen` for service access by default so dependencies stay visible. Avoid `Service.use` as the normal access style; reserve it for narrow pipeline-style code where it is clearly more readable and does not hide dependencies across a larger program.

Use two service-definition styles intentionally:

- Stable boundary services with clear contracts, such as `Notifier`, `NotifierChannel`, and `NotifierChannelProvider`, should define an explicit interface/shape first, then define the service tag and live layer separately with `Layer.effect`.
- Inference-heavy services, especially Drizzle/database services where implementation details strongly shape method types, may define the service with `Context.Service` and inline `make`, then expose an explicit `layer` built from `Layer.effect(this, this.make)`.

Layer naming follows v4 conventions:

- Use `${Service}Layer` for exported concrete service layers that are imported beside the service tag, such as `UsersLayer`.
- Use descriptive suffixes for variants such as `layerTest`, `layerConfig`, or `layerMemory`.
- Do not use v3-style `Default`/`Live` names for new rewrite code.

Dependencies are wired through explicit `Layer.provide`/`Layer.provideMerge`; do not rely on v3 `dependencies` options.

Provide layers at entrypoints, tests, or package composition boundaries, not inside business logic.

## Error Patterns

Use `Schema.TaggedErrorClass` for domain/service errors that carry meaningful, branchable payloads.

Plain database failures should use shared infrastructure errors such as `DatabaseReadError`, `DatabaseWriteError`, `DatabaseDeleteError`, and `DatabaseTransactionError` where needed. Do not create service-specific wrappers like `UsersReadError` or `EventsWriteError` when the only meaning is that a database operation failed.

For the first implementation pass, map database failures inline at the query callsite so operation names and context stay explicit. Consider tiny shared helpers such as `toDbReadError` or `toDbWriteError` only after repetition is visible across services.

Use `Schema.Defect` for unknown external causes that should be serializable/loggable.

In `Effect.gen` and `Effect.fn`, prefer `yield* new MyError(...)` for direct typed-error branches.

Route and job boundaries translate domain/infrastructure errors into HTTP responses or logs. Domain and persistence services stay free of `HttpApiError` types.

At route/job boundaries, prefer `Effect.catchTag` or `Effect.catchTags` for tagged error mapping instead of manual `_tag` branching. Handlers may translate to another error, such as `HttpApiError.BadRequest`, or intentionally recover with a success value when the workflow semantics require it.

## Schema Patterns

Use `Schema.Class` for multi-field domain models. Use branded schemas for single-value ids and constrained scalar types.

Use Drizzle-derived schemas for persistence rows when the installed helper is Effect v4-compatible. Until then, define the Effect row schemas next to the Drizzle tables and keep the field objects shared so the row/domain shape does not drift. Domain schemas may alias persistence schemas when shapes are identical.

When a table's selected row is the domain entity, name the `createSelectSchema` result after the domain entity, such as `User`, instead of introducing a separate `UserRow` alias. Define a separate domain `Schema.Class` only when the domain shape intentionally differs from persistence.

Domain services treat the database as a persistence boundary: always decode reads before returning domain values and always encode schema-backed writes before passing values to Drizzle. This keeps app-level values such as `DateTimeUtc`, branded ids, and tagged JSON truthful end-to-end instead of relying on a field-by-field trust matrix.

Domain services accept decoded domain values, not raw API payload strings. Route, job, seed, and importer boundaries decode and normalize untrusted input first, then pass domain values into services. For fields on the same entity, type service inputs from the domain entity, such as `User["id"]`, `User["email"]`, `User["timezone"]`, and `User["unsubscribeToken"]`; use standalone scalar types such as `SubjectId` or `EventSourceId` when the value belongs to another entity or shared concept.

Rely on `drizzle-orm/effect-schema` helper typings to enforce refinement/override keys when calling `createSelectSchema`, `createInsertSchema`, or `createUpdateSchema` only after those helpers typecheck against Effect v4. Do not add a custom `satisfies` wrapper or helper unless the built-in type errors prove insufficient.

Name the local Drizzle effect-schema refinement/override object `domainOverrides` by default. Define reusable scalar schemas first, then reference them directly in `domainOverrides`; this keeps primitive definitions readable and importable. Share `domainOverrides` between `createSelectSchema` and `createInsertSchema` when the domain refinement is the same for reads and writes.

Every derived row/insert schema must include a single type-only table contract using `Check<TableSchemasMatch<...>>` from `lib/database/utils`. Put this contract near the top of the module after imports so it reads like a file annotation, not as part of the domain/schema definition flow. This catches drift between the schema encoded types and Drizzle's inferred table models while still keeping the schema definition readable.

Do not rely on callback overrides as a general optionality fix. In the current Drizzle Effect helper, callback overrides are useful for refining the derived base column schema, but refined insert fields with nullable/default table metadata can still infer as required. If a table contract fails for an optional/default refined field, split the insert overrides and encode that insert optionality explicitly with `Schema.optional(...)` / `Schema.UndefinedOr(...)` / `Schema.NullOr(...)`.

Split into explicit select and insert override objects when the domain shape differs by operation, or when a table contract proves the helper typings around optional/default columns need separate treatment.

Domain modules define both select and insert schemas for their tables because V1 services/tooling write each domain table. Do not define update schemas until a concrete update boundary exists.

Export schemas and their same-named TypeScript types together. Put the one-line type alias directly above the schema, even though it references the schema declared below; TypeScript erases the type and this keeps the exported type/schema pair easy to scan.

Do not export `decodeX`, `decodeXs`, or `encodeXInsert` helpers by default. Use `Schema.decodeUnknown(...)` and `Schema.encode(...)` directly at service/API boundaries, or create local helpers when the boundary expression is noisy, such as decoding arrays or projections.

Use schema `.make(...)` for trusted internal construction of decoded insert/domain objects. Use `.makeEffect(...)` when construction input is untrusted and validation failure should remain in the Effect error channel.

Use `Id.SchemaBranded("Brand")` for branded ids and `Id.createFromBrandedSchema(EntityId)` for effectful id generation. The ID module owns the UUID implementation detail so domain modules can speak in branded domain ids. Do not use raw `crypto.randomUUID()` in Effect workflows by default.

`makeEffect` does not replace effectful field generation. Generate effectful fields first, then pass the completed object to `.make(...)` or `.makeEffect(...)`.

For bulk reads, operate on collection schemas rather than looping decode per item. Decode queried arrays with `Schema.decodeUnknown(Schema.Array(SelectSchema))`.

For writes, prefer the simplest shape that matches row construction. If construction is pure, encoding a whole array is fine. If each row needs effectful fields such as generated ids, use a local `Effect.forEach` and encode each completed row at the boundary.

When row construction is effectful, keep build-then-encode local to the write method:

```ts
const inserts = yield* Effect.forEach(subjectIds, (subjectId) =>
  Effect.gen(function* () {
    return yield* encodeSubscription({
      id: yield* Id.createFromBrandedSchema(SubscriptionId),
      userId: input.user.id,
      subjectId,
      schedule: input.schedule,
      lastSentAt: null,
    });
  }),
);
```

Example:

```ts
import { Schema } from "effect";

import { Id } from "../../lib/domain/id.js";

export type SubjectId = typeof SubjectId.Type;
export const SubjectId = Id.SchemaBranded("SubjectId");

export type LeagueId = typeof LeagueId.Type;
export const LeagueId = Schema.Literal("nba").pipe(Schema.brand("LeagueId"));

export class SportTeamSubject extends Schema.Class<SportTeamSubject>(
  "SportTeamSubject",
)({
  _tag: Schema.Literal("sports_team"),
  leagueId: LeagueId,
  location: Schema.NonEmptyString,
  name: Schema.NonEmptyString,
  abbreviation: Schema.NonEmptyString,
  slug: Schema.optional(Schema.NonEmptyString),
}) {}

export class Subject extends Schema.Class<Subject>("Subject")({
  id: SubjectId,
  _tag: Schema.Literal("sports_team"),
  details: SportTeamSubject,
}) {}
```

## Effect Function Patterns

Prefer `Effect.fn("Domain.method")` over functions that return `Effect.gen(...)` for service methods and important effectful helpers.

Use `Effect.fnUntraced` for simple effectful helpers that do not need a trace name or will be executed inline. Plain local functions are still fine for pure helpers.

Avoid this pattern:

```ts
const notify = (input: NotifyInput) =>
  Effect.gen(function* () {
    // ...
  });
```

Prefer:

```ts
const notify = Effect.fn("Notify.run")(function* (input: NotifyInput) {
  // ...
});
```

For service methods and longer effectful helpers, prefer the two-call layout because it is easier to scan and formats cleanly:

```ts
const replaceForUser = Effect.fn("Subscriptions.replaceForUser")(function* (
  input,
) {
  // ...
});
```

For effectful iteration, prefer `Effect.forEach` over raw `for...of` loops. Omit default options such as `concurrency: 1` unless the code needs to call attention to sequencing.

Keep pure policy helpers narrow. For example, a due-check helper should answer whether a subscription is due; orchestration should decide whether a forced run bypasses that due check.

Use named domain policy objects when a rule is likely to vary by domain context, such as subscription subject allowance by user. Keep the object scoped to the owning domain language instead of creating generic policy namespaces.

```ts
yield* SubscriptionPolicy.subject.ensureAllowance(user, subjectIds.length);
```

Name intermediate values by domain meaning when it improves readability, such as `todayUtcRange` instead of a generic `range`.

Avoid throwaway aliases that are only used once and add no domain meaning. Prefer reading directly from the input object in the condition or callsite.

Use `Effect.tap`, `Effect.tapError`, or nearby logging combinators when the intent is to observe/log without changing the success or failure value. Use `catchAll`/`catchTag` when the intent is to recover or translate the error channel.

For expected workflow skip branches, direct logging returns are acceptable:

```ts
if (!options.force && !isDue) {
  return (
    yield *
    Effect.logInfo("notify: skipped not due", {
      subscriptionId: recipient.subscription.id,
      userId: recipient.user.id,
      subjectId: recipient.subscription.subject.id,
    })
  );
}
```

Extract a `skip(...)` helper only after repeated structured log context, reason handling, or stats updates make it worthwhile. Do not introduce typed errors or tagged result objects for normal skip branches unless another caller truly consumes those outcomes as data.

## Platform Service Patterns

Inside Effect code, always use Effect Platform or Effect services for effectful platform concerns instead of raw Node/browser APIs.

Examples:

- Use `FileSystem.FileSystem`, not `node:fs/promises`.
- Use `Path.Path`, not ad hoc path string manipulation.
- Use `HttpClient.HttpClient`, not raw `fetch`.
- Use `Config`, not direct `process.env` or `import.meta.env` reads.
- Use `Clock`/`DateTime`, not `Date.now()` or `new Date()`.

Raw platform APIs belong only inside narrow adapter layers when no Effect service exists.

## Persistence Patterns

- Keep SQLite and Drizzle as the first backend.
- Use snake_case table and column names to avoid constant string remapping.
- Define tables with the shared `sqliteTable` factory from `lib/database/drizzle/index` so snake_case configuration is applied consistently.
- Keep Drizzle table definitions close to owning domain modules or in a focused database schema module. Pick one layout and keep it boring.
- Generate insert/select/update schemas from Drizzle when the helper is Effect v4-compatible; otherwise define the row schemas beside the tables and share the same field object.
- Until official Drizzle SQLite Effect support is available in the pinned Drizzle version, keep the temporary SQLite/Effect compatibility code quarantined in `lib/database/drizzle/sqlite.ts`. The public consumer shape should match the expected official Effect driver shape: query builders are yieldable Effects, the `Database` service is injected through the database layer, and domain modules do not import or know about the shim. When official SQLite Effect support lands, deleting that shim should remove the temporary implementation details.
- Use JSON columns only for app-owned tagged payloads that do not need relational querying yet.
- Add relational columns only when queries require them.
- Keep query-critical generic event facts as columns, including `source_id`, `starts_at`, and `availability`.
- Event availability is source truth for active versus cancelled events. It is not a lifecycle field; past and future remain derived from `starts_at`.
- Keep seed/import code as tooling, not as part of runtime service APIs unless production code needs the same write method.
- Prefer Drizzle relational `.query` APIs for relation-shaped reads when they match the projection.
- Service methods return domain entities/projections, not raw Drizzle relation rows.
- For joined or relational reads, define top-level projection schemas/decoders and decode the final domain projection shape.
- Use small local shaping functions to convert Drizzle relation results into domain projection shapes. Avoid returning raw rows just to skip this conversion.
- Use `sql.withTransaction` at every multi-step write boundary that needs atomicity. Effect SQL stores transaction connections in context and composes nested transactions with savepoints, so higher-level workflows can also wrap service calls without passing transaction handles manually.

Canonical multi-step write shape:

```ts
const replaceForUser = Effect.fn("Subscriptions.replaceForUser")(function* (
  input: {
    readonly user: User;
    readonly subjectIds: readonly SubjectId[];
    readonly schedule: Subscription["schedule"];
  },
) {
  const subjectIds = Array.dedupe(input.subjectIds);

  yield* SubscriptionPolicy.subject.ensureAllowance(
    input.user,
    subjectIds.length,
  );
  yield* assertSubjectsExist(subjectIds);

  const inserts = yield* Effect.forEach(subjectIds, (subjectId) =>
    Effect.gen(function* () {
      return yield* Schema.encodeEffect(SubscriptionInsert)({
        id: yield* Id.createFromBrandedSchema(SubscriptionId),
        userId: input.user.id,
        subjectId,
        schedule: input.schedule,
        lastSentAt: null,
      });
    }),
  );

  yield* sql
    .withTransaction(
      Effect.gen(function* () {
        yield* database
          .delete(subscriptionsTable)
          .where(eq(subscriptionsTable.userId, input.user.id));

        if (Array.isReadonlyArrayEmpty(inserts)) return;

        yield* database
          .insert(subscriptionsTable)
          .values(inserts);
      }),
    )
    .pipe(
      Effect.catchTag(
        "SqlError",
        toWriteError("Subscriptions.replaceForUser", {
          userId: input.user.id,
          subscriptionCount: inserts.length,
        }),
      ),
    );
});
```

## Config And Runtime Patterns

- Use Effect `Config` for environment reads.
- Keep config parsing near the concern that owns the config.
- Define concern-owned config in a local `config.ts`; database config belongs under `lib/database/config.ts`, API/web URL config under `lib/config/`, and provider config near the provider implementation.
- Keep shared config-provider installation helpers in core, such as dotenv/env and Vite env helpers. Runtime entrypoints choose the source, such as the dotenv path or `import.meta.env`.
- Create `ManagedRuntime` values only at entrypoints and test harness boundaries.
- API, jobs, web, and scripts assemble their own runtimes. Web uses the Vite config provider. Node entrypoints use dotenv/env providers, and scripts may point database config at the repo/root `.env`.
- Use Effect Platform services for filesystem, path, HTTP, process, config, and time concerns inside Effect code.

## Fibers And Resources

- In Effect v4 beta references, `Effect.fork` and `Effect.forkDaemon` are not available.
- Use `Effect.forkScoped` for background work owned by the current scope.
- Use `Effect.forkIn(scope)` when a caller needs to place a fiber in a specific scope.
- Use `Effect.acquireRelease` or `Effect.addFinalizer` for resource cleanup.
- Use `Effect.cached` when concurrent callers should share one in-flight computation.

## API And Web Patterns

- Keep API contracts in `packages/core/src/contracts/` when both API and web consume them.
- Keep handlers thin: decode, rate limit, call domain service, map error.
- Do not duplicate policy constants in web. Import them from core.
- Web validation can mirror server validation, but server remains authoritative.

For API group handlers, follow the local opencode-style shape at a high level: one API-owned group layer per contract group, services acquired once around the handlers, and named `Effect.fn("GroupHttpApi.method")` handlers for route methods. Verify exact builder syntax against the pinned Effect version during implementation.

Public write handlers may orchestrate one V1 workflow directly. Keep API-specific concerns at the boundary:

1. Let the shared `HttpApi` contract decode the request payload.
2. Apply API rate limiting before starting database work.
3. Wrap multi-service writes in `sql.withTransaction` at the route workflow boundary.
4. Call table/domain services; do not introduce a workflow service for a single route by default.
5. Translate domain/infrastructure errors to declared public HTTP errors.

Keep error mapping local when it is only used by one route. Extract shared HTTP error helpers only after a second endpoint repeats the same public mapping.

## Testing Patterns

- Prefer behavior tests over implementation tests.
- Use `@effect/vitest` for Effect code.
- Prefer `it.effect` for effectful assertions and `it.layer` for suites that need shared services.
- Default to in-memory SQLite for fast service tests.
- Use scoped temporary SQLite files/layers for migrations, file path config, or behavior that depends on actual file persistence.
- Use small in-memory service layers for orchestration branch tests when real providers would obscure behavior.
- Schema tests should cover valid input, invalid input, and boundary cases.
- Time tests must cover timezone boundaries and DST.
- Notify tests must assert that failed sends do not update `last_sent_at`.

## Module Boundary Patterns

Avoid broad barrels in rewrite packages. Prefer explicit package subpath exports and direct module imports so module boundaries stay clear and imports do not eagerly evaluate unrelated code.

Only enforce this once the package setup supports the needed subpath exports.

Use `modules/` narrowly for product/domain capabilities, not for every service-shaped concern. A `Context.Service` does not automatically make something a module.

Recommended core layout:

```txt
packages/core/src/
  contracts/
    api.ts
    ping.ts
    signup.ts
    unsubscribe.ts

  modules/
    users/
      schema.ts
      service.ts
      __tests__/
        schema.test.ts
        service.test.ts
    subjects/
      schema.ts
      service.ts
      sports.ts
      __tests__/
        schema.test.ts
        service.test.ts
    events/
      schema.ts
      service.ts
    subscriptions/
      schema.ts
      service.ts
      time.ts
    notifier/
      schema.ts
      service.ts
      channels/
        service.ts
        email/
          schema.ts
          service.ts
          render.ts
      providers/
        service.ts
        email/
          resend.ts

  lib/
    database/
      schema.ts
      relations.ts
      service.ts
      config.ts
      errors.ts
    effect/
      config.ts
    config/
      api.ts
      web.ts
    ids.ts
```

Infrastructure, framework glue, generic utilities, and config-provider helpers belong under `lib/`. Database implementation belongs under `lib/database`, not `modules/database`.

Domain module tests live in module-local `__tests__/` folders so module roots stay focused on production schema, service, and supporting domain files. Library and infrastructure tests may stay colocated when that keeps the helper boundary easier to read.

Shared `HttpApi` contracts belong under top-level `contracts/`, not `lib/contracts`, because they are public cross-package boundary definitions rather than infrastructure helpers.

Checked-in seed data belongs in a private `@dtpt/data` package, not inside core source. Use explicit collection registration instead of filesystem scanning or dynamic import discovery. Collection folders use generic product-model filenames:

```txt
packages/data/src/
  index.ts
  sports/
    nba/
      index.ts
      subjects.ts
      events.ts
  umass/
    career/
      index.ts
      subjects.ts
      events.ts
```

Each collection `index.ts` exports one typed seed collection. `packages/data/src/seed/index.ts` exports the explicit registry consumed by seed tooling. `seed:dev` and `seed:prod` import all registered collections; adding a collection to the registry is the activation step. Keep seed orchestration in the seed scripts themselves until duplication proves a shared helper is worthwhile. `seed:prod` owns the interactive typed confirmation prompt.

The notifier module keeps its delivery abstractions inside `modules/notifier/`. Use `Notifier` for the orchestration-facing service in `modules/notifier/service.ts`. Define `NotifierChannel` as an injectable service boundary in `modules/notifier/channels/service.ts`, with concrete channel behavior under folders such as `modules/notifier/channels/email/`. Define `NotifierChannelProvider` as an injectable service boundary in `modules/notifier/providers/service.ts`, with provider implementations scoped by channel such as `modules/notifier/providers/email/resend.ts`. For V1, email is the only `NotifierChannel` and Resend is the first email `NotifierChannelProvider`.

A `service.ts` file may define either an abstract injectable service boundary or a concrete implementation. If it exports a `Context.Service` tag but no `layer`, runtime composition must provide a concrete layer from an implementation module. Do not use `service.ts` for shape-only files; pure shared data shapes belong in `schema.ts`, and protocol-like construction helpers may use `protocol.ts` when that name fits.

Keep table definitions in the owning domain module `schema.ts`. `lib/database/schema.ts` may re-export tables for Drizzle composition when needed.

Preserve the existing database composition pattern unless a concrete rewrite need forces a change: a database schema module bulk-imports/re-exports table definitions, a relations module defines Drizzle relations in one place, and a database service module composes the SQLite client and Drizzle layer. Keep the existing database layer naming style, such as `createDatabaseLayer` and `DatabaseLayer`, unless there is a concrete reason to change it. Update names/locations and Effect v4 compatibility as needed, but do not redesign this layering by default.

If `@effect/sql-drizzle` still needs a cast for relation-aware `.query` typing, isolate that cast inside `lib/database/service.ts` only. Domain services should consume the typed `Database` service without casts.

Define Drizzle relations only when they are needed for actual relation-shaped queries or natural hierarchical loads. Do not register every foreign key or automatically define both directions. Foreign keys can exist without a corresponding Drizzle relation. Keep `relations.ts` focused so it does not become a bloated mirror of every possible join.

Initial V1 relation set should support known queries only:

- `subscriptions -> user` and `subscriptions -> subject` for `Subscriptions.listNotificationRecipients()`.
- `events -> subjectEvents` for filtering and `events -> participants` for `Events.listBySubject()` returning active `EventWithParticipants` projections by default.

Do not initially define inverse user/subject relations unless a concrete query needs them. Adding a relation later is a small, acceptable change when implementing a CRUD-adjacent method or projection reveals the need.

## Documentation Patterns

- Keep one canonical spec and one canonical plan during the rebuild.
- Retire docs when they stop matching the implementation.
- Historical todo files are evidence, not instructions.
- Document decisions where they prevent repeating a known failed path.
