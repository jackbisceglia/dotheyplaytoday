# Product

## Purpose

`dotheyplaytoday` lets users subscribe to supported sports subjects and receive a notification when a matching event occurs on their local calendar date.

**Subject** and **Event** are intentionally reusable domain terms. Sports teams and games are the current production implementation, but the model can support other event-driven subjects without redefining the core behavior.

## Signup

- Signup requires an email address, an IANA timezone, a fixed local send time, and selected subjects.
- Signing up an existing email replaces that user's complete subscription set.
- Re-signup preserves the existing unsubscribe identity while that user still exists.
- The shared domain subscription policy enforces subject-count limits.
- The API contract and domain policy are authoritative even when the web client mirrors validation for immediate feedback.

## Notifications

- A schedule is a fixed local wall-clock time interpreted in the user's IANA timezone.
- Event start times are stored as UTC instants. An event matches when its instant falls on the current calendar date in the user's timezone.
- Normal notification reads exclude cancelled events.
- Notifications are scoped to one subscription and therefore one subject.
- Multiple matching events for the same subscribed subject on the same day are combined into one notification.
- The subscription is marked sent only after its channel delivers successfully.
- A forced run bypasses the due-time and already-sent-today checks, but it still requires matching events on the user's local date.
- A dry run renders and delivers through the selected non-production channel and does not mark the subscription sent.
- Production scheduling is performed by the Cloudflare Worker cron. Development triggers and command-line entry points are operational tools, not the production scheduler.

## Unsubscribe

- Unsubscribe links carry an opaque bearer token; possession of the token authorizes the action.
- The confirmation page `GET` validates and displays the action but does not mutate state. The user confirms through the API write.
- For any valid-shaped token, the terminal API response does not reveal whether it matched an active user.
- Unsubscribe hard-deletes the user, and database cascades delete that user's subscriptions.
- Signing up again after unsubscribe creates a new user identity and a usable subscription lifecycle.

## Vocabulary

| Term | Meaning |
| --- | --- |
| User | A notification recipient identified by email, timezone, and unsubscribe identity. |
| Subject | Something a user can follow; currently a supported sports team. |
| Event | A time-bound occurrence that may cause a notification; currently a game. |
| Subject event | The association that says an event is relevant to a subject. |
| Participant | An entity taking part in an event, used to describe the event independently of subscriptions. |
| Subscription | A user's choice to follow one subject on a schedule, including its last successful send state. |
| Schedule | The rule determining when a subscription becomes due; currently a fixed local time. |
| Notification | The subject-scoped message assembled from a user, subscription, subject, and that day's matching events. |
| Channel | The boundary that renders a notification and arranges its delivery. |
| Channel client | The provider-facing boundary that sends an already rendered delivery. |

## Current non-goals

- Schedules relative to an event's start time.
- Authenticated user dashboards.
- Per-user channel preferences or multiple selectable delivery channels.
- Pausing and resuming subscriptions.
- Deduplicating the same game across different subscribed subjects for one user.
- Production subjects outside sports.
