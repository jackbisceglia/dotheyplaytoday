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
- The subscription is marked sent only after its notifier sends successfully.
- A forced run bypasses the due-time and already-sent-today checks, but it still requires matching events on the user's local date.
- A dry run renders and sends through the console notifier and does not mark the subscription sent.
- Production scheduling is performed by the Cloudflare Worker cron. Development triggers and command-line entry points are operational tools, not the production scheduler.

## Signup confirmations

- Every successfully committed signup sends a best-effort confirmation email. The signup is already active and does not require email verification.
- A first signup receives welcome copy; later submissions for the same normalized email confirm that the user's teams and schedule were replaced.
- Confirmations list the selected teams and local send time and include the user's unsubscribe link.
- Confirmation delivery runs after the signup transaction in the API Worker's background execution lifetime. Rendering or provider failures are logged and do not change the successful signup response.

## Authentication

- Authentication is passwordless and available only to notification users who already exist under their normalized email address.
- Requesting a magic link returns the same success response for known and unknown addresses; unknown addresses do not receive email and cannot create users.
- A valid magic link verifies the existing user and creates a persistent server-side session. Authentication cookies remain host-only to the API origin.

## Feedback

- The `/feedback` page accepts a required request of up to 2,000 characters.
- Feedback is categorized internally as `new_subject` or `general`. The user-facing new-subject option covers requests for a league, team, or sport and is selected by default; general feedback also covers support requests.
- Successful submissions are stored immediately. At 00:00 and 12:00 UTC, a
  worker emails the preceding 12 hours of submissions to the configured
  administrator as one digest.

## Vocabulary

| Term                | Meaning                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| User                | A notification recipient identified by email, timezone, and unsubscribe identity.                        |
| Subject             | Something a user can follow; currently a supported sports team.                                          |
| Event               | A time-bound occurrence that may cause a notification; currently a game.                                 |
| Subject Event       | The association that says an event is relevant to a subject.                                             |
| Participant         | An entity taking part in an event, used to describe the event independently of subscriptions.            |
| Subscription        | A user's choice to follow one subject on a schedule, including its last successful send state.           |
| Schedule            | The rule determining when a subscription becomes due; currently a fixed local time.                      |
| Notification        | The subject-scoped message assembled from a user, subscription, subject, and that day's matching events. |
| Notifier            | The notification-specific boundary that renders and sends a `Notification`.                              |
| Email               | The provider-neutral transport boundary that sends a complete outbound email.                            |
| Transactional Email | An application workflow that owns its input, rendering, and delivery through `Email`.                    |
