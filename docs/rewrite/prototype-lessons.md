# Prototype Lessons

## What The Prototype Proved

- The core product is small and real: fixed local-time sports reminders are enough to validate the service.
- UTC event storage plus user-local schedule intent is the right time model.
- `lastSentAt` compared by user-local date is a simple duplicate guard that matches the product.
- A 15-minute external cron model is operationally sufficient for V1.
- The notify job can stay sequential for now. Reliability and clear logs matter more than throughput.
- Notifier-channel-first notification wiring worked: top-level orchestration should depend on `Notifier`, not Resend.
- Email rendering belongs above the provider and below notify orchestration.
- SolidStart plus Effect HttpApi is a reasonable public signup stack.
- Drizzle plus SQLite is a better persistence baseline than JSON files or Redis/KVS for this product.
- Relational event storage is useful; the rewrite sharpens this into events plus subject events and participants so one real sports game can involve multiple subscribed subjects.

## What Got Complicated

- The PRD became stale while code moved on. It kept old assumptions like JSON storage and symmetric send windows.
- The todo issue system became another context surface to maintain and loaded stale instructions into agent sessions.
- Redis/KVS introduced abstraction before the persistence problem was clear.
- Migration code from JSON/KVS to Redis/SQLite became more complex than the durable product behavior.
- Compatibility layers hid whether callers were using old storage semantics or the new database model.
- Flattening schedule variants into separate nullable persistence columns created transform overhead without a V1 query benefit.
- Carrying a `relative` schedule variant before implementing relative notifications created permanent skip branches.
- Carrying `enabled` blurred delete-based unsubscribe and pause/resume semantics.
- Separate persistence and domain schemas caused alias-heavy imports and duplicated ownership.
- Config-provider override tricks made CLI database selection harder to understand than a direct caller-provided database URL/path.
- Root agent guidance forced `effect-solutions` even though local source references were better and more current.

## Things To Keep

- Product behavior around local dates, due windows, and duplicate suppression.
- SQLite + Drizzle as the first durable backend.
- Drizzle-derived persistence schemas.
- `subscriptions.schedule` as the tagged schedule storage shape for fixed schedules.
- Event rows with subject events, event-local participants, active/cancelled availability, and JSON details for type-specific facts.
- Shared core contracts for API and web.
- Shared sports subject catalog/seed data and shared subscription policy.
- `NotifierChannel` / `NotifierChannelProvider` split for notifications.
- Tests around DST, timezone boundaries, already-sent behavior, no-event skips, provider failure continuation, and no update on failed send.
- CLI support for dry-run and dev-user targeting.

## Things Not To Copy

- Redis/KVS providers.
- KVS migration commands.
- `relative` schedule in V1.
- `enabled` as a user-facing subscription control in V1.
- Generic database compatibility facades.
- Separate handwritten row schemas when Drizzle can generate them.
- Broad barrels or catch-all public exports.
- Agent instructions that require secondary guides before source references.
- Planning docs that are not directly tied to the rewrite.

## Locally Good But Globally Bad

- Modeling future schedule variants early felt extensible, but it made every caller pay complexity for a feature not being shipped.
- Preserving old service contracts made migration easier locally, but it kept obsolete storage concepts alive.
- A generic persistence interface sounded flexible, but the product currently needs a clear relational model and simple queries.
- Extra helper modules made individual files shorter, but the system became harder to trace.
- A richer todo protocol helped early agent work, but it became a second project-management system instead of a lightweight plan.

## Rewrite Principle

Build the smallest system that honestly supports the V1 product. Add abstraction when it clarifies the V1 sports-league model, avoids a concrete dead end, or is exercised by a second real use case.
