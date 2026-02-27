# dotheyplaytoday

Configurable recurring notifications for event schedules. The current MVP is sports-first: if a subscribed team has a game on the target day, the job sends an email notification; otherwise it sends nothing.

## Project

- Monorepo packages:
  - `packages/core` (`@dtpt/core`): schemas, data access, subscription checks, notifier services
  - `packages/jobs` (`@dtpt/jobs`): runnable notify job orchestration
- Seed data lives under `packages/core/data/`

## Local Run

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Build packages:

   ```bash
   pnpm build
   ```

3. Optional: configure live email delivery by creating `.env` and setting:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`

4. Run notify job:

   ```bash
   pnpm @jobs start:notify
   ```

Useful local check without Resend credentials:

```bash
pnpm @jobs start:notify -- --dry-run
```

## Data Format

### Users

Path: `packages/core/data/users.json`

```json
[
  {
    "id": "<user-uuid>",
    "email": "<email>",
    "timezone": "America/New_York"
  }
]
```

### Subscriptions

Path: `packages/core/data/subscriptions.json`

```json
[
  {
    "id": "<subscription-uuid>",
    "userId": "<user-uuid>",
    "topicId": "<topic-uuid>",
    "schedule": { "type": "fixed", "sendAtSecondsLocal": 6300 },
    "enabled": true,
    "lastSentAt": null
  }
]
```

Notes:

- `topicId` must match a topic file prefix in `packages/core/data/topics/`
- `sendAtSecondsLocal` uses 15-minute alignment (`0, 900, ..., 85500`)
- `relative` schedule shape exists but is currently skipped by the notify job in MVP

### Topics

Path pattern: `packages/core/data/topics/<topicId>-<slug>.json`

```json
{
  "events": [
    {
      "id": "<event-uuid>",
      "startUtc": "2026-03-07T00:00:00Z",
      "teamName": "Boston Celtics",
      "opponent": "Dallas Mavericks",
      "site": "home"
    }
  ]
}
```

Notes:

- `site` is required for sports events and must be `"home"` or `"away"`
- Notification matchup phrasing uses:
  - home: `vs.`
  - away: `@`
- Repository seed data includes Celtics, Red Sox smoke data, and upcoming regular-season topic files for all NBA teams

## Scheduling Expectations

- Run `pnpm @jobs start:notify` every 15 minutes via external cron
- Due checks use a +/-60 second window around the configured fixed send time
