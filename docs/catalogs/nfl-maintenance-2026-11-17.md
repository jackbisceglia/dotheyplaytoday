# NFL schedule audit — November 17, 2026

Initial activation: November 17, 2026, America/New_York. Retrieved November 17,
2026 (approximately 11:00 UTC). Coverage: all 32 supported teams; the 29 games
on November 17–30 local dates, plus all 24 active late-season midnight entries
and the nearest incomplete postseason round. No subject or participant changes.

## Decisions

Correct two November 22 starts in place: Jaguars at Giants to 21:25 UTC
(4:25 p.m. EST), Steelers at Eagles to 18:00 UTC (1 p.m. EST). EST is UTC−05:00.
The remaining 27 window games agree with the official schedule and ESPN;
all 29 have ESPN `timeValid: true`. No postponement/cancellation is shown in
these sources. This is a dated snapshot, not a guarantee against subsequent flexes.

**Product blocker:** 24 existing active starts at 05:00 UTC are placeholders,
not confirmed midnight kickoffs. ESPN reports `timeValid: false`; official
material leaves their dates/times unassigned. Four are in Week 16, four in
Week 17, and all sixteen Week 18 games are affected. Do not treat the stored
Sunday dates as confirmed assignments. No truthful catalog-only correction
exists yet: `EventAvailability` allows only `active` and `cancelled`, and
`startsAt` is required in both schema and database. Cancellation would be false.
Deleting entries would leave stored events; removing feed IDs also cannot fix
existing feeds because `seedCatalog` only adds feed edges. The unresolved rows
remain a known product defect, not verified starts. A separate product change
must support unknown kickoff/inactive scheduling and reconcile stored events
and feeds, or future confirmed announcements must replace these times in place.
No schema redesign is included here.

No postseason games qualify: ESPN's six wild-card slots have TBD opponents
and invalid times. FBSchedules likewise has unnamed matchups. The official
postseason URL redirects to the regular-season schedule. No teams are inferred
from standings. Later rounds are withheld until actual fixtures are announced.

## Sources and provenance

All URLs below were read November 17, 2026. Publication dates are given where
available; live provider responses have no publication date. Source references
in each ledger row resolve to these full URLs.

- A (published November 9, 2026): NFL announcement, both changed starts and final Week 11 schedule:
  https://media.nfl.com/content/dam/communications/documents/2026/Week%2011%20Schedule%20Change.pdf
- B (published November 9, 2026): Kevin Kelley, FBSchedules; reports the NFL announcement, so it is corroborating reporting of that announcement, not a second independent originating announcement:
  https://fbschedules.com/nfl-schedule-2026-two-changes-announced-for-week-11/
- C (published November 9, 2026): Steelers team announcement, confirms 1 p.m. kickoff:
  https://www.steelers.com/news/steelers-eagles-game-flexed
- D (published May 14, 2026): official weekly schedule, Week 12 starts and late-season TBD designations:
  https://media.nfl.com/content/dam/communications/football-communications/2026/news/05%2014%2026%20-%202026%20NFL%20Schedule%20-%20By%20Week.pdf
- N12 (live): https://www.nfl.com/schedules/2026/by-week/week-12
- N16 (live): https://www.nfl.com/schedules/2026/by-week/week-16
- N17 (live): https://www.nfl.com/schedules/2026/by-week/week-17
- N18 (live): https://www.nfl.com/schedules/2026/by-week/week-18
- E11 (live ESPN provider schedule, independent time/validity confirmation): https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=2026&seasontype=2&week=11&limit=1000
- E12 (live ESPN provider schedule, independent time/validity confirmation): https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=2026&seasontype=2&week=12&limit=1000
- E16 (live ESPN provider schedule, independent time/validity confirmation): https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=2026&seasontype=2&week=16&limit=1000
- E17 (live ESPN provider schedule, independent time/validity confirmation): https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=2026&seasontype=2&week=17&limit=1000
- E18 (live ESPN provider schedule, independent time/validity confirmation): https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=2026&seasontype=2&week=18&limit=1000
- P (live): https://fbschedules.com/nfl-playoff-schedule/
- Q (live): https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=2026&seasontype=3&week=1&limit=1000
- R (redirect, no postseason fixture evidence): https://www.nfl.com/schedules/2026/post1/

For unresolved late-season times, three public routes were inspected: official
release PDF, current official week schedule, and ESPN with validity flags.
They agree that no assigned kickoff is available; searching for invented exact
times is unwarranted. For postseason the three routes are P/Q/R above.
An initial mistyped PDF URL containing `05%2014%202026` was inaccessible;
the correct `05%2014%2026` URL D was accessible. No access control was bypassed.
Broadcast labels differ between some sources; broadcasts are outside this change.

## Per-game decision ledger

Participants below are away at home and remain unchanged. All existing rows
have `availability: active`. IDs are stable ESPN IDs; existing UUIDs are
`00000000-0000-4000-8000-000<ID>` and source IDs are
`sports_game:espn:<UUID>`. “Blocked” means unknown date/start, not cancelled;
there is no schema-valid proposed replacement. All timestamps are UTC.

| ESPN ID   | Week      | Participants                                  | Current start        | Proposed start/status and decision                | Evidence/claims                         |
| --------- | --------- | --------------------------------------------- | -------------------- | ------------------------------------------------- | --------------------------------------- |
| 401873066 | 11        | Indianapolis Colts at Houston Texans          | 2026-11-20T01:15:00Z | 2026-11-20T01:15:00Z; active; unchanged           | A/B; E11: timeValid=true, same start    |
| 401873067 | 11        | Arizona Cardinals at Kansas City Chiefs       | 2026-11-22T18:00:00Z | 2026-11-22T18:00:00Z; active; unchanged           | A/B; E11: timeValid=true, same start    |
| 401873068 | 11        | Baltimore Ravens at Carolina Panthers         | 2026-11-22T18:00:00Z | 2026-11-22T18:00:00Z; active; unchanged           | A/B; E11: timeValid=true, same start    |
| 401873069 | 11        | Jacksonville Jaguars at New York Giants       | 2026-11-22T18:00:00Z | 2026-11-22T21:25:00Z; active; verified correction | A/B; E11: timeValid=true, same start    |
| 401873070 | 11        | Miami Dolphins at Buffalo Bills               | 2026-11-22T18:00:00Z | 2026-11-22T18:00:00Z; active; unchanged           | A/B; E11: timeValid=true, same start    |
| 401873071 | 11        | New Orleans Saints at Chicago Bears           | 2026-11-22T18:00:00Z | 2026-11-22T18:00:00Z; active; unchanged           | A/B; E11: timeValid=true, same start    |
| 401873072 | 11        | Tampa Bay Buccaneers at Detroit Lions         | 2026-11-22T18:00:00Z | 2026-11-22T18:00:00Z; active; unchanged           | A/B; E11: timeValid=true, same start    |
| 401873073 | 11        | Tennessee Titans at Dallas Cowboys            | 2026-11-22T18:00:00Z | 2026-11-22T18:00:00Z; active; unchanged           | A/B; E11: timeValid=true, same start    |
| 401873074 | 11        | New York Jets at Los Angeles Chargers         | 2026-11-22T21:05:00Z | 2026-11-22T21:05:00Z; active; unchanged           | A/B; E11: timeValid=true, same start    |
| 401873075 | 11        | Las Vegas Raiders at Denver Broncos           | 2026-11-22T21:25:00Z | 2026-11-22T21:25:00Z; active; unchanged           | A/B; E11: timeValid=true, same start    |
| 401873076 | 11        | Pittsburgh Steelers at Philadelphia Eagles    | 2026-11-22T21:25:00Z | 2026-11-22T18:00:00Z; active; verified correction | A/B/C; E11: timeValid=true, same start  |
| 401873077 | 11        | Minnesota Vikings at San Francisco 49ers      | 2026-11-23T01:20:00Z | 2026-11-23T01:20:00Z; active; unchanged           | A/B; E11: timeValid=true, same start    |
| 401873078 | 11        | Cincinnati Bengals at Washington Commanders   | 2026-11-24T01:15:00Z | 2026-11-24T01:15:00Z; active; unchanged           | A/B; E11: timeValid=true, same start    |
| 401873079 | 12        | Green Bay Packers at Los Angeles Rams         | 2026-11-26T01:00:00Z | 2026-11-26T01:00:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873081 | 12        | Chicago Bears at Detroit Lions                | 2026-11-26T18:00:00Z | 2026-11-26T18:00:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873080 | 12        | Philadelphia Eagles at Dallas Cowboys         | 2026-11-26T21:30:00Z | 2026-11-26T21:30:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873082 | 12        | Kansas City Chiefs at Buffalo Bills           | 2026-11-27T01:20:00Z | 2026-11-27T01:20:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873083 | 12        | Denver Broncos at Pittsburgh Steelers         | 2026-11-27T20:00:00Z | 2026-11-27T20:00:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873084 | 12        | Atlanta Falcons at Minnesota Vikings          | 2026-11-29T18:00:00Z | 2026-11-29T18:00:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873085 | 12        | Baltimore Ravens at Houston Texans            | 2026-11-29T18:00:00Z | 2026-11-29T18:00:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873086 | 12        | Las Vegas Raiders at Cleveland Browns         | 2026-11-29T18:00:00Z | 2026-11-29T18:00:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873087 | 12        | New Orleans Saints at Cincinnati Bengals      | 2026-11-29T18:00:00Z | 2026-11-29T18:00:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873088 | 12        | New York Giants at Indianapolis Colts         | 2026-11-29T18:00:00Z | 2026-11-29T18:00:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873089 | 12        | New York Jets at Miami Dolphins               | 2026-11-29T18:00:00Z | 2026-11-29T18:00:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873090 | 12        | Tennessee Titans at Jacksonville Jaguars      | 2026-11-29T21:05:00Z | 2026-11-29T21:05:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873091 | 12        | Seattle Seahawks at San Francisco 49ers       | 2026-11-29T21:25:00Z | 2026-11-29T21:25:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873092 | 12        | Washington Commanders at Arizona Cardinals    | 2026-11-29T21:25:00Z | 2026-11-29T21:25:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873093 | 12        | New England Patriots at Los Angeles Chargers  | 2026-11-30T01:20:00Z | 2026-11-30T01:20:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873094 | 12        | Carolina Panthers at Tampa Bay Buccaneers     | 2026-12-01T01:15:00Z | 2026-12-01T01:15:00Z; active; unchanged           | D/N12; E12: timeValid=true, same start  |
| 401873144 | 16        | Carolina Panthers at Pittsburgh Steelers      | 2026-12-27T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N16: unassigned; E16: timeValid=false |
| 401873145 | 16        | Cincinnati Bengals at Indianapolis Colts      | 2026-12-27T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N16: unassigned; E16: timeValid=false |
| 401873146 | 16        | Tampa Bay Buccaneers at Atlanta Falcons       | 2026-12-27T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N16: unassigned; E16: timeValid=false |
| 401873147 | 16        | Washington Commanders at Minnesota Vikings    | 2026-12-27T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N16: unassigned; E16: timeValid=false |
| 401873157 | 17        | Denver Broncos at New England Patriots        | 2027-01-03T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N17: unassigned; E17: timeValid=false |
| 401873158 | 17        | Kansas City Chiefs at Los Angeles Chargers    | 2027-01-03T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N17: unassigned; E17: timeValid=false |
| 401873159 | 17        | Los Angeles Rams at Tampa Bay Buccaneers      | 2027-01-03T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N17: unassigned; E17: timeValid=false |
| 401873160 | 17        | Washington Commanders at Jacksonville Jaguars | 2027-01-03T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N17: unassigned; E17: timeValid=false |
| 401873172 | 18        | Atlanta Falcons at Carolina Panthers          | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401873173 | 18        | Chicago Bears at Minnesota Vikings            | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401873174 | 18        | Cleveland Browns at Cincinnati Bengals        | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401873175 | 18        | Dallas Cowboys at Washington Commanders       | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401873176 | 18        | Detroit Lions at Green Bay Packers            | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401873177 | 18        | Jacksonville Jaguars at Indianapolis Colts    | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401873178 | 18        | Las Vegas Raiders at Kansas City Chiefs       | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401873179 | 18        | Los Angeles Chargers at Denver Broncos        | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401873180 | 18        | Miami Dolphins at New England Patriots        | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401873181 | 18        | New York Jets at Buffalo Bills                | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401873182 | 18        | Philadelphia Eagles at New York Giants        | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401873183 | 18        | Pittsburgh Steelers at Baltimore Ravens       | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401873184 | 18        | San Francisco 49ers at Arizona Cardinals      | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401873185 | 18        | Seattle Seahawks at Los Angeles Rams          | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401873186 | 18        | Tampa Bay Buccaneers at New Orleans Saints    | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401873187 | 18        | Tennessee Titans at Houston Texans            | 2027-01-10T05:00:00Z | Date/start TBD; blocked, no mutation              | D/N18: unassigned; E18: timeValid=false |
| 401872910 | Wild card | TBD at TBD                                    | absent               | Withheld: opponents/date/start unconfirmed        | P: TBA; Q: timeValid=false; R: redirect |
| 401872911 | Wild card | TBD at TBD                                    | absent               | Withheld: opponents/date/start unconfirmed        | P: TBA; Q: timeValid=false; R: redirect |
| 401872912 | Wild card | TBD at TBD                                    | absent               | Withheld: opponents/date/start unconfirmed        | P: TBA; Q: timeValid=false; R: redirect |
| 401872913 | Wild card | TBD at TBD                                    | absent               | Withheld: opponents/date/start unconfirmed        | P: TBA; Q: timeValid=false; R: redirect |
| 401872914 | Wild card | TBD at TBD                                    | absent               | Withheld: opponents/date/start unconfirmed        | P: TBA; Q: timeValid=false; R: redirect |
| 401872915 | Wild card | TBD at TBD                                    | absent               | Withheld: opponents/date/start unconfirmed        | P: TBA; Q: timeValid=false; R: redirect |

## Resume and reconciliation

Branch: `t3/audit-nfl-late-season-schedule-1` in the scheduled task's existing
isolated checkout. Base: `d4273652eb2ba04d16d608e0234fd471df07d483`.
No open NFL maintenance PR existed at audit start. Original NFL PR #46 and
recent main history were inspected. Main was fetched again before the seed
bump. Open NCAAF PR #219 uses `2026-11-17.1`; MLB PR #215 uses `.2`, so this
change uses `.3`. Reconcile seed versions against main when these PRs land.
The PR records final head SHA and exact validation. No production changes.

Remaining: resolve the unknown-kickoff product gap separately; revisit the
24 blocked IDs when assignments are announced, preserving identities. Recheck
future flex announcements and newly confirmed postseason fixtures on later runs.
