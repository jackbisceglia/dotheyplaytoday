# One-off email editions

An edition is a one-off email to followers of some leagues about one day's
games, such as Thanksgiving football. Each edition is one entry in
`packages/core/src/modules/editions/catalog.ts`; selection, rendering, delivery,
the dev trigger, and the cron hook are shared. Nothing sends unless an edition's
`send.cron` is changed from `"off"` in a reviewed, deployed commit.

## Definition

| Field          | Meaning                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------- |
| `id`           | Permanent. Every recipient's provider key is `edition:<id>:<user-id>`.                      |
| `audience`     | Verified users following at least one team in `leagueIds`; one email per user.              |
| `events`       | Active games in `leagueIds` starting on `date` (`YYYY-MM-DD`) in `timezone`.                |
| `presentation` | Email subject and headline-tile lines. Run `pnpm @web assets:generate` after changing them. |
| `send`         | `[opensAt, closesAt)` UTC window and the `cron` mode: `off`, `dry-run`, or `live`.          |

Live runs outside the window are refused before any database read and log
`edition: live send refused outside window`. Any run after `closesAt` logs
`edition: send window has passed`. An empty slate never sends. Times render in
each recipient's timezone.

The cron hook rides the notification Worker's quarter-hour cron and fires an
edition only on the tick in `[opensAt, opensAt + 15 min)`, using Cloudflare's
scheduled time, so a late deploy cannot send and the same edition is not
re-sent by later ticks. Put `opensAt` on a quarter hour.

The provider key deduplicates reruns for Resend's
[24-hour window](https://resend.com/docs/dashboard/emails/idempotency-keys).
There is no durable delivery record; never move `opensAt` to a second day for
an edition that has already sent.

## Thanksgiving football 2026

`thanksgiving-football-2026`: NFL followers, NFL games on 2026-11-26 Eastern.

| Game                                 | Kickoff (ET) |
| ------------------------------------ | ------------ |
| Chicago Bears @ Detroit Lions        | 1:00 PM      |
| Philadelphia Eagles @ Dallas Cowboys | 4:30 PM      |
| Kansas City Chiefs @ Buffalo Bills   | 8:20 PM      |

The catalog matched SI/NBC/FOX published schedules on 2026-11-26;
`packages/data/src/sports/nfl/thanksgiving.test.ts` pins it. Wednesday's
Packers @ Rams and Friday's Broncos @ Steelers are excluded by the Eastern date.

The window is the tentative 2:00 PM ET slot (`19:00Z`) to the 4:30 PM ET second
kickoff (`21:30Z`). **2:00 PM is after the 1:00 PM Bears @ Lions kickoff**; the
email still lists that game. If the slot moves, change `opensAt` (on a quarter
hour) and keep `closesAt` at or before a kickoff you are willing to email after.
If 4:30 PM ET has passed, the edition can no longer send; do not widen the
window after the fact without deciding that a late email is still wanted.

## Development dry run and send

With `pnpm dev` running (notify Worker on port 8788, dev stage only):

```sh
pnpm @jobs build
# Preview every recipient; dry runs work outside the window and never send.
pnpm @jobs start:notify --edition thanksgiving-football-2026 --dry-run
# Narrow to one user, or evaluate as of a given instant.
pnpm @jobs start:notify --edition thanksgiving-football-2026 --dry-run \
  --user you@example.com --now 2026-11-26T19:00:00Z
# Live send to your own dev user (inside the window, or with --now inside it).
pnpm @jobs start:notify --edition thanksgiving-football-2026 \
  --user you@example.com --now 2026-11-26T19:00:00Z
```

Dry-run logs list the selected game IDs, recipient count, and each recipient's
key, subject, and rendered text. Production returns 401 for every trigger.

## Production rollout

Production has no manual trigger; the cron mode is the only switch.

1. Merge the edition with `cron: "off"`. The push to `main` deploys it along
   with the headline PNG. Confirm
   `https://dotheyplay.today/email/headlines/thanksgiving-football.png` loads.
2. Optional production dry run: in a small PR set `cron: "dry-run"` with
   `opensAt` on an upcoming quarter hour. After that tick, read the
   `NotifyJobWorker` logs for `edition: selected` and `edition: dry-run`
   (recipient count, game IDs, rendered text). Each dry run costs one deploy.
3. Live: in a small PR set `cron: "live"` with `opensAt` on a quarter hour
   **after the deploy will have finished** and `closesAt` at the cutoff. Merge
   it. The next deploy must land before `opensAt`, or the tick is missed and
   nothing sends.
4. After the tick, check the logs for `edition: sent` per recipient and for
   `edition: delivery failed`/`rejected`.
5. Follow up by setting `cron` back to `"off"`. The past window already
   prevents another send; this keeps the catalog honest.
