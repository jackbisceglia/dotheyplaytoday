# Product

## Purpose

`dotheyplaytoday` lets users subscribe to supported sports subjects and receive a notification when a matching event occurs on their local calendar date.

**Subject** and **Event** are intentionally reusable domain terms. Sports teams and games are the current production implementation, but the model can support other event-driven subjects without redefining the core behavior.

Users can subscribe to up to four teams. Signup saves their teams, timezone, and notification schedule immediately. New users have `emailVerified: false` and `name: null`; updates begin only after they redeem a confirmation magic link. Preference editing is deferred to a separate follow-up.

## Notifications

- A schedule is a fixed local wall-clock time interpreted in the user's IANA timezone.
- Event start times are stored as UTC instants. An event matches when its instant falls on the current calendar date in the user's timezone.
- Normal notification reads exclude cancelled events.
- Notifications are scoped to one subscription and therefore one subject.
- Multiple matching events for the same subscribed subject on the same day are combined into one notification.
- The subscription is marked sent only after its notifier sends successfully.
- A forced run bypasses the due-time and already-sent-today checks, but still requires email verification and matching events on the user's local date. Pending users are excluded by the database recipient query for every run.
- A dry run renders and sends through the console notifier and does not mark the subscription sent.
- Production scheduling is performed by the Cloudflare Worker cron. Development triggers and command-line entry points are operational tools, not the production scheduler.

## Signup and authentication

- A new signup sees “Check your email to start your updates.” One Better Auth magic-link email uses “Confirm your updates” copy. There is no separate signup-confirmation email or staged subscription storage.
- Repeating signup for an existing normalized email never changes teams, timezone, or schedule, including pending users and concurrent submissions. The API returns `DuplicateSignup` (HTTP 409) after requesting a sign-in link. The response deliberately reveals account existence: “You already have an account. We’ve emailed you a link to sign in. Your existing teams and schedule haven’t changed.”
- Standalone sign-in requests remain generic for known and unknown emails. Unknown addresses receive no email and cannot create users through Better Auth.
- Pending users receive confirmation copy; verified users receive sign-in copy. A link lasts 15 minutes, is hashed at rest, and can be used once. Redemption verifies ownership, creates a session, and redirects to the account page. Saved subscriptions become eligible under their existing schedule; redemption does not send an immediate game notification.
- Email delivery runs in the API Worker's background lifetime. Delivery failure preserves saved preferences. Users can request replacement links from `/sign-in`, including after a failed delivery or an expired or already-used link.
- Signed-out navigation offers Sign in beside Sign up; signed-in navigation shows Your account. `/account` displays saved teams, timezone, and each notification schedule, plus sign-out. It has no preference or profile editing.
- Authentication cookies remain host-only to the API origin. The browser loads sessions and account data with credentials; Web SSR does not assume it receives those cookies.
- Migration 0005 grants continued notification eligibility to the fixed ten owner-trusted production subscriber IDs audited on 2026-09-06. Their `created_at` values came from migration 0004, not their original signups. This grandfathering is a deliberate delivery decision, not proof of mailbox ownership, and creates no sessions. They must still redeem a magic link to sign in.

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
