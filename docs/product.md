# Product

## Purpose

`dotheyplaytoday` lets users subscribe to supported sports subjects and receive a notification when a matching event occurs on their local calendar date.

**Subject** and **Event** are intentionally reusable domain terms. Sports teams and games are the current production implementation, but the model can support other event-driven subjects without redefining the core behavior.

Registration uses `POST /api/user`. Users can subscribe to up to four teams. New registration saves the user, timezone, teams, and schedule together. Submitting signup again preserves all existing preferences and returns `DuplicateSignup` (HTTP 409), while requesting another magic link.

## Notifications

- Only subscriptions whose user has `emailVerified: true` enter notification processing. Pending users are excluded at the database query, including forced and dry runs.
- A schedule is a fixed local wall-clock time interpreted in the user's IANA timezone.
- Event start times are stored as UTC instants. An event matches when its instant falls on the current calendar date in the user's timezone.
- Normal notification reads exclude cancelled events.
- Notifications are scoped to one subscription and therefore one subject.
- Multiple matching events for the same subscribed subject on the same day are combined into one notification.
- The subscription is marked sent only after its notifier sends successfully.
- A forced run bypasses the due-time and already-sent-today checks, but it still requires an eligible user and matching events on the user's local date.
- A dry run renders and sends through the console notifier and does not mark the subscription sent.
- Production scheduling is performed by the Cloudflare Worker cron. Development triggers and command-line entry points are operational tools, not the production scheduler.

## Registration and confirmation rollout

- New users start unverified and receive a “Confirm your updates” magic link. The success message is “Check your email to start your updates.”
- Repeat signup sends confirmation copy for an unverified user or sign-in copy for a verified user. Neither path changes saved preferences, including when concurrent requests submit the same normalized email.
- Duplicate signup shows: “You already have an account. We’ve emailed you a link to sign in. Your existing teams and schedule haven’t changed.”
- Magic links expire after 15 minutes and can be redeemed once. Redemption verifies email ownership and creates a session. Saved subscriptions become eligible under ordinary scheduling rules; confirmation does not send an immediate notification or reset last-sent state.
- Link issuance follows the signup transaction; email delivery runs in the API Worker's background execution lifetime. Issuance or delivery failures leave saved preferences intact, and the user can request a replacement link.
- Migration 0005 grants notification eligibility to exactly ten owner-trusted existing subscribers identified in the [production rollout audit](./runbooks/production-deploy.md#notification-eligibility-and-grandfathering-rollout). This deliberate delivery decision is not evidence of mailbox ownership and creates no sessions; these users still redeem a magic link to sign in.
- Pending registration, the recipient filter, and the fixed-cohort migration must reach production together.

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
