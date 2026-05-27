# dotheyplaytoday Rewrite Spec

## Product

`dotheyplaytoday` answers one recurring question for sports fans: does my team play today, and if so, when?

V1 sends a game-day email for selected teams from supported sports leagues. A user chooses teams, a local send time, and a timezone. The system runs from external cron, checks the current schedule, sends only when at least one selected subject has an event on the user's local date, and suppresses duplicates for that local date.

## V1 User Flows

### Signup

1. User enters email.
2. User selects timezone, defaulting from the browser when possible.
3. User chooses a fixed local send time in 15-minute increments.
4. User selects one or more teams from the supported sports subjects, subject to the free-tier cap.
5. Server validates the full payload and stores that user's current subscription set.

Resubmitting with the same normalized email is the edit path for V1. The submitted team set replaces the stored set. There is no authenticated dashboard and no read-by-email preference lookup in V1.

Signup runs inside one transaction:

1. Normalize email.
2. Upsert user by normalized email; always overwrite `timezone`; generate `unsubscribeToken` only for a new user and preserve it on resubmission.
3. Delete all existing subscriptions for the user.
4. Insert one subscription per submitted `subjectId` with the submitted `schedule` and `lastSentAt = null`.

`lastSentAt` is not preserved across resubmissions; a deliberate resubmit may produce a duplicate email same day. Wipe and recreate is intentional and avoids create/retain/delete diffing.

### Notify

1. External cron invokes the notify job every 15 minutes. Cron and recurrence are infrastructure concerns; the job is a runnable script.
2. Job loads users and subscriptions through domain services, not inline database joins.
3. Job evaluates fixed local send time against the current UTC instant and the user's timezone.
4. Job skips subscriptions that are not due, already sent today, or have no events on the user's local date.
5. Job sends one notification per due user/subject subscription with all matching events for that subject on the user's local date through the `Notifier`.
6. Job updates `last_sent_at` only after successful delivery. Due evaluations with no same-day events do not update `last_sent_at`.
7. Dry-run mode evaluates due subscriptions and reports what would happen, but never sends through the provider and never updates `last_sent_at`.

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

Notify sends before marking `last_sent_at`. If delivery succeeds but `markSent` fails, V1 accepts possible duplicate delivery on a later run rather than marking before send and risking silent missed notifications. An outbox or notification-attempt table is deferred.

`Subscriptions.markSent` returns an effect error on failure. The V1 notify job collapses that error to a log and continues processing later subscriptions; future reliability work may promote this to a handleable case.

If event loading returns an inconsistent participant graph, notify treats it as a data-integrity failure and may abort the run rather than skipping a single recipient.

### Unsubscribe

1. Each email includes an unsubscribe link to a confirmation route.
2. The unsubscribe token is an opaque random bearer capability stored on the user; it must not expose raw email addresses or user ids.
3. `GET /unsubscribe/:token` renders a confirmation page for token-shaped input, does not look up the token in the database, and does not mutate subscriptions.
4. The confirmation form posts the token to the unsubscribe endpoint without requiring email address re-entry in V1.
5. The unsubscribe endpoint resolves the user by token and hard-deletes the user row; subscriptions cascade from the user delete.
6. Repeated unsubscribe posts after the user was already deleted return the same generic terminal result.
7. Unknown or malformed tokens do not reveal whether a user/email exists.

Token shape:

```txt
opaque-random-url-safe-token
```

Unsubscribe tokens are generated with cryptographic randomness. UUIDv4 or a stronger URL-safe random value is acceptable for V1. Tokens do not expire or rotate in V1 so old notification emails remain usable.

Re-signup after unsubscribe creates a new user row and a new unsubscribe token. Old unsubscribe links must not unsubscribe a later re-signup.

## Domain Model

### User

- `id`: UUID
- `email`: normalized email address, unique
- `timezone`: IANA timezone
- `unsubscribe_token`: opaque random bearer token used inside unsubscribe links, unique

`unsubscribe_token` is generated when the user is first created and preserved when signup is resubmitted for the same normalized email. Store the raw token on the user row, enforce uniqueness, and do not store or put a token hash in the URL for V1. Public unsubscribe links must not expose `users.id` or `users.email`.

### Subject

A subject is anything someone can subscribe to a feed of. V1 subjects are sports teams.

- `id`: UUID
- `_tag`: query projection of `details._tag`
- `details`: tagged subject details JSON

V1 subject details:

```json
{
  "_tag": "sports_team",
  "leagueId": "nba",
  "location": "Boston",
  "name": "Celtics",
  "abbreviation": "BOS",
  "slug": "boston-celtics"
}
```

Do not add top-level sports columns such as `league_id` or `title` to `subjects` for V1. Group sports subjects in application code from decoded details unless SQL filtering proves necessary.

### Event

An event is a scheduled unit of one or more subject feeds. V1 events are sports games.

- `id`: UUID
- `_tag`: query projection of `details._tag`
- `source_id`: stable import identity, unique with `_tag`
- `starts_at`: UTC instant
- `availability`: whether the event is active or cancelled
- `details`: tagged event details JSON

V1 event details:

```json
{
  "_tag": "sports_game",
  "leagueId": "nba"
}
```

Keep `source_id` as a column because import upsert needs stable event identity. Keep `starts_at` as a column because scheduling and local-date matching query it directly. Keep `availability` as a generic column because normal event read paths should filter cancelled events. Keep sports-specific event facts in `details`.

V1 source id format:

```txt
<eventType>:<source>:<uuid>
```

Sports seed example:

```txt
sports_game:seed:8d4f1a0a-2a1d-4b2d-9c9e-1a2b3c4d5e6f
```

`source_id` must be stable across mutable schedule changes. Do not derive it from start time, game date, or participants.

`availability` is not a temporal lifecycle. It is only whether the source says the event should be considered active or cancelled. Past/future status is always derived from `starts_at`; do not add recurring writes that close out old events.

### Subject Event

A subject event is the edge that says an event belongs in a subject's feed. It does not store participant facts.

- `event_id`: owning event
- `subject_id`: subject feed that should include the event

This is the authoritative many-to-many relationship for `Events.listBySubject`. V1 sports games link to the home and away team subjects. A later subject such as "NBA playoffs" can link to the same game without becoming a participant in that game.

### Participant

A participant is an event-local participant record. It stores facts about who participates in the event without acting as the subject-event junction.

- `id`: UUID
- `event_id`: owning event
- `_tag`: query projection of `details._tag`
- `details`: tagged participant details JSON

V1 participant details:

```json
{
  "_tag": "sports_game",
  "role": "home",
  "title": "Boston Celtics"
}
```

Sports games have exactly two team participants, one `home` and one `away`. Home/away is a participant fact, not something derived from team or event locations. The participant `_tag` selects the JSON details shape for that participant domain; `sports_game` starts with `role` and `title`, and later sports-specific fields such as location can be added there without changing non-sports participants. Non-sports participant tags define their own details.

Participants are event-local one-off records in V1. `subject_events.subject_id` identifies which subject feeds include the event. For a Celtics-Knicks game, the event can link to Celtics, Knicks, and NBA Playoffs subject feeds while the participants remain only Celtics and Knicks.

### Subscription

- `id`: UUID
- `user_id`: owning user
- `subject_id`: selected subject
- `schedule`: fixed local schedule JSON
- `last_sent_at`: nullable UTC instant

V1 schedule:

```json
{
  "_tag": "fixed_local_time",
  "sendAtSecondsLocal": 32400
}
```

The prototype carried a `relative` schedule variant for future event-relative reminders. That was locally attractive but globally harmful for V1 because it created unimplemented branches and validation surface. Keep `schedule` as a tagged union, but include only `fixed_local_time` in the first rebuild. Add future scheduling models by extending the union and updating the explicit schedule evaluation callsites in the same slice.

The prototype also carried `enabled`. V1 user intent is hard-delete unsubscribe and replacement-based signup. Do not add `enabled` unless there is a concrete pause/resume workflow.

## Read Surface

Each entity service owns its own table and queries. Cross-entity queries live on the service whose table is being read, not on the parent entity service.

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

- `Subjects.get` does not return events; aggregates are projections, not the default load shape.
- `Events` owns event reads/writes and participant writes, and exposes subject-scoped queries through `subject_events`.
- `Subjects.addEventToFeed` owns writing the `subject_events` feed edge; `Subjects.get` and `Subjects.list` still do not return events.
- `Events.listBySubject` accepts an optional UTC range and optional availability filter, defaults to `availability: "active"`, and orders results by ascending `startsAt`, then `event.id`.
- `Events.listBySubject(subjectId, { availability: "all" })` is reserved for tooling or explicit admin/debug reads; notify does not use it.
- Timezone conversion is the caller's responsibility through a shared time utility; service queries stay UTC-only.
- New per-window methods such as "today" or "this week" are not added until a real second use case appears.

Shared time utility:

```ts
SubscriptionTiming.localDayUtcRange(input: {
  nowUtc: DateTimeUtc;
  timezone: TimeZone;
}): { from: DateTimeUtc; to: DateTimeUtc };
```

Notify maps the `SubscriptionTiming.localDayUtcRange` result into the `Events.listBySubject` range keys:

```ts
const localDay = SubscriptionTiming.localDayUtcRange({ nowUtc, timezone });

Events.listBySubject(subjectId, {
  range: {
    fromUtc: localDay.from,
    toUtc: localDay.to,
  },
});
```

`Events` does not know what "today" means for a user.

## Service Boundaries

V1 uses table/domain services plus callsite workflow orchestration.

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

Do not add `SignupService`, `UnsubscribeService`, or `NotifyService` in the first rebuild. Extract a workflow service only when there is more than one callsite or a concrete testability/readability win.

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

## Error Model

Use shared infrastructure errors for plain database failures:

- `DatabaseReadError`
- `DatabaseWriteError`
- `DatabaseDeleteError`
- `DatabaseTransactionError` when a transaction boundary needs distinct reporting

Do not create service-specific read/write wrappers such as `UsersReadError` or `EventsWriteError` when the only meaning is that a database operation failed. Database errors carry operation/context metadata for logs and traces.

Create service/domain errors only for meaningful business or integrity failures that callers branch on or map intentionally, such as:

- `SubjectNotFound`
- `InvalidSubjectSelection`
- `SubjectCapacityReached`
- `EventImportConflict`
- `EventNotFound`

Domain errors describe the business/data-integrity condition, not the table operation. Route and job callsites map domain and infrastructure errors to public API responses or logs; low-level database details stay internal.

## Scheduling Semantics

- Store user send preferences as local wall-clock intent in `sendAtSecondsLocal`.
- Interpret local send intent in the user's saved IANA timezone at runtime.
- Do not store a precomputed UTC send time for a fixed local schedule.
- Handle DST by deriving from the user's local date at evaluation time.
- Accept a due window of 1 minute early and 5 minutes late around the computed send instant.
- Prevent duplicates by comparing `last_sent_at` to the current date in the user's timezone.
- Treat `last_sent_at` as last successful delivery, not last evaluation.
- `Subscriptions.markSent({ subscriptionId, sentAt })` is the only V1 write surface for `last_sent_at`; do not add a generic subscription `update()` method.
- Store event start times as UTC instants.
- Treat `availability` as source truth about whether an event should be considered active or cancelled, not as a temporal lifecycle.
- Event matching is based on subject event membership and event start time converted to the user's local date.
- Same-day event queries use a UTC range derived from the user's local calendar day.
- Same-day event matching ignores cancelled events through the normal `Events.listBySubject` default.

Notify uses subscription-first orchestration:

1. Load subscription notification recipients through `Subscriptions.listNotificationRecipients()`.
2. For each recipient, evaluate due time in application code.
3. Skip recipients already sent on the user's current local date.
4. Compute the user's local-day UTC range.
5. Load same-day events with `Events.listBySubject`, mapping `localDay.from` to `range.fromUtc` and `localDay.to` to `range.toUtc`.
6. Skip recipients with no same-day events.
7. Send a subject-scoped notification.
8. Mark the subscription sent only after successful non-dry-run delivery.

## Persistence

Use SQLite with Drizzle as V1 persistence.

Tables:

- `users`
- `subjects`
- `events`
- `subject_events`
- `participants`
- `subscriptions`

Rules:

- Drizzle table definitions are the persistence source of truth.
- Define tables with the shared SQLite table factory so snake_case configuration is centralized.
- Add a unique constraint on `(_tag, source_id)` for events.
- Add `events.availability` with V1 values `active` and `cancelled`.
- Generate Effect schemas from Drizzle definitions for persisted row shapes.
- Domain schemas alias persistence schemas when the shapes are identical.
- When the selected row shape is the domain entity, name the derived select schema after the domain entity. Define reusable scalar schemas first, then reference them directly in `domainOverrides`. Every derived row/insert schema must include a type-only table contract proving its encoded type matches Drizzle's inferred select/insert model. Split select and insert override objects only when the domain shape differs by operation, or when a table contract proves optional/default columns need explicit insert treatment.
- Compose domain projections only at real aggregate boundaries, such as loading an event with participants or a subject schedule.
- Use `details` for row-level variant details and `schedule` for nested schedule policy.
- For row-level discriminated values, `_tag` must equal `details._tag`; `_tag` exists for SQL querying, while `details._tag` preserves TypeScript/Effect discriminated unions.
- Do not add a table-level `_tag` for nested policies such as subscription schedules.
- Do not reintroduce Redis/KVS compatibility layers.

## Import Contract

V1 launch seed data starts with NBA team subjects and sports game events. League identity is stored as `leagueId` in sports subject and event details. V1 does not add a separate top-level league entity; add a league table/FK only when the product needs richer league data.

NBA team seed records include stable checked-in UUID subject ids. Subject import/upsert uses those ids rather than deriving ids from mutable names, abbreviations, or slugs.

Keep NBA teams and NBA games as separate seed collections. Teams are catalog/reference data; games are schedule/import data and can change more frequently.

Seed data uses a relational JSON shape:

```ts
type NbaTeamSeed = {
  readonly id: SubjectId;
  readonly leagueId: "nba";
  readonly location: string;
  readonly name: string;
  readonly abbreviation: string;
  readonly slug?: string;
};

type NbaGameSeed = {
  readonly sourceId: EventSourceId;
  readonly leagueId: "nba";
  readonly startsAt: DateTimeUtc;
  readonly availability: EventAvailability;
  readonly homeSubjectId: SubjectId;
  readonly awaySubjectId: SubjectId;
  readonly homeParticipant: NbaGameParticipantSeed;
  readonly awayParticipant: NbaGameParticipantSeed;
};

type NbaGameParticipantSeed = {
  readonly title: string;
};
```

The importer validates and upserts from this structure instead of inferring identities from names, abbreviations, or slugs.

Seed/import flows:

- Dev seed may reset/import all development data needed for local workflows.
- Production seed/import only touches catalog and schedule data, such as subjects, events, subject events, and participants. It must not modify users or subscriptions.
- Production seed/import is non-destructive and upsert-only for teams, events, subject events, and participant records.
- Dev and production seed commands import all explicitly registered seed collections. For V1, only the NBA collection is registered.
- Production seed requires an interactive typed confirmation such as `confirm` before it writes.

V1 imports use one authoritative source per event kind. Imports populate the relational event graph:

```txt
Subject <- SubjectEvent -> Event -> Participant
```

Rules:

- Event import upserts by `(_tag, source_id)`.
- NBA game seed records include explicit stable `source_id` values such as `sports_game:seed:<uuid>`.
- Re-importing the same `source_id` updates mutable event facts such as `starts_at`, `availability`, and details, ensures the relevant subject feed links exist, and replaces that event's participant records.
- Missing events in a seed collection are not deleted. Cancellation must be represented explicitly with `availability: "cancelled"`.
- Normal event read paths, including notify-oriented reads, should filter to `availability: "active"` unless a caller explicitly asks for cancelled events.
- Sports game imports must resolve home and away team feed subjects before writing subject events.
- `Subjects.addEventToFeed` relies on subject and event foreign-key constraints for feed-edge integrity; it does not create subjects or events.
- `Events.setParticipants` replaces only the event-local participant records with the provided list, which may be empty; it relies on the event foreign-key constraint when inserting participant rows and does not create subjects or subject events.
- API/admin command handlers that need user-facing not-found or authorization semantics should read the relevant parent row before calling leaf writes.
- Sports game imports write two team subject events for normal team notification feeds and exactly two participants: one `home`, one `away`.
- If the same `source_id` points to unexpectedly different participants, fail the import or log an explicit data-integrity error.
- V1 does not attempt cross-source dedupe. Switching sources is a migration/reconciliation task.

## API Contract

Detailed API/web decisions are tracked in `docs/rewrite/api-web-contract.md`.

V1 API needs:

- `GET /api/ping` for smoke checks.
- `POST /api/signup` for email plus full subscription replacement.
- `POST /api/unsubscribe` for executing unsubscribe from an opaque token.

Handlers should be thin but may orchestrate a single V1 workflow directly: decode request, apply rate limit, run the transaction across table/domain services, and map domain/infrastructure errors to public errors.

Shared request/response schemas live in `packages/core/src/contracts/` as the Effect `HttpApi` contract. The API package implements that contract, and the web package consumes it through the generated/typesafe client. Do not define route-local request/response shapes in the API package unless they are private implementation details.

Route shapes:

```ts
GET /api/ping -> { ok: true; service: "api" }

POST /api/signup
body: V1 signup inputs
success: { ok: true }

POST /api/unsubscribe
body: { token: UnsubscribeToken }
success: { ok: true }
```

`POST /api/unsubscribe` returns `{ ok: true }` for valid, already-used, unknown, or expired-in-the-future token outcomes that reach the terminal unsubscribe flow. It should not reveal whether a token matched a user. Malformed request bodies still return validation errors.

Public error mapping uses Effect `HttpApiError` values at the route boundary. Domain/service errors remain internal Effect errors and collapse onto HTTP errors with substantive public messages. Infrastructure errors collapse to generic internal errors and keep operational detail in logs.

Do not expose database operation names, unsubscribe-token existence, or raw domain object ids beyond ids the client already submitted. Do not expose raw domain error classes as the public HTTP contract unless a future endpoint needs a stable SDK-visible domain error shape.

Rate limiting is required for public write endpoints at the API boundary. Exact policy, identity key, storage, and provider are runtime/config decisions, not part of the public API contract.

## Web Contract

Detailed API/web decisions are tracked in `docs/rewrite/api-web-contract.md`.

Only change the internals of `packages/api` and `packages/web` when needed for the rewrite. Existing scaffolding, package shape, and app/server surfaces do not need to change unless a core contract decision requires consumers to update.

V1 web needs:

- Landing/signup page.
- Email field.
- Timezone detection with manual fallback.
- Fixed send-time selector in 15-minute increments.
- Sports team grid grouped from decoded subject details.
- Free-tier cap enforcement mirrored from shared policy.
- Success state that explains resubmission overwrites preferences for the same email.
- `GET /unsubscribe/:token` confirmation route that does not mutate state.
- Confirmation form that does not require email address re-entry in V1.
- Unsubscribe terminal success and failure states.

Landing page states:

- Initial: email, timezone, fixed send time, and sports team selection are editable.
- Client validation: show inline errors for invalid email, missing timezone, invalid send time, no selected teams, and over-cap selections before submit.
- Submitting: disable duplicate submit and keep selected values visible.
- Success: explain that the email is signed up and that submitting again with the same email replaces previous preferences.
- Failure: show a generic retry message for unexpected errors and specific user-fixable messages for validation/cap failures.

The web should treat the API contract as authoritative. Client validation mirrors shared policies for responsiveness, but the API remains the source of truth.

Unsubscribe page states:

- Confirmation route accepts a token-shaped path segment and renders a confirmation form without checking the database.
- Malformed token-shaped input returns `404`.
- Posted unsubscribe success renders the same terminal success message whether the token matched an active user or was already consumed.

## Runtime And Config

Preserve the current config architecture during the rewrite.

Rules:

- Define typed Effect `Config` structs near the concern that owns the value, usually in core modules such as API URL, web URL, database, or provider config. Do not create one giant central config file.
- Keep shared helpers in core that install config providers from environment sources, such as dotenv for Node runtimes and Vite env for Vite apps. Runtime callsites supply source-specific inputs like the dotenv path or `import.meta.env`.
- Database config belongs with database infrastructure under `packages/core/src/lib/database/config.ts`, not under `modules/`.
- Provider config belongs near the provider that owns it, such as Resend config under the notifier email provider folder.
- Non-library packages such as `api`, `jobs`, `web`, and scripts define their own `ManagedRuntime` assembly. They install the appropriate config provider, platform layers, and live/default service layers once at the runtime boundary.
- Web installs a Vite env config provider. Node runtimes such as API, jobs, and core scripts install a dotenv/env provider; database config may be read from the repo/root `.env`.
- Core scripts use their own script runtime assembly rather than borrowing API or jobs runtime setup.
- Services and handlers consume typed config values/effects; they do not read `process.env` or `import.meta.env` directly.
- Derived values such as public URLs or bound ports should remain typed derived effects instead of being recomputed ad hoc at callsites.
- Harmless local/dev values such as local ports or local SQLite paths may have defaults. Secrets and provider credentials must not have defaults.
- Do not compress config into untyped global objects or package-local env parsing during the rewrite.

Seed scripts own seed orchestration. `seed:dev` and `seed:prod` import registered collections from `@dtpt/data` directly and write them through domain services. `seed:prod` owns its typed confirmation prompt; shared domain/import functions remain prompt-free and testable. Extract shared seed orchestration only after duplication becomes concrete.

## Testing Strategy

Use `@effect/vitest` for Effect tests. Prefer `it.effect` for effectful assertions and `it.layer` for suites that need shared services.

Persistence tests should exercise real schemas/services against cheap SQLite test databases instead of mocking repositories. Default to in-memory SQLite for fast service tests. Use scoped temporary SQLite files/layers when testing migrations, file path config, or behavior that depends on actual file persistence.

Mocks/fakes are acceptable at external provider or network boundaries, such as email provider clients, but should not replace persistence or domain services when SQLite is cheap to spin up and tear down.

## Notification Contract

Email is the only V1 delivery channel.

Notify orchestration assembles a prepared notification inline after loading the subscription recipient, subject, and same-day events, then calls `Notifier.notify(notification)`. The notifier delegates to the configured `NotifierChannel`. The channel renders the notification into a channel-specific message and sends that rendered message through its `NotifierChannelProvider`.

Rough interface shape:

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

interface Notifier {
  readonly notify: (
    notification: Notification,
  ) => Effect.Effect<void, NotifierError>;
}

interface NotifierChannel<Rendered> {
  readonly render: (notification: Notification) => Rendered;
  readonly send: (message: Rendered) => Effect.Effect<void, NotifierError>;
}
```

V1 email channel shape:

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

Define each delivery service boundary in the folder that owns it. The notifier-facing `Notifier` service lives in `modules/notifier/service.ts`. The shared `NotifierChannel` injectable boundary lives in `modules/notifier/channels/service.ts`, while email channel behavior and rendering live under `modules/notifier/channels/email/`. The shared `NotifierChannelProvider` injectable boundary lives in `modules/notifier/providers/service.ts`, while Resend lives under `modules/notifier/providers/email/` because it can only send email channel messages.

In this module, `service.ts` may be abstract or concrete. Abstract service files define the `Context.Service` tag and no layer. Concrete implementation files provide a layer that satisfies the abstract service. Shape-only files should not be named `service.ts`.

Email content must include:

- Primary matchup headline.
- Local start time.
- All additional same-day events for that subscription, if any.
- Plain text and HTML bodies.
- Unsubscribe link to the confirmation route.

V1 sends one email per due subscription/subject. If a user subscribes to both teams in the same game, they may receive two emails for that game. Per-user or per-game deduplication is a follow-up issue, not part of the first rebuild.

Do not add a notification builder/projection service in V1. Inline assembly is only object construction from data already loaded by notify. Extract a builder only after a second callsite, channel-specific data divergence, or concrete testability/readability win appears.

If one subscribed subject has multiple same-day events, such as a doubleheader, V1 sends one subject-scoped email containing all of those events rather than one email per event.

Provider-specific payload mapping belongs in the `NotifierChannelProvider` layer. Email formatting belongs in the email `NotifierChannel` layer. `NotifierChannel.render` is pure: it takes a prepared `Notification` and produces the channel-specific rendered message. Providers do not render notification copy. Notify orchestration depends only on the notifier service. The notifier method is `notify(notification)`; `send` is reserved for channel/provider delivery of rendered messages.

Keep `NotifierChannel.render` pure in V1. If rendering later needs real failure/effect cases, make the render boundary effectful in that slice.

Email rendering builds unsubscribe links from channel/web config plus `notification.user.unsubscribeToken`. Notify orchestration does not construct public URLs. Extract a shared link helper only when multiple channels need the same link construction.

Email channel providers accept the app-level `EmailMessage` shape. Provider implementations map `EmailMessage` to vendor SDK payloads such as Resend or SES; email rendering never emits vendor-specific payloads.

The delivery design is generic, but V1 runtime wiring provides exactly one email `NotifierChannel`. A future SMS channel should be addable by implementing another `NotifierChannel` and supplying its layer at the runtime edge, without changing notify orchestration unless SMS needs different notification data.

## Non-Goals For First Rebuild

- Relative-to-event notifications.
- SMS, push, WhatsApp, or multi-channel user preferences.
- Authenticated dashboard.
- Read-by-email preferences endpoint.
- Full notification audit trail.
- Outbox/idempotent delivery pipeline.
- Provider retry/backoff policy.
- Per-user/per-game notification dedupe across multiple subscribed subjects.
- Non-sports subjects.
- Per-team unsubscribe.
- Redis or generic KVS persistence.
- Compatibility facades for the prototype API.
