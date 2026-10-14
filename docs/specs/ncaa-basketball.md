# NCAA Division I Men's Basketball Support

Implementation status: implemented in worktree. Women's support remains future scope.

## 1. Current implementation and gaps

- NCAA men's basketball is supported via `SportLeagueId = "ncaam"` (`packages/core/src/modules/subjects/variants/sport.schema.ts`).
- Web integration is the second PR in the stack; the backend/base PR has no web changes.
- Data lives in `packages/data/src/sports/ncaam/`: 158 subjects and 1,604 confirmed event seeds.
- Seed collections: `packages/data/src/seed/index.ts` includes `ncaamCollection`. Development retains all catalog subjects and trims events/feed edges to the existing development window.
- `CatalogSeedVersion` in `packages/data/src/seed/config.ts` is `2026-10-14.1`.
- Catalog/event source IDs use the existing `sports_game:espn:<uuid>` shape and `00000000-0000-4000-8000-000<espn id>` IDs; IDs are provider-derived.
- Provider changes over 2026 realignment are reflected in the approved rosters.

## 2. Verified 2026-27 scope

12 conferences, 158 deduplicated men's teams. No team appears in more than one approved conference. Football-only moves do not alter basketball membership.

| Conference      | Count |
| --------------- | ----: |
| ACC             |    18 |
| American        |    13 |
| Atlantic 10     |    14 |
| Big 12          |    16 |
| Big East        |    11 |
| Big Ten         |    18 |
| MAC             |    12 |
| Missouri Valley |    11 |
| Mountain West   |    10 |
| Pac-12          |     9 |
| SEC             |    16 |
| West Coast      |    10 |

Pac-12 members (outside the original 11-conference scope but approved for implementation): Boise State, Colorado State, Fresno State, Gonzaga, Oregon State, San Diego State, Texas State, Utah State, Washington State.

Official membership basis:

- NCAA directory filter: https://web3.ncaa.org/directory/memberList?division=I&sportCode=MBB&type=12 (retrieved 2026-10-13)
- Official conference member pages: ACC https://www.theacc.com/schools, American https://theamerican.org/schools, Atlantic 10 https://atlantic10.com/schools, Big 12 https://big12sports.com/schools, Big East https://www.bigeast.com/schools, Big Ten https://bigten.org/schools, MAC https://getsomemaction.com/schools, Missouri Valley https://mvc-sports.com/schools, Mountain West https://themw.com/schools, Pac-12 official roster via member pages, SEC https://www.sec.com/schools, WCC https://wccsports.com/schools
- Effective-date context: ESPN realignment page https://www.espn.com/mens-college-basketball/story/_/id/49973549/college-basketball-conference-changes-realignment (published 2026-09-30); CBS Sports summary (published 2026-07-01).

Catalog totals:

- Pro leagues in seed catalog: 30 NBA + 32 NFL + 30 MLB + 32 NHL = 124 teams.
- NCAA men's: 158 teams.
- Total supported team subjects: 282.

## 3. Provider feasibility and snapshot coverage

ESPN read-only validation on 2026-10-13:

- Groups endpoint returned approved conference rosters with names, abbreviations, ESPN IDs, slugs, and logos. It did not include every NCAA conference in one payload; WCC was absent in that tested payload.
- Scoreboard and team-schedule endpoints provided UTC dates, competitors, neutral-site flags, venues, game type, season type, and time validity.
- Full upcoming query behavior needed care: confirmed 2026-27 team-schedule reads returned preseason framing depending on parameters.

Confirmed snapshot:

- Fetched 3,046 ESPN team-schedule events involving supported teams.
- Retained 1,604 events with `timeValid=true`.
- Excluded 1,442 events with `timeValid=false`; those are not marked cancelled and do not create notification seeds.
- A local `createNcaamEvents` boundary in `packages/data/src/sports/ncaam/events.ts` carries the provider time-valid flag and rejects unconfirmed starts before creating active seeds.
- Noncatalog opponents are retained as participant titles without subject/feed edges.
- One supported game produces one event with feed edges for both supported teams.

Genuine remaining gaps:

- ESPN is undocumented/unofficial; no SLA, quota, pricing, or terms were verified.
- Postponement/cancellation/reschedule semantics were not directly validated.
- Provider schedule completeness is not guaranteed.

## 4. Domain and UI decisions

- Conferences are browse metadata only in v1. There are no conference Subject or subscription paths.
- A team remains `_tag: "sports_team"`; membership is required as `league: { id: "ncaam", conferenceId: "acc" }`. The inner league schema discriminates by `id`, while the outer subject tagged union retains its normal helpers and derived tags. Old flat membership fields are not part of the new team payload; sports-event and MMA payloads are unchanged.
- Users still subscribe to up to four teams, and notification matching still uses the user's local calendar date.
- Women's support should use a separate `ncaaw` league ID or equivalent disambiguated identity model later; only `ncaam` is implemented now.
- Pac-12 is implemented as an approved conference, not treated as an omission.
- Web exposes NCAA through the existing league picker/logo/default render paths with basketball emoji fallback.

## 5. Rollout notes

- Production seed import remains additive and catalog-only; it does not modify users or subscriptions.
- Existing teams are refreshed by the versioned catalog seed before deploying readers of the new nested shape; upsert replaces details under stable subject IDs without a SQL migration.
- Development seeds use the current event/feed trimming window for NCAA as for the other collections.
- Rollback means disabling selection/import rather than deleting subjects, events, or subscriptions.
