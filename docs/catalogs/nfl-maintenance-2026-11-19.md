# NFL schedule audit — November 19, 2026

Coverage: all 32 supported teams, November 19–December 2 inclusive in America/New_York (29 games), all 24 active late-season midnight placeholders, and the nearest incomplete postseason round (six wild-card slots). Initial activation was completed November 17. This run preserves every identity, participant, status and feed association.

Three verified Week 12 corrections: Raiders at Browns to November 29 8:20 p.m. EST (November 30 01:20 UTC); Patriots at Chargers to November 29 4:05 p.m. EST (21:05 UTC); Titans at Jaguars to November 29 1 p.m. EST (18:00 UTC). EST is UTC−05:00. NFL's November 17 announcement supersedes the original May schedule; ESPN independently agrees with all three and marks their times valid. The other 26 window games agree with the official final Week 11/12 announcements and provider. No cancellation/postponement appears in those records.

## Unresolved product blocker

All 24 midnight-Eastern entries still have ESPN `timeValid: false` and official TBD assignments (four Week 16, four Week 17, sixteen Week 18). The stored dates are placeholders too. No truthful catalog-only replacement exists: `packages/core/src/modules/events/schema.ts` requires a UTC instant and permits only active/cancelled; database starts are non-null. Seed omission does not delete stored events; sports feed edges are additive in `packages/data/src/seed/catalog.ts`. Removing feeds cannot reconcile existing subscribers. These entries remain a known product defect, not verified kickoffs. Do not cancel games merely because assignments are unknown. A separate product change must represent unknown kickoff and reconcile persistence, or later official assignments must correct these same IDs. No schema/UI redesign here.

No postseason additions qualify: all six ESPN wild-card slots have TBD opponents and invalid times; FBSchedules also lacks named opponents. The official postseason route redirects to regular season. No standings-derived fixtures. Three relevant routes for missing late-season facts: original official release, current official week schedules, ESPN validity records. Three postseason routes: P/Q/R. They do not establish actual fixtures; no guessed dates/times imported. Targeted searches for later flexes/assignments surfaced no additional confirmed change in this run; later regular-season weeks are not claimed fully audited.

## Sources

All sources retrieved November 19, 2026; live schedules/provider responses have no publication date. References in the ledger resolve to these full URLs. Actual content was read. ESPN is a separately operated schedule/validity confirmation, not counted as a second official announcement. NFL/team republications share the announcement's provenance.

- A (November 9, 2026), final Week 11 schedule: https://media.nfl.com/content/dam/communications/documents/2026/Week%2011%20Schedule%20Change.pdf
- B (November 17, 2026), final Week 12 schedule and three flex changes: https://media.nfl.com/news-and-releases/week-12-flex-scheduling--raiders-browns-to-sunday-night--patriot
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

## Per-game decision ledger

Participants are away at home, unchanged. Existing status is active throughout. Provider IDs below map to existing UUID `00000000-0000-4000-8000-000<ID>` and source ID `sports_game:espn:<UUID>`. Current values precede this patch; all instants are UTC. For blocked rows no valid proposed status/start exists.

| ESPN ID   | Week      | Participants                                  | Current start        | Proposed start/status and decision                | Evidence/claims                            |
| --------- | --------- | --------------------------------------------- | -------------------- | ------------------------------------------------- | ------------------------------------------ |
| 401873066 | 11        | Indianapolis Colts at Houston Texans          | 2026-11-20T01:15:00Z | 2026-11-20T01:15:00Z; active; unchanged           | A: same start; E11: timeValid=true         |
| 401873070 | 11        | Miami Dolphins at Buffalo Bills               | 2026-11-22T18:00:00Z | 2026-11-22T18:00:00Z; active; unchanged           | A: same start; E11: timeValid=true         |
| 401873071 | 11        | New Orleans Saints at Chicago Bears           | 2026-11-22T18:00:00Z | 2026-11-22T18:00:00Z; active; unchanged           | A: same start; E11: timeValid=true         |
| 401873073 | 11        | Tennessee Titans at Dallas Cowboys            | 2026-11-22T18:00:00Z | 2026-11-22T18:00:00Z; active; unchanged           | A: same start; E11: timeValid=true         |
| 401873072 | 11        | Tampa Bay Buccaneers at Detroit Lions         | 2026-11-22T18:00:00Z | 2026-11-22T18:00:00Z; active; unchanged           | A: same start; E11: timeValid=true         |
| 401873067 | 11        | Arizona Cardinals at Kansas City Chiefs       | 2026-11-22T18:00:00Z | 2026-11-22T18:00:00Z; active; unchanged           | A: same start; E11: timeValid=true         |
| 401873076 | 11        | Pittsburgh Steelers at Philadelphia Eagles    | 2026-11-22T18:00:00Z | 2026-11-22T18:00:00Z; active; unchanged           | A: same start; E11: timeValid=true         |
| 401873068 | 11        | Baltimore Ravens at Carolina Panthers         | 2026-11-22T18:00:00Z | 2026-11-22T18:00:00Z; active; unchanged           | A: same start; E11: timeValid=true         |
| 401873074 | 11        | New York Jets at Los Angeles Chargers         | 2026-11-22T21:05:00Z | 2026-11-22T21:05:00Z; active; unchanged           | A: same start; E11: timeValid=true         |
| 401873075 | 11        | Las Vegas Raiders at Denver Broncos           | 2026-11-22T21:25:00Z | 2026-11-22T21:25:00Z; active; unchanged           | A: same start; E11: timeValid=true         |
| 401873069 | 11        | Jacksonville Jaguars at New York Giants       | 2026-11-22T21:25:00Z | 2026-11-22T21:25:00Z; active; unchanged           | A: same start; E11: timeValid=true         |
| 401873077 | 11        | Minnesota Vikings at San Francisco 49ers      | 2026-11-23T01:20:00Z | 2026-11-23T01:20:00Z; active; unchanged           | A: same start; E11: timeValid=true         |
| 401873078 | 11        | Cincinnati Bengals at Washington Commanders   | 2026-11-24T01:15:00Z | 2026-11-24T01:15:00Z; active; unchanged           | A: same start; E11: timeValid=true         |
| 401873079 | 12        | Green Bay Packers at Los Angeles Rams         | 2026-11-26T01:00:00Z | 2026-11-26T01:00:00Z; active; unchanged           | B: same start; E12: timeValid=true         |
| 401873081 | 12        | Chicago Bears at Detroit Lions                | 2026-11-26T18:00:00Z | 2026-11-26T18:00:00Z; active; unchanged           | B: same start; E12: timeValid=true         |
| 401873080 | 12        | Philadelphia Eagles at Dallas Cowboys         | 2026-11-26T21:30:00Z | 2026-11-26T21:30:00Z; active; unchanged           | B: same start; E12: timeValid=true         |
| 401873082 | 12        | Kansas City Chiefs at Buffalo Bills           | 2026-11-27T01:20:00Z | 2026-11-27T01:20:00Z; active; unchanged           | B: same start; E12: timeValid=true         |
| 401873083 | 12        | Denver Broncos at Pittsburgh Steelers         | 2026-11-27T20:00:00Z | 2026-11-27T20:00:00Z; active; unchanged           | B: same start; E12: timeValid=true         |
| 401873087 | 12        | New Orleans Saints at Cincinnati Bengals      | 2026-11-29T18:00:00Z | 2026-11-29T18:00:00Z; active; unchanged           | B: same start; E12: timeValid=true         |
| 401873088 | 12        | New York Giants at Indianapolis Colts         | 2026-11-29T18:00:00Z | 2026-11-29T18:00:00Z; active; unchanged           | B: same start; E12: timeValid=true         |
| 401873089 | 12        | New York Jets at Miami Dolphins               | 2026-11-29T18:00:00Z | 2026-11-29T18:00:00Z; active; unchanged           | B: same start; E12: timeValid=true         |
| 401873084 | 12        | Atlanta Falcons at Minnesota Vikings          | 2026-11-29T18:00:00Z | 2026-11-29T18:00:00Z; active; unchanged           | B: same start; E12: timeValid=true         |
| 401873090 | 12        | Tennessee Titans at Jacksonville Jaguars      | 2026-11-29T21:05:00Z | 2026-11-29T18:00:00Z; active; verified correction | B: same start; E12: timeValid=true         |
| 401873085 | 12        | Baltimore Ravens at Houston Texans            | 2026-11-29T18:00:00Z | 2026-11-29T18:00:00Z; active; unchanged           | B: same start; E12: timeValid=true         |
| 401873093 | 12        | New England Patriots at Los Angeles Chargers  | 2026-11-30T01:20:00Z | 2026-11-29T21:05:00Z; active; verified correction | B: same start; E12: timeValid=true         |
| 401873092 | 12        | Washington Commanders at Arizona Cardinals    | 2026-11-29T21:25:00Z | 2026-11-29T21:25:00Z; active; unchanged           | B: same start; E12: timeValid=true         |
| 401873091 | 12        | Seattle Seahawks at San Francisco 49ers       | 2026-11-29T21:25:00Z | 2026-11-29T21:25:00Z; active; unchanged           | B: same start; E12: timeValid=true         |
| 401873086 | 12        | Las Vegas Raiders at Cleveland Browns         | 2026-11-29T18:00:00Z | 2026-11-30T01:20:00Z; active; verified correction | B: same start; E12: timeValid=true         |
| 401873094 | 12        | Carolina Panthers at Tampa Bay Buccaneers     | 2026-12-01T01:15:00Z | 2026-12-01T01:15:00Z; active; unchanged           | B: same start; E12: timeValid=true         |
| 401873146 | 16        | Tampa Bay Buccaneers at Atlanta Falcons       | 2026-12-27T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N16: unassigned; E16: timeValid=false    |
| 401873145 | 16        | Cincinnati Bengals at Indianapolis Colts      | 2026-12-27T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N16: unassigned; E16: timeValid=false    |
| 401873147 | 16        | Washington Commanders at Minnesota Vikings    | 2026-12-27T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N16: unassigned; E16: timeValid=false    |
| 401873144 | 16        | Carolina Panthers at Pittsburgh Steelers      | 2026-12-27T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N16: unassigned; E16: timeValid=false    |
| 401873157 | 17        | Denver Broncos at New England Patriots        | 2027-01-03T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N17: unassigned; E17: timeValid=false    |
| 401873158 | 17        | Kansas City Chiefs at Los Angeles Chargers    | 2027-01-03T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N17: unassigned; E17: timeValid=false    |
| 401873159 | 17        | Los Angeles Rams at Tampa Bay Buccaneers      | 2027-01-03T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N17: unassigned; E17: timeValid=false    |
| 401873160 | 17        | Washington Commanders at Jacksonville Jaguars | 2027-01-03T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N17: unassigned; E17: timeValid=false    |
| 401873181 | 18        | New York Jets at Buffalo Bills                | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401873174 | 18        | Cleveland Browns at Cincinnati Bengals        | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401873179 | 18        | Los Angeles Chargers at Denver Broncos        | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401873176 | 18        | Detroit Lions at Green Bay Packers            | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401873177 | 18        | Jacksonville Jaguars at Indianapolis Colts    | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401873178 | 18        | Las Vegas Raiders at Kansas City Chiefs       | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401873185 | 18        | Seattle Seahawks at Los Angeles Rams          | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401873173 | 18        | Chicago Bears at Minnesota Vikings            | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401873180 | 18        | Miami Dolphins at New England Patriots        | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401873186 | 18        | Tampa Bay Buccaneers at New Orleans Saints    | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401873182 | 18        | Philadelphia Eagles at New York Giants        | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401873184 | 18        | San Francisco 49ers at Arizona Cardinals      | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401873175 | 18        | Dallas Cowboys at Washington Commanders       | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401873172 | 18        | Atlanta Falcons at Carolina Panthers          | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401873183 | 18        | Pittsburgh Steelers at Baltimore Ravens       | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401873187 | 18        | Tennessee Titans at Houston Texans            | 2027-01-10T05:00:00Z | Date/start TBD; blocked; no mutation              | D/N18: unassigned; E18: timeValid=false    |
| 401872910 | Wild card | TBD at TBD                                    | absent               | Withheld; opponents/date/start unconfirmed        | P/Q/R: unnamed fixtures; Q timeValid=false |
| 401872911 | Wild card | TBD at TBD                                    | absent               | Withheld; opponents/date/start unconfirmed        | P/Q/R: unnamed fixtures; Q timeValid=false |
| 401872912 | Wild card | TBD at TBD                                    | absent               | Withheld; opponents/date/start unconfirmed        | P/Q/R: unnamed fixtures; Q timeValid=false |
| 401872913 | Wild card | TBD at TBD                                    | absent               | Withheld; opponents/date/start unconfirmed        | P/Q/R: unnamed fixtures; Q timeValid=false |
| 401872914 | Wild card | TBD at TBD                                    | absent               | Withheld; opponents/date/start unconfirmed        | P/Q/R: unnamed fixtures; Q timeValid=false |
| 401872915 | Wild card | TBD at TBD                                    | absent               | Withheld; opponents/date/start unconfirmed        | P/Q/R: unnamed fixtures; Q timeValid=false |

## Resume state

Branch `t3/audit-nfl-schedule`, existing scheduled isolated checkout. Base `773e8afcdae6eaa03a34c9999c16208e34c0e502`; fetched main before editing and final seed selection. Prior NFL correction #220 is merged; no open same-league PR existed. Reviewed recent merged main and November 17 ledger. Open UFC #221 uses November 19 `.1`, NCAAM #222 uses `.2`; use `2026-11-19.3` and reconcile again if another catalog change lands first. No counts change. PR body records final head and validation.

Remaining: separately resolve the unknown-kickoff product gap; revisit the 24 IDs after announcements, preserving identity; check newly confirmed postseason pairings and future flex changes on the next daily run. No production mutation, merge or deployment.
