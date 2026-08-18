# Product

## Purpose

`dotheyplaytoday` lets users subscribe to supported sports subjects and receive a notification when a matching event occurs on their local calendar date.

**Subject** and **Event** are intentionally reusable domain terms. Sports teams and games are the current production implementation, but the model can support other event-driven subjects without redefining the core behavior.

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

## Signup confirmations

- Every successfully committed signup sends a best-effort confirmation email. The signup is already active and does not require email verification.
- A first signup receives welcome copy; later submissions for the same normalized email confirm that the user's teams and schedule were replaced.
- Confirmations list the selected teams and local send time and include the user's unsubscribe link.
- Confirmation delivery runs after the signup transaction in the API Worker's background execution lifetime. Rendering or provider failures are logged and do not change the successful signup response.

## Vocabulary

| Term                 | Meaning                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| User                 | A notification recipient identified by email, timezone, and unsubscribe identity.                        |
| Subject              | Something a user can follow; currently a supported sports team.                                          |
| Event                | A time-bound occurrence that may cause a notification; currently a game.                                 |
| Subject Event        | The association that says an event is relevant to a subject.                                             |
| Participant          | An entity taking part in an event, used to describe the event independently of subscriptions.            |
| Subscription         | A user's choice to follow one subject on a schedule, including its last successful send state.           |
| Schedule             | The rule determining when a subscription becomes due; currently a fixed local time.                      |
| Notification         | The subject-scoped message assembled from a user, subscription, subject, and that day's matching events. |
| Notification Channel | The boundary that renders a scheduled event notification and arranges its delivery.                      |
| Signup Confirmation Channel | The boundary that renders a signup confirmation receipt and arranges its delivery.                |
| Channel Client       | The provider-facing boundary that sends an already rendered delivery.                                    |
