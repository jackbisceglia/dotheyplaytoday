# Update the UFC catalog

UFC uses the versioned catalog action, alongside the existing team collections.
Edit `packages/data/src/mma/ufc.ts`, validate, and bump `CatalogSeedVersion` in
`packages/data/src/seed/config.ts`. The default production catalog action imports
UFC transactionally; passing explicit sports collections only imports those
collections. Development includes all supported fighters/coverage subjects and
only cards in the existing two-day seed window.

## Product rules

- Each fighter is an independent subject. UFC coverage is one subject selection:
  Off (no subject), Numbered, or All. All includes numbered cards and Fight Nights;
  Contender Series, standalone Ultimate Fighter events, and exhibitions are excluded.
- Each team, fighter, or enabled coverage choice uses one of the four shared picks.
  Numbered and All cannot be selected together. Coverage changes preserve fighters.
- Delivery follows the existing team rules: one email per due subject per local
  day, containing every matching card. Following both opponents and coverage can
  yield three emails. Separate cards remain separate entries in those emails.
  Dashboard cards merge by stable card ID and show every match reason.
- Successful sends update that subscription's last-send state. Rescheduling to a
  later local date can produce an ordinary email on that date, just like sports.
  Same-day updates do not trigger another ordinary email for an already-sent
  subject. No separate post-send correction alerts are implemented.
- Unverified users remain ineligible, including forced runs. Dry runs don't mark
  sent; failed sends don't mark sent. Provider retries use the existing key
  (subscription ID plus scheduled send instant). This retains existing provider
  idempotency limits, including the provider's retention window; it is not a new
  permanent exactly-once delivery ledger. Force retains existing sports semantics.

## Authoritative sources and identity

Use [UFC's event listings](https://www.ufc.com/events), each official UFC event
page, official event-update announcements, and
[UFC athlete profiles](https://www.ufc.com/athletes/all). Store the consulted
UFC URL on each import record and review timestamp in the event details.
The URL is import provenance; the stored revision prevents stale reimports. Never infer a cancellation from a
missing search result, a failed scrape, or a shortened broadcast listing.

The initial catalog contains the confirmed headliners of
[UFC 332](https://www.ufc.com/event/ufc-332) and
[Allen–Duncan](https://www.ufc.com/news/tickets-sale-october-10-october-31-and-november-7-ufc-fight-night-events-meta-apex),
reviewed October 3, 2026. Their lists are partial, not the complete UFC roster or
complete cards. Adding other supported fighters does not require an upcoming bout.

1. Allocate a UUID once for each new fighter, card, and bout. Keep a card's
   `sourceId` (`mma_card:ufc:<allocated UUID>`) and `id` forever. Do not derive IDs
   from a title, headliner, URL, venue, scheduled date, or opponent names. Search
   the checked-in catalog before allocating; fighter profile slugs can change.
2. Rename fighters or cards in place. Keep a bout ID when its opponent changes;
   replace its entire fighter list. A known fighter with an unknown opponent has
   a one-element fighter list. Do not invent an opponent subject.
3. Set `boutsComplete: false` unless the reviewed source is explicitly complete
   for that specific card. Partial lists merge by bout ID; omitted bouts remain.
   Complete lists replace only that card's bouts. An explicit cancelled bout
   removes its active fighter associations even in a partial import. Don't delete
   fighter subjects just because they withdrew or have no upcoming card.
4. Card metadata is a full, reviewed snapshot, even when the bout list is partial.
   Missing source fields are **not** permission to clear known metadata: retain
   prior confirmed values. Venue and all timing keys are required. Use early: null
   only when the card has no separate early-prelim segment.
   Advance `reviewedAt` for each update. Older card snapshots are ignored. Reuse
   the same revision and payload for retries.
5. Mark a cancelled card `availability: "cancelled"`; do not delete it. For a
   postponement without a confirmed replacement time, mark it cancelled while
   retaining the last confirmed start and timings. It remains absent from dated
   schedules/reminders until reactivated with confirmed times and the same ID.
6. Imports rebuild UFC feed edges for each included card only, inside the same
   transaction as the card update. They never remove omitted cards, unrelated
   league edges, users, or subscriptions. Numbered cards match both coverage
   subjects. Only fighters in scheduled bouts match fighter follows.

## Time policy

Store confirmed early-prelim, prelim, and main-card broadcast instants in UTC.
Resolve the source's local time using the named IANA zone and the date (including
DST); don't apply a fixed UTC offset year-round. Verify unusual DST ambiguity
against the source's published offset. Never estimate individual bout times.

Every imported card must supply a confirmed event-level startsAt instant, chosen
as the earliest confirmed broadcast start. It is the single scheduling anchor,
using the same local-day and DST behavior as sports games. The MMA details.timings
object supplies required early/prelims/main keys for email and schedule
enrichment. Early is null only when there is no separate early-prelim segment.
Prelims and main must be confirmed instants, ordered after any early-prelim start.
Never fabricate an instant. The venue is a required title/location struct.

Hold new cards without confirmed event/main-card times out of the import. Missing
timings in a partial source update do not erase the last confirmed values: carry
those values forward in the reviewed import. If the source confirms a postponement
without a replacement time, explicitly mark the card cancelled/inactive while
retaining its last confirmed instants. Reactivate the same ID with its revised
startsAt and timings once confirmed. Absence from a partial source alone never
cancels a card.

## Validation and rollout

Run `pnpm build`, `pnpm test`, `pnpm lint`, and `pnpm typecheck`. For the real
PostgreSQL import/selection test, create an empty local database named
`dtpt_ufc_test` and run:

```sh
UFC_TEST_DATABASE_URL=postgresql://USER@127.0.0.1:5432/dtpt_ufc_test \
  pnpm exec vitest run packages/data/src/mma/import.test.ts
```

The test rejects remote hosts/other database names and rolls back its migrations
and writes. The cloud infrastructure test requires deployment and is a separate,
explicit operational step.

No new database migration or subscription backfill is required. The event table
and required startsAt field retain their current shape. Release all API/jobs/web
readers with support for the new variants before enabling catalog revision
2026-10-08.1. The importer is PR 2 and UI is PR 3: keep catalog publication gated
until the complete stack is ready. The standard Alchemy action seeds during
deployment, so coordinate that action with the reader rollout. Rolling readers
back after publishing UFC data requires removing/archiving that data and its
subscriptions first.

Before a production rollout, refresh the small initial catalog and expand the
supported fighter/card horizon as needed. This version uses reviewed, checked-in
updates; it does not poll UFC or guarantee a complete roster/schedule.
