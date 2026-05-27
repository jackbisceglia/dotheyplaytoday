# Rewrite Glossary

This glossary describes a sports-league notification product designed with reusable recurring-notification scheduling concepts. It exists to keep the rewrite language precise while separating product scope from architecture shape.

## Language

**Recurring Notification Scheduling**:
The reusable scheduling model for deciding when a subscribed user should receive a notification.
_Avoid_: Generic product, reminder app

**V1 Product Scope**:
Sports-league notifications only.
_Avoid_: Generic notification product, all-purpose reminder engine

**Subject**:
Anything someone can subscribe to a feed of.
_Avoid_: Topic, team when speaking about the general model

**Event**:
Any scheduled unit of a subject feed that users may want to be notified about.
_Avoid_: Game when speaking about the general model, telemetry event

**Event Source Id**:
A stable source-provided event identity used for import upsert, formatted for readability as `<eventType>:<source>:<uuid>`.
_Avoid_: Derived game key, start-time identity

**Subject Event**:
The relationship that says an event belongs in a subject's feed.
_Avoid_: Participant link, subject-owned event

**Participant**:
An event-local participant record.
_Avoid_: Subject-event junction, feed link

**Participant Details**:
The type-specific facts about a participant in an event.
_Avoid_: Deriving relationship facts from subject or event details

**Subscription**:
A user's request to be notified about a subject, including when and how notifications should happen.
_Avoid_: Preference, alert

**Unsubscribe**:
The delete-based V1 action that removes a user and their subscriptions.
_Avoid_: Soft disable, per-subject unsubscribe

**Enabled Subscription**:
A soft pause/resume flag for a subscription.
_Avoid_: Modeling in V1 without a pause/resume workflow

**Unsubscribe Token**:
An opaque random bearer token stored on the user row that authorizes only the unsubscribe action.
_Avoid_: Auth session, account access token, public user id, email token

**Schedule**:
The executable timing policy for a subscription.
_Avoid_: Subscription details

**Fixed Local Schedule**:
A schedule that sends at a fixed time in the user's local day.
_Avoid_: Daily schedule

**Local Send Intent**:
The user's preferred wall-clock send time interpreted in their saved timezone.
_Avoid_: Stored UTC send time

**Global Event Time**:
An event start instant stored in UTC and converted to a user's timezone for local-date matching.
_Avoid_: Storing event time in user-local time

**Event Availability**:
Source-provided active/cancelled event availability used to exclude cancelled events from normal reads.
_Avoid_: Temporal lifecycle status, deriving cancellation from null start times

**Local Day UTC Range**:
The UTC interval that covers one user's local calendar day.
_Avoid_: Asking persistence services to understand user-local "today"

**Row-Level Discriminator**:
A database column that identifies which domain variant the whole row represents.
_Avoid_: Independent source of truth

**Subconcern Discriminator**:
A JSON `_tag` that identifies which variant a nested policy or value represents.
_Avoid_: Kind column for nested policy

**Subject Details**:
The type-specific facts for a subject.
_Avoid_: Sports columns or display fields on Subject

**Team Subject**:
A sports team represented as a subject in the V1 product scope.
_Avoid_: Team entity

**League**:
A supported sports competition used inside sports subject and sports event details.
_Avoid_: Separate top-level league entity in V1

**Sports Game Event**:
A scheduled sports game with participating team subjects.
_Avoid_: Generic event

**Event Payload**:
The type-specific facts for an event.
_Avoid_: Event blob

**Useful Abstraction**:
A generalized model that is populated by the V1 product scope and makes the system clearer without adding unused runtime workflows.
_Avoid_: Future-proofing, compatibility layer

**Notification**:
A prepared request to notify a user about due events for one subscribed subject.
_Avoid_: Email message, provider payload

**Subject-Scoped Notification**:
A notification produced for one user subscription to one subject.
_Avoid_: User-level digest

**Notification Recipient**:
A notification-oriented projection of a user and one subscription, with that subscription's subject loaded.
_Avoid_: recipients, getAllWithUsers

**Forced Notify Run**:
A dev/operator run that bypasses subscription timing and already-sent guards while still requiring same-day events.
_Avoid_: Sending eventless notifications

**Last Sent At**:
The UTC instant when a subscription last successfully delivered a notification.
_Avoid_: Last evaluated at

**Notifier**:
The service that sends a notification through the configured delivery channel.
_Avoid_: Email provider, Resend client, send method name

**NotifierChannel**:
The delivery-specific adapter that renders a notification and sends the rendered message.
_Avoid_: Provider

**NotifierChannelProvider**:
The vendor-specific adapter that sends an already-rendered channel message.
_Avoid_: Notification formatter

**Workflow Service**:
A service that names a multi-step use case such as signup, unsubscribe, or notify orchestration.
_Avoid_: Creating one for a single callsite by default

**Domain Projection**:
A named read model that returns related domain data for a real use case.
_Avoid_: Mechanical `withX` method names

**Infrastructure Error**:
A failure from a shared technical dependency such as the database.
_Avoid_: Service-specific wrappers with no added domain meaning

**Domain Error**:
A business or data-integrity failure that callers may branch on or map intentionally.
_Avoid_: Renaming database read/write failures per service

**Typed Config**:
Effect `Config` values and small derived effects that parse environment once through runtime-installed config providers.
_Avoid_: Direct `process.env` reads in services

## Relationships

- **Recurring Notification Scheduling** supports the **V1 Product Scope**.
- A **User** subscribes to one or more **Subjects**.
- A **Subject** includes zero or more **Events** through **Subject Events**.
- An **Event** belongs to one or more **Subjects** through **Subject Events**.
- An **Event** can have zero or more **Participants**.
- An **Event** has exactly one **Event Source Id** for V1 imports.
- A **Subject Event** has exactly one **Subject** and one **Event**.
- A **Participant** has exactly one **Participant Details** value.
- A **Subject** has exactly one **Subject Details** value.
- A **Subscription** belongs to one **User** and one **Subject**.
- A **Subscription** has exactly one **Schedule**.
- An **Enabled Subscription** is not part of V1.
- A **Schedule** stores **Local Send Intent**.
- An **Event** has one **Global Event Time**.
- An **Event** has one **Event Availability**.
- A **Local Day UTC Range** is derived from a user's timezone before querying events.
- A **Team Subject** is a kind of **Subject**.
- V1 launch seed data starts with NBA team subjects and sports game events.
- V1 stores league identity as `leagueId` in sports details; add a separate league table/FK only when the product needs richer league data.
- NBA team seed records include stable checked-in UUID subject ids; subject import/upsert uses those ids rather than deriving ids from mutable names or slugs.
- Keep NBA teams and NBA games as separate seed collections because teams are catalog/reference data and games are schedule/import data.
- Seed data uses a relational JSON shape: team records carry stable subject ids, and game records reference subject ids plus event-local participant details directly. Import validates and upserts from this structure instead of inferring identities from names, abbreviations, or slugs.
- Provide two seed flows: `seed:dev` may reset/import all development data, while `seed:prod` only touches catalog and schedule data and must not modify users or subscriptions. `seed:prod` is non-destructive, upsert-only for subjects, events, subject events, and participant records, and requires a typed CLI confirmation.
- Checked-in seed collections live in private `@dtpt/data` and are activated through an explicit registry. Seed commands import all registered collections; V1 registers only NBA.
- A **Sports Game Event** is a kind of **Event**.
- A **Sports Game Event** has exactly two **Participants**, one home and one away.
- An **Event** has exactly one **Event Payload**.
- A **Notification** is built from one **User**, one **Subscription**, one **Subject**, and one or more due **Events**.
- A **Subject-Scoped Notification** is the V1 notification unit.
- A **Notification Recipient** is the notify job's input projection.
- A **Forced Notify Run** is restricted by optional user filtering and still requires matching same-day events.
- **Last Sent At** changes only after successful notification delivery.
- A **Notifier** uses exactly one **NotifierChannel** for V1.
- A **NotifierChannel** renders a **Notification** into a channel message and sends it through a **NotifierChannelProvider**.
- An **Unsubscribe** removes one **User** and cascades to that user's **Subscriptions**.
- An **Unsubscribe Token** authorizes one global **Unsubscribe** action.
- An **Unsubscribe Token** resolves to one **User** by matching the user's stored token.
- A **Workflow Service** is deferred until a workflow has more than one callsite or a clear testability win.
- A **Domain Projection** is named by meaning, not by SQL join mechanics.
- An **Infrastructure Error** may be returned by any service that uses that dependency.
- A **Domain Error** is introduced only when it carries behaviorally meaningful information.
- A **Useful Abstraction** must be exercised by the **V1 Product Scope**.
- **Typed Config** is defined near the owning concern in core and consumed through package runtime layers.

## Resolved Model

```txt
User -> Subscription -> Subject
Subject <- Subject Event -> Event -> Participant
```

V1 sports-league notifications populate this model with team subjects and sports game events. Future subject families can link events into subject feeds without requiring every subject-feed relationship to be a participant.

**User** is persisted as recipient identity plus delivery timezone and unsubscribe token. Unsubscribe hard-deletes this row; re-signup creates a fresh user and unsubscribe token.

```ts
type User = {
  readonly id: UserId;
  readonly email: EmailAddress;
  readonly timezone: TimeZone;
  readonly unsubscribeToken: UnsubscribeToken;
};
```

**Subject** is persisted as identity plus type-specific details:

```ts
type Subject = {
  readonly id: SubjectId;
  readonly _tag: SubjectDetails["_tag"];
  readonly details: SubjectDetails;
};

type SubjectDetails = {
  readonly _tag: "sports_team";
  readonly leagueId: LeagueId;
  readonly location: string;
  readonly name: string;
  readonly abbreviation: string;
  readonly slug?: string;
};
```

**Event** is persisted as a scheduled thing plus type-specific details:

```ts
type Event = {
  readonly id: EventId;
  readonly _tag: EventDetails["_tag"];
  readonly sourceId: EventSourceId;
  readonly startsAt: DateTimeUtc;
  readonly availability: EventAvailability;
  readonly details: EventDetails;
};

type EventDetails = {
  readonly _tag: "sports_game";
  readonly leagueId: LeagueId;
};
```

**Subject Event** is persisted as the edge between a subject feed and an event:

```ts
type SubjectEvent = {
  readonly eventId: EventId;
  readonly subjectId: SubjectId;
};
```

**Participant** is persisted as an event-local participant record:

```ts
type Participant = {
  readonly id: ParticipantId;
  readonly eventId: EventId;
  readonly _tag: ParticipantDetails["_tag"];
  readonly details: ParticipantDetails;
};

type ParticipantDetails = {
  readonly _tag: "sports_game";
  readonly role: "home" | "away";
  readonly title: string;
};
```

Participants are event-local one-off records. They do not carry subject-derived identity in V1. The subject-feed edge remains `SubjectEvent`. `Participant._tag` selects the JSON details shape for that participant domain. Sports-game participants start with `role` and `title`; future participant tags define their own details instead of inheriting sports fields.

**Subscription** connects a user to a subject and owns executable notification timing:

```ts
type Subscription = {
  readonly id: SubscriptionId;
  readonly userId: UserId;
  readonly subjectId: SubjectId;
  readonly schedule: Schedule;
  readonly lastSentAt: DateTimeUtc | null;
};

type Schedule = {
  readonly _tag: "fixed_local_time";
  readonly sendAtSecondsLocal: number;
};
```

`sendAtSecondsLocal` is local wall-clock intent in the user's saved timezone. It is not converted to and stored as UTC because the user means "send at this local time," including across DST boundaries.

Event `startsAt` values are global UTC instants. Notify converts each event start into the user's timezone and compares the resulting local date with the user's local notification date.

Event `availability` values are source truth for active versus cancelled events. They are not a temporal lifecycle; past/future is always derived from `startsAt`. Normal event reads filter to active events by default.

## Persistence Rules

- Row-level discriminated values use top-level `_tag` as a query/index projection and keep the real Effect discriminator in `details._tag`.
- For row-level discriminated values, top-level `_tag` must equal `details._tag`.
- Nested discriminated subconcerns such as `schedule` keep their own `_tag` and do not need a table-level `_tag`.
- Generic/query-critical facts stay as columns, such as `events.source_id`, `events.starts_at`, `events.availability`, `subject_events.subject_id`, `subscriptions.user_id`, and `subscriptions.subject_id`.
- Type-specific facts stay in JSON details, such as sports team league/name fields, sports game league, and participant title/role facts.

## Import Semantics

V1 imports use one authoritative source per event kind. The importer populates the relational event graph and never duplicates a real game per subscribed subject.

Rules:

- `events.source_id` is a stable source-provided identity used for upsert and has readable format `<eventType>:<source>:<uuid>`.
- V1 sports seed data uses source ids such as `sports_game:seed:<uuid>`.
- NBA game seed records include explicit stable event source ids.
- `source_id` must not be derived from mutable schedule facts such as start time, game date, or participants.
- Re-importing the same source id updates mutable event facts such as `starts_at`, `availability`, and details, ensures the relevant subject feed links exist, and replaces that event's participant records.
- Missing events in a seed collection are not deleted. Cancellation must be represented explicitly with `availability: "cancelled"`.
- Sports game imports must resolve home and away team feed subjects before writing subject events.
- `Subjects.addEventToFeed` relies on subject and event foreign-key constraints for feed-edge integrity; it does not create subjects or events.
- `Events.setParticipants` replaces only the event-local participant records with the provided list, which may be empty; it relies on the event foreign-key constraint when inserting participant rows and does not create subjects or subject events.
- API/admin command handlers that need user-facing not-found or authorization semantics should read the relevant parent row before calling leaf writes.
- Sports game imports write exactly two participants, one `home` and one `away`.
- If the same source id points to unexpectedly different participants, import should fail or log an explicit data-integrity error instead of silently changing identity.
- V1 does not attempt cross-source dedupe; switching event sources is a migration/reconciliation task.

## Notification Interfaces

Notify orchestration assembles a prepared notification inline after loading the subscription recipient, subject, and same-day events, then calls the notifier. Channels own rendering and providers own vendor payload delivery.

```ts
type Notification = {
  readonly user: User;
  readonly subscription: Subscription;
  readonly subject: Subject;
  readonly events: NonEmptyReadonlyArray<EventWithParticipants>;
};

type EventWithParticipants = Event & {
  readonly participants: ReadonlyArray<Participant>;
};
```

`lastSentAt` records successful notification delivery only. A due evaluation that finds no same-day events does not update `lastSentAt`.

```ts
interface Notifier {
  readonly notify: (
    notification: Notification,
  ) => Effect.Effect<void, NotifierError>;
}
```

```ts
interface NotifierChannel<Rendered> {
  readonly render: (notification: Notification) => Rendered;
  readonly send: (message: Rendered) => Effect.Effect<void, NotifierError>;
}
```

```ts
type EmailMessage = {
  readonly to: EmailAddress;
  readonly subject: string;
  readonly text: string;
  readonly html: string;
};

interface NotifierChannelProvider<Rendered> {
  readonly send: (
    message: Rendered,
  ) => Effect.Effect<void, NotifierProviderError>;
}
```

```txt
notify orchestration -> Notifier -> NotifierChannel -> NotifierChannelProvider
```

For V1, the configured `NotifierChannel` is email. Notify orchestration constructs a prepared `Notification` and calls `Notifier.notify(notification)`. The notifier delegates to the configured channel: `NotifierChannel.render(notification)` creates a rendered message, then `NotifierChannel.send(message)` sends it through the provider. The email channel renders `Notification` into `EmailMessage`; the provider maps `EmailMessage` to a vendor API such as Resend. `NotifierChannel.render` is pure: it takes a prepared `Notification` and produces the channel-specific rendered message.

Do not add a notification builder/projection service in V1. Inline assembly is only object construction from data already loaded by notify. Extract a builder only after a second callsite, channel-specific data divergence, or concrete testability/readability win appears.

The delivery design is generic, but V1 runtime wiring provides exactly one email `NotifierChannel`. A future SMS channel should be addable by implementing another `NotifierChannel` and supplying its layer at the runtime edge, without changing notify orchestration unless SMS needs different notification data.

Keep `NotifierChannel.render` pure in V1. If rendering later needs real failure/effect cases, make the render boundary effectful in that slice.

Email rendering builds unsubscribe links from channel/web config plus `notification.user.unsubscribeToken`. Notify orchestration does not construct public URLs. Extract a shared link helper only when multiple channels need the same link construction.

Email channel providers accept the app-level `EmailMessage` shape. Provider implementations map `EmailMessage` to vendor SDK payloads such as Resend or SES; email rendering never emits vendor-specific payloads.

V1 sends one subject-scoped notification per due subscription. If a user subscribes to both subjects in the same game, they may receive two emails for that game. Per-user or per-game deduplication is a follow-up issue, not part of the first rebuild.

If one subscribed subject has multiple same-day events, such as a doubleheader, V1 sends one subject-scoped notification containing all of those events rather than one email per event.

Notify uses subscription-first orchestration:

1. Load subscription notification recipients through `Subscriptions.listNotificationRecipients()`.
2. For each recipient, evaluate due time in application code.
3. Skip recipients already sent on the user's current local date.
4. Compute the user's **Local Day UTC Range**.
5. Load same-day events with `Events.listBySubject(subjectId, { range })`.
6. Skip recipients with no same-day events.
7. Send a subject-scoped notification.
8. Mark the subscription sent only after successful non-dry-run delivery.

Notify CLI flags:

- `--dry-run`: evaluate and log what would happen without provider delivery or `last_sent_at` updates.
- `--user <email>`: process only recipients for the normalized email address.
- `--force`: bypass subscription timing and already-sent guards. It does not bypass the same-day event requirement, and successful real sends still update `last_sent_at`.

Rules:

- `--user <email>` uses the same email normalization as signup.
- `--user <email>` with no matching user is a clean no-op with a log.
- `--force` does not bypass unsubscribe; hard-deleted users have no recipients.
- `--dry-run --force` sends nothing and updates nothing, but logs what force would send.
- Database selection stays in environment/config/layers, not notify CLI flags.
- Notify logs skip reasons, provider failures, `markSent` failures, and run start/end counts.

## Read Surface

Each entity service owns its own table and its own queries. Cross-entity queries live on the service whose table is being asked about, not on the parent entity service.

```ts
Subjects.get(
  subjectId: SubjectId,
): Effect<Subject, SubjectNotFound | DatabaseReadError>;

Events.listBySubject(
  subjectId: SubjectId,
  opts?: {
    range?: { fromUtc: DateTimeUtc; toUtc: DateTimeUtc };
    availability?: "active" | "cancelled" | "all";
  },
): Effect<ReadonlyArray<EventWithParticipants>, DatabaseReadError>;
```

Rules:

- Aggregates are projections, not the default load shape. `Subjects.get` does not return events.
- `Events` owns event reads/writes and participant writes, and exposes subject-scoped queries through `subject_events`.
- `Subjects.addEventToFeed` owns writing the `subject_events` feed edge; `Subjects.get` and `Subjects.list` still do not return events.
- `Events.listBySubject` accepts an optional UTC range and optional availability filter, defaults to `availability: "active"`, and orders results by ascending `startsAt`.
- `Events.listBySubject(subjectId, { availability: "all" })` is reserved for tooling or explicit admin/debug reads; notify does not use it.
- `Events.listBySubject` uses `event.id` as a stable tiebreaker after `startsAt`.
- Timezone conversion is the caller's responsibility through a shared time utility; service queries stay UTC-only.
- New per-window methods such as "today" or "this week" are not added until a real second use case appears.

Shared time utility:

```ts
SubscriptionTiming.localDayUtcRange(input: {
  nowUtc: DateTimeUtc;
  timezone: TimeZone;
}): { from: DateTimeUtc; to: DateTimeUtc };
```

Notify computes the user's local day UTC range and uses it to call `Events.listBySubject`. `Events` does not know what "today" means for a user.

## Service Boundaries

V1 keeps table/domain ownership in services and leaves one-off workflow orchestration at the callsite.

Services:

- `Users` owns `users` reads/writes, including signup upsert, unsubscribe-token lookup, and user deletion.
- `Subjects` owns `subjects` reads and `subject_events` feed-edge writes.
- `Events` owns `events` and `participants`, including event import upsert and subject-scoped event queries through `subject_events`.
- `Subscriptions` owns `subscriptions`, including user replacement, notify listing, and sent markers.
- `Notifier`, `NotifierChannel`, and `NotifierChannelProvider` own notification delivery boundaries.

Callsite workflows:

- Signup route orchestrates `Users` and `Subscriptions` inside one transaction.
- Unsubscribe route orchestrates token lookup and user deletion inside one transaction.
- Notify job orchestrates due checks, event loading, notification sending, and sent markers.

Rules:

- Do not add `SignupService`, `UnsubscribeService`, or `NotifyService` in the first rebuild.
- Extract a workflow service only when there is more than one callsite or a concrete testability/readability win.
- Avoid inline database joins in jobs/routes when a table-owning service should expose the query.

Naming rules:

- `get(id)` reads one entity by primary id.
- `getByX(value)` reads one entity by another unique key.
- `list(input?)` reads many entities, optionally filtered.
- `listByX(input)` reads many entities scoped by a foreign/domain key.
- Domain projections use meaning-based names, such as `Subscriptions.listNotificationRecipients()`, instead of mechanical names like `getAllWithUsers()`.
- Generic write names are allowed only when the operation is simple and invariant-light; V1 favors domain writes for invariant-bearing operations.
- Prefer direct domain scalar arguments for small method surfaces. Use an input object when the parameters form a named payload or range, or when the operation naturally carries a multi-field command.

Service methods accept decoded domain values, not raw API payload strings. Route, job, seed, and importer boundaries decode and normalize untrusted input first, then pass domain values such as `User["email"]`, `User["timezone"]`, `SubjectId`, or `EventSourceId` into services.

V1 service surface:

```ts
Users.get(userId);
Users.getByEmail(email);
Users.getByUnsubscribeToken(token);
Users.listByIds(userIds);
Users.upsertForSignup(email, timezone);
Users.remove(userId);

Subjects.get(subjectId);
Subjects.list();

Events.get(eventId);
Events.listBySubject(subjectId, opts);
Events.upsert(event);
Events.setParticipants(eventId, participants);

Subjects.addEventToFeed(input);

Subscriptions.list();
Subscriptions.listNotificationRecipients();
Subscriptions.replaceForUser({ user, subjectIds, schedule });
Subscriptions.markSent(input);
```

This follows the style seen in the local `reference/opencode` and `reference/t3code` repos: predictable read names, boundary-level decode, domain-value service inputs, meaning-based projections, and domain write names when the operation carries business invariants.

`Subscriptions.listNotificationRecipients()` returns the notify input projection:

```ts
type NotificationRecipient = {
  readonly user: User;
  readonly subscription: Subscription & {
    readonly subject: Subject;
  };
};
```

`Subscriptions.listNotificationRecipients()` orders by `subscription.id` ascending. The order has no domain meaning; it exists for deterministic logs and tests.

## API And Web Contracts

Shared API request/response schemas live in `packages/core/src/contracts/` as the Effect `HttpApi` contract. The API package implements that contract, and the web package consumes it through the generated/typesafe client. V1 exposes `GET /api/ping`, `POST /api/signup`, and `POST /api/unsubscribe` only.

Only change the internals of `packages/api` and `packages/web` when needed for the rewrite. Existing scaffolding, package shape, and app/server surfaces do not need to change unless a core contract decision requires consumers to update. Detailed API/web decisions are tracked in `docs/rewrite/api-web-contract.md`.

`POST /api/signup` accepts the full replacement signup payload and returns `{ ok: true }` on success. `POST /api/unsubscribe` accepts an opaque unsubscribe token and returns `{ ok: true }` for terminal outcomes without revealing whether the token matched a user.

Public write endpoints are rate limited at the API boundary. The first rebuild should keep the policy IP-scoped and provider/configuration-backed rather than leaking a rate-limit store into route contracts.

The landing page mirrors shared validation policies for responsiveness, but the API is authoritative. Success copy must explain that resubmitting with the same normalized email replaces previous preferences. The unsubscribe confirmation page must not look up tokens on `GET`; malformed token-shaped path params return `404`.

## Runtime And Config

Preserve the current config architecture during the rewrite.

Rules:

- Define typed Effect `Config` structs near the concern that owns the value, usually in core modules such as API URL, web URL, database, or provider config. Database config lives under `packages/core/src/lib/database/config.ts`. Do not create one giant central config file.
- Keep shared helpers in core that install config providers from environment sources, such as dotenv for Node runtimes and Vite env for Vite apps. Runtime callsites supply source-specific inputs like the dotenv path or `import.meta.env`.
- Non-library packages such as `api`, `jobs`, `web`, and scripts define their own `ManagedRuntime` assembly. They install the appropriate config provider, platform layers, and live/default service layers once at the runtime boundary.
- Core scripts use their own script runtime assembly rather than borrowing API or jobs runtime setup.
- Services and handlers consume typed config values/effects; they do not read `process.env` or `import.meta.env` directly.
- Derived values such as public URLs or bound ports should remain typed derived effects instead of being recomputed ad hoc at callsites.
- Harmless local/dev values such as local ports or local SQLite paths may have defaults. Secrets and provider credentials must not have defaults.
- Do not compress config into untyped global objects or package-local env parsing during the rewrite.

## Module Organization

Use `modules/` narrowly for product/domain capabilities, not for every service-shaped concern. A `Context.Service` does not automatically make something a module.

Infrastructure, framework glue, generic utilities, and config-provider helpers belong under `lib/`. Database implementation belongs under `lib/database`, not `modules/database`. Domain table definitions stay in the owning module `schema.ts`; `lib/database/schema.ts` may re-export tables for Drizzle composition when needed.

Shared `HttpApi` contracts belong under top-level `contracts/`, not `lib/contracts`, because they are public cross-package boundary definitions rather than infrastructure helpers.

Checked-in seed data belongs in private `@dtpt/data`, not inside core source. Use explicit collection registration instead of filesystem scanning or dynamic import discovery. Collection folders use generic product-model filenames such as `subjects.ts` and `events.ts`; seed scripts import the registry directly and write through domain services.

Preserve the existing database composition pattern during the rewrite: bulk table exports for Drizzle schema composition, one relations module, and one database service/layer module that composes SQLite plus Drizzle. Keep existing database layer naming such as `createDatabaseLayer` and `DatabaseLayer` unless a concrete rewrite need forces a change. Any relation-aware Drizzle type cast belongs inside the database service module, not domain services.

Until official Drizzle SQLite Effect support is available in the pinned Drizzle version, any temporary SQLite/Effect compatibility shim belongs under `lib/database` and must be invisible to domain modules. The desired consumer shape is the official-driver shape: query builders are yieldable Effects and callers depend on the injected `Database` service, not shim internals.

Define Drizzle relations only for relation-shaped queries the product actually needs or natural hierarchical loads. Do not register every foreign key or automatically define bidirectional relations.

Initial V1 relations support `Subscriptions.listNotificationRecipients()` and `Events.listBySubject()`: subscription-to-user, subscription-to-subject, event-to-subject-events, and event-to-participants. Add more relations only when a concrete query needs them.

Domain services always decode database reads through the relevant Effect schema before returning domain values and always encode schema-backed writes before passing values to Drizzle. This preserves truthful app-level values such as `DateTimeUtc`, branded ids, and tagged JSON rather than relying on raw Drizzle inference field by field.

Use `sql.withTransaction` at every multi-step write boundary that needs atomicity. Effect SQL composes nested transactions through context/savepoints, so higher-level workflows can also wrap service calls without passing transaction handles manually.

## Testing

Use `@effect/vitest` as the test harness for Effect code. Prefer `it.effect` for effectful assertions and `it.layer` for suites that need shared services.

Persistence tests should exercise real schemas/services against cheap SQLite test databases instead of mocking repositories. Default to in-memory SQLite for fast service tests. Use scoped temporary SQLite files/layers when testing migrations, file path config, or behavior that depends on actual file persistence.

Mocks/fakes are acceptable at external provider or network boundaries, such as email provider clients, but should not replace persistence or domain services when SQLite is cheap to spin up and tear down.

## Error Model

Use shared infrastructure errors for plain database failures and service/domain errors only for meaningful business or integrity failures.

Shared database errors:

- `DatabaseReadError`
- `DatabaseWriteError`
- `DatabaseDeleteError`
- `DatabaseTransactionError` when a transaction boundary needs distinct reporting

Rules:

- Do not create `UsersReadError`, `SubjectsReadError`, `EventsReadError`, or `SubscriptionsReadError` when the error only means a database read failed.
- Do not create service-specific write wrappers when `DatabaseWriteError` communicates the failure accurately.
- Database errors include operation/context metadata for logs and traces.
- Create domain errors when callers branch differently or public/API mapping needs a distinct case.
- Domain errors describe business or data-integrity problems, not the table operation that failed.
- Service methods may return both domain errors and shared infrastructure errors.

Examples:

```ts
Subjects.get(
  id: SubjectId,
): Effect<Subject, SubjectNotFound | DatabaseReadError>;

Subscriptions.replaceForUser({ user, subjectIds, schedule }): Effect<
  void,
  InvalidSubjectSelection | SubjectCapacityReached | DatabaseWriteError
>;

Subjects.addEventToFeed(input): Effect<
  void,
  DatabaseWriteError
>;

Events.setParticipants(eventId, participants): Effect<
  void,
  DatabaseWriteError
>;
```

## Signup Semantics

Signup is the only write surface for users and subscriptions in V1. There is no auth, no separate edit/delete flow, and no preferences read endpoint.

Submitted payload contains the V1 signup inputs: email, timezone, fixed local schedule, and selected subject ids. The exact public request schema belongs to `packages/core/src/contracts/` and should be chosen during implementation from the pinned Effect `HttpApi` API.

Server behavior, inside one transaction:

1. Normalize email.
2. Upsert user by normalized email; always overwrite `timezone`; generate `unsubscribeToken` only for a new user and preserve it on resubmission.
3. Delete all subscriptions for the user.
4. Insert one subscription per submitted `subjectId` with the submitted `schedule` and `lastSentAt = null`.

Rules:

- Submitted `subjectIds` is the full replacement set.
- `lastSentAt` is not preserved across resubmissions; a deliberate resubmit may produce a duplicate email same day.
- Wipe and recreate is intentional; no create/retain/delete diffing in V1.

## Unsubscribe Semantics

Each email links to `GET /unsubscribe/:token`. The token is an opaque random bearer value stored on the user row. It contains no structured payload and exposes neither the user's primary id nor email address.

```ts
type UnsubscribeToken = string & Brand<"UnsubscribeToken">;
```

Rules:

- Unsubscribe tokens are generated with cryptographic randomness. UUIDv4 or a stronger URL-safe random value is acceptable for V1.
- Store the raw unsubscribe token on the user row and enforce uniqueness; do not store or put a token hash in the URL for V1.
- Unsubscribe tokens do not expire or rotate in V1 so old notification emails remain usable.
- The unsubscribe token has no embedded payload, timestamp, signature, or expiry in V1.
- `GET /unsubscribe/:token` renders a confirmation page for token-shaped input, does not look up the token in the database, and does not mutate subscriptions.
- The confirmation form posts the token to the unsubscribe endpoint without requiring email address re-entry in V1.
- The unsubscribe endpoint resolves the user by `unsubscribeToken` and hard-deletes the user row; subscriptions cascade from the user delete.
- Repeated posts for a token whose user was already deleted return the same generic terminal result.
- Unknown or malformed tokens map to a generic public failure result.

## Example Dialogue

> **Dev:** "Is V1 a generic recurring notification product?"
> **Domain expert:** "No — V1 is sports-league notifications only, but the scheduling architecture should avoid sports-only dead ends."

> **Dev:** "Should we make a Team table and a Game table?"
> **Domain expert:** "Not as the core model. Use Subject and Event, then represent teams and games as sports-league cases of those concepts."

> **Dev:** "Does an Event belong directly to one Subject?"
> **Domain expert:** "No — Events belong to subjects through subject events. A sports game links to its team subjects, and a later category subject such as NBA playoffs can link to the same event without becoming a participant."

> **Dev:** "Can home/away be derived from team and event locations?"
> **Domain expert:** "No — home/away is an event-local participant fact, so it belongs on Participant details."

> **Dev:** "Should send time be subscription details?"
> **Domain expert:** "No — schedule is an executable timing policy, not descriptive details."

> **Dev:** "Should the schedule union include event-relative reminders now?"
> **Domain expert:** "No — store schedules as an extensible union, but V1 only includes fixed local schedules until relative reminders are implemented."

> **Dev:** "Should league live directly on Subject?"
> **Domain expert:** "No — league is part of sports-team subject details, not a generic subject property."

> **Dev:** "Who formats notification copy?"
> **Domain expert:** "The notifier channel formats. Notifier channel providers only send already-rendered channel messages."

## Flagged Ambiguities

- "V1" was used to mean both sports-league product scope and a broader generic notification product. Resolved: V1 product scope is sports-league notifications only; architecture may still use recurring-notification scheduling abstractions when they are exercised by sports-league use cases.
- "topic" was technically correct but too vague to retain intent over time. Resolved: use **Subject** for the thing a user subscribes to.
- "team" and "game" are useful V1 words, but the core model should use **Subject** and **Event** unless the discussion is specifically about sports-league behavior.
- Sports-specific properties such as league belong to **Subject Details**, not the generic **Subject** shape.
- The database owns **Subject Details**; V1 can group decoded sports subjects by league in memory instead of adding league-specific SQL columns or subtype tables.
- The generic **Subject** shape has only identity and discriminator fields; display, league, slug, and abbreviation live in **Subject Details**.
- "event" is clearer than alternatives like "occurrence" for day-to-day code, but it should be documented as subject-owned to avoid confusion with telemetry, webhooks, or domain events.
- "event" is not owned by exactly one **Subject**. Resolved: use **Subject Event** as the generic feed link between **Subject** and **Event**.
- Event-local participant facts such as home/away and title belong to **Participant Details**, not **Subject Details** or **Event Payload**.
- Sports-specific event facts such as league belong to **Event Payload**, while SQL-critical generic event facts such as start time stay on **Event**.
- Import identity belongs to `events.source_id`, not JSON details, and is stable source identity rather than a key derived from schedule facts.
- Event availability belongs to `events.availability`; it is active/cancelled source truth, not a temporal lifecycle. Past/future stays derived from `events.starts_at`.
- V1 uses one authoritative source per event kind and does not attempt cross-source dedupe.
- Subscription timing is called **Schedule** because it is executable policy used by the notify job, not descriptive details.
- **Schedule** is modeled as a tagged union, but V1 includes only **Fixed Local Schedule**. New scheduling models should be added by extending the union and updating the explicit schedule evaluation callsites.
- User send preferences are stored as local wall-clock intent in the user's timezone; event start times are stored as UTC instants and converted to the user's timezone for same-day checks.
- Same-day event queries use a caller-computed **Local Day UTC Range**; event services accept UTC ranges only.
- **Subject**, **Event**, and **Participant** use a **Row-Level Discriminator** because the whole row is the discriminated value.
- **Schedule** uses a **Subconcern Discriminator** because it is a nested executable policy stored inside a subscription row.
- Row-level tables use top-level `_tag` as a query/index projection of `details._tag` when the details tag represents the whole row.
- When `details._tag` represents the whole row, top-level `_tag` must equal `details._tag`.
- Nested subconcerns such as **Schedule** keep their own `_tag` inside JSON and do not require a row-level `_tag` column.
- **Notifier** sends prepared **Notifications**; it does not decide which subscriptions are due.
- The notifier method is `notify(notification)`; `send` is reserved for channel/provider delivery of rendered messages.
- **NotifierChannel** owns pure render plus send for a delivery medium.
- `NotifierChannel.render` is pure in V1; effectful rendering is deferred until there is a concrete failure/effect case.
- Email unsubscribe link construction belongs to rendering/channel code, not notify orchestration.
- Email provider implementations map generic `EmailMessage` values to vendor-specific SDK payloads.
- Delivery interfaces are generic over channels, but V1 runtime wiring is one concrete email channel.
- V1 does not specify provider retry/backoff; provider failures are surfaced as effect errors and logged.
- **NotifierChannelProvider** does not render notification copy; it only maps rendered channel messages to a vendor API.
- The notify job is a runnable script that orchestrates due subscriptions through domain services and the **Notifier**; cron/recurrence is an infrastructure concern outside the application.
- Notify orchestration delegates graph queries to domain services rather than inlining database joins in the job.
- Unsubscribe is global and hard-delete based in V1; there is no per-subject unsubscribe or soft-disable preference.
- Subscription rows do not have `enabled` in V1; hard-delete unsubscribe is the only stop-notifications workflow.
- `last_sent_at` is a successful-delivery marker, not a last-evaluated marker; no-event evaluations do not update it.
- `Subscriptions.markSent({ subscriptionId, sentAt })` is the only V1 write surface for `last_sent_at`; do not add a generic subscription `update()` method.
- V1 sends one notification per due subscription/subject; per-game dedupe for users subscribed to both teams is deferred.
- Multiple same-day events for one subscribed subject are condensed into one subject-scoped notification.
- Notify CLI uses `--dry-run`, `--user <email>`, and `--force`; `--force` bypasses timing and already-sent guards only.
- Notify CLI does not accept database selection flags; database configuration stays in Effect Config/layers.
- Notify remains subscription-first in V1 and starts from `Subscriptions.listNotificationRecipients()`.
- Notify recipient order is deterministic by `subscription.id`; event order is deterministic by `startsAt`, then `event.id`.
- Notify sends before marking `last_sent_at`. If delivery succeeds but `markSent` fails, V1 accepts possible duplicate delivery on a later run rather than risking silent missed notifications.
- `Subscriptions.markSent` returns an effect error on failure. The V1 notify job collapses that error to a log and continues processing later subscriptions.
- Inconsistent participant graphs are data-integrity failures and may abort the notify run.
- Unsubscribe is safe enough before auth by using an opaque random bearer token that exposes no raw email or user id.
- The unsubscribe token has no embedded payload, signature, timestamp, or expiry in V1.
- Store the raw unsubscribe token in `users.unsubscribe_token` for V1; hashing does not fit the stable-token email model because future emails need the raw token.
- Unsubscribe link GET requests do not look up tokens or mutate state; the confirmation POST performs the delete.
- V1 unsubscribe confirmation does not require email address re-entry.
- Re-signup after unsubscribe creates a new user row and a new unsubscribe token.
- Signup, unsubscribe, and notify orchestration stay in their route/job callsites for V1; table/domain services own persistence operations.
- Plain database failures use shared database errors; service-specific errors are reserved for domain conditions callers handle intentionally.
