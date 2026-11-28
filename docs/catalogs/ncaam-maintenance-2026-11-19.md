# NCAAM schedule maintenance — November 19, 2026

Base: `773e8afcdae6eaa03a34c9999c16208e34c0e502`. Branch: `t3/refresh-ncaam-schedule-2`.
Window: November 19–December 2 inclusive, America/New_York (05:00Z boundaries).
All sources retrieved November 19, 2026; live schedules/provider feeds are undated unless noted.
The two postponement announcements were published November 14; Houston's recap November 18.

Preserves 158 supported subjects across the existing 12 conferences. No AP rankings refreshed.
Reviewed all 388 provider games involving those subjects in the window, including decoding
San José State's escaped name. Of these, 230 are unchanged (provider comparison, not a claim
of independent official verification for every unchanged game), 145 verified additions,
eight verified time corrections, and five withheld/disputed. Also deactivates the November 15
Oregon–Pepperdine game: 1,749 stored events, 1,748 active. Automatic title-derived feeds
include every supported participant; unsupported opponents do not acquire subjects.
Existing neutral-site participant role assignments are retained on time corrections.

## Evidence policy and limits

Each imported start agrees between a current official team/venue schedule and ESPN's independent
schedule feed with `timeValid=true`, except Iowa–Prairie View: ESPN's invalid midnight is ignored,
and the official 1 PM CST start is corroborated by AXS's local venue listing. Names and provider
IDs come from the ESPN competition records. Provider midnight/noon is never accepted solely
because it is populated. Timezones in the ledger are school-local schedule zones unless a
source explicitly specifies another zone; UTC conversion uses IANA zones in November standard time.
Raw provider home/away designation changes at neutral sites do not change the actual matchup.

Today's Players Era third-, fifth-, and seventh-place games are explicit confirmed matchups,
not inferred bracket advancement. Houston's stale Nov 20 schedule entry is resolved by its
[dated Nov 18 recap](https://uhcougars.com/news/2026/11/18/-8-7-mens-basketball-vs-1-1-florida),
which explicitly places the title game Thursday at 10 PM CST, agreeing with Kansas and ESPN.
Rutgers's TBD is missing information, not a contradiction of UNLV's confirmed Rutgers listing.
On3 displays Central times in the observed listings; its unlabelled time text alone was not
used to override a conflicting UTC provider value.

Later Players Era 16, Maui, Atlantis, Paradise Jam, and Acrisure conditional rounds remain
excluded unless both actual opponents and a single start are confirmed. Official schedules
reviewed still contain TBD/opponent alternatives; no successive round was inferred. Houston's
March conference/NCAA tournament entries remain TBD. This is a 14-day maintenance pass,
not a complete re-import of all future regular-season starts or proof of complete postseason coverage.
No future postseason addition was verified.

Five decisions remain open: Butler–Nebraska and Colorado–Stanford retain their stored times;
North Texas–Drake, New Mexico–Mississippi Valley State, and Bradley–Chicago State remain absent.
The ledger records distinct official, opponent/venue, and independent routes and the exact
missing fact/conflict. Missing source data never deletes an existing event.
The current schema only supports active/cancelled availability: the postponed Oregon game
keeps its original ID/start/feeds and is deactivated with cancelled availability until a
replacement is confirmed; there is no dedicated postponed product status.

Current main and open PRs were rechecked before editing. No same-league PR existed.
Other open catalog changes: #221 uses `2026-11-19.1`; #215 uses `2026-11-17.2`.
This change reserves `2026-11-19.2`; rebase/recheck the shared version at merge time.
No merge, deployment, production write, email, infrastructure, or schedule-task change.

## Per-game decision ledger

Current and proposed values are UTC start; home; away; status. For withheld rows, proposed
means the investigated candidate, not an applied change. Sources below are full URLs.
All rows share the retrieval date stated above; live sources do not publish a revision date.

| ESPN ID | Current | Proposed | Decision | Source claims |
| --- | --- | --- | --- | --- |
| 401926073 | 2026-11-15T22:00:00Z; Oregon Ducks; Pepperdine Waves; active | 2026-11-15T22:00:00Z; Oregon Ducks; Pepperdine Waves; cancelled availability | verified invalidation. Retain ID, feed edges and original instant; cancelled availability deactivates the invalid start pending confirmed rescheduling. No dedicated postponed state in current schema. | S1: Nov 14 announcement: Nov 15 game postponed; working to reschedule<br>S2: Nov 14 announcement: travel issues; no replacement date |
| 401920517 | absent | 2026-11-19T19:30:00Z; West Virginia Mountaineers; Florida Gators; scheduled | verified addition | S3 ESPN: 2026-11-19T19:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S4: #1 Florida 2026-11-19 2:30 p.m.  (America/New_York)<br>S5: West Virginia 2026-11-19 2:30 (America/New_York) |
| 401920519 | absent | 2026-11-19T22:00:00Z; Auburn Tigers; Notre Dame Fighting Irish; scheduled | verified addition | S3 ESPN: 2026-11-19T22:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S6: Nov 19 4:00 PM CST |
| 401918959 | 2026-11-19T23:00:00Z; Murray State Racers; NC State Wolfpack; active | 2026-11-19T23:00:00Z; Murray State Racers; NC State Wolfpack; scheduled | unchanged | S3 ESPN: 2026-11-19T23:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S7: Murray State 2026-11-19 6 PM (America/New_York)<br>S8: NC State 2026-11-19 5 p.m. (America/Chicago) |
| 401928826 | absent | 2026-11-20T00:00:00Z; Toledo Rockets; Robert Morris Colonials; scheduled | verified addition | S3 ESPN: 2026-11-20T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S9: Robert Morris 2026-11-19 7:00 p.m. (America/New_York) |
| 401916318 | 2026-11-20T00:00:00Z; Ohio State Buckeyes; UMBC Retrievers; active | 2026-11-20T00:00:00Z; Ohio State Buckeyes; UMBC Retrievers; scheduled | unchanged | S3 ESPN: 2026-11-20T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911021 | 2026-11-20T00:00:00Z; St. Bonaventure Bonnies; Buffalo Bulls; active | 2026-11-20T00:00:00Z; St. Bonaventure Bonnies; Buffalo Bulls; scheduled | unchanged | S3 ESPN: 2026-11-20T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401902280 | 2026-11-20T00:00:00Z; Butler Bulldogs; Northeastern Huskies; active | 2026-11-20T00:00:00Z; Butler Bulldogs; Northeastern Huskies; scheduled | unchanged | S3 ESPN: 2026-11-20T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401926814 | absent | 2026-11-20T00:30:00Z; Drake Bulldogs; Charleston Cougars; scheduled | verified addition | S3 ESPN: 2026-11-20T00:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S10: Nov 19 6:30 PM CT |
| 401919005 | 2026-11-20T00:30:00Z; Louisiana Tech Bulldogs; Tulane Green Wave; active | 2026-11-20T00:30:00Z; Louisiana Tech Bulldogs; Tulane Green Wave; scheduled | unchanged | S3 ESPN: 2026-11-20T00:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401906867 | absent | 2026-11-20T01:00:00Z; Texas Longhorns; Southern Utah Thunderbirds; scheduled | verified addition | S3 ESPN: 2026-11-20T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S11: Southern Utah  2026-11-19 7 p.m. CT (America/Chicago) |
| 401918950 | 2026-11-20T01:00:00Z; Louisville Cardinals; Stetson Hatters; active | 2026-11-20T01:00:00Z; Louisville Cardinals; Stetson Hatters; scheduled | unchanged | S3 ESPN: 2026-11-20T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S12: Stetson 2026-11-19 8 p.m. (America/New_York) |
| 401927375 | 2026-11-20T01:00:00Z; Illinois State Redbirds; Eureka Red Devils; active | 2026-11-20T01:00:00Z; Illinois State Redbirds; Eureka Red Devils; scheduled | unchanged | S3 ESPN: 2026-11-20T01:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401919050 | 2026-11-20T01:00:00Z; TCU Horned Frogs; Texas A&M Aggies; active | 2026-11-20T01:00:00Z; TCU Horned Frogs; Texas A&M Aggies; scheduled | unchanged | S3 ESPN: 2026-11-20T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S13: Texas A&M 2026-11-19 7 p.m. (America/Chicago) |
| 401920888 | 2026-11-20T01:30:00Z; Wisconsin Badgers; Seton Hall Pirates; active | 2026-11-20T01:30:00Z; Wisconsin Badgers; Seton Hall Pirates; scheduled | unchanged | S3 ESPN: 2026-11-20T01:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920520 | absent | 2026-11-20T01:30:00Z; UNLV Rebels; Rutgers Scarlet Knights; scheduled | verified addition | S3 ESPN: 2026-11-20T01:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S14: Rutgers 2026-11-19 5:30 PM PT (America/Los_Angeles) |
| 401930884 | absent | 2026-11-20T02:00:00Z; Oregon Ducks; Oregon State Beavers; scheduled | verified addition | S3 ESPN: 2026-11-20T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S15: Oregon State 2026-11-19 6 p.m. PT (America/Los_Angeles)<br>S16: Oregon 2026-11-19 6 p.m. (America/Los_Angeles) |
| 401928354 | absent | 2026-11-20T02:00:00Z; Pepperdine Waves; UC Santa Barbara Gauchos; scheduled | verified addition | S3 ESPN: 2026-11-20T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S17: UC Santa Barbara 2026-11-19 6:00 PM (America/Los_Angeles) |
| 401925941 | absent | 2026-11-20T02:00:00Z; Washington Huskies; Utah Tech Trailblazers; scheduled | verified addition | S3 ESPN: 2026-11-20T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S18: Utah Tech 2026-11-19 6:00 p.m. PT (America/Los_Angeles) |
| 401911534 | 2026-11-20T02:00:00Z; New Mexico State Aggies; UTEP Miners; active | 2026-11-20T02:00:00Z; New Mexico State Aggies; UTEP Miners; scheduled | unchanged | S3 ESPN: 2026-11-20T02:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920349 | absent | 2026-11-20T03:00:00Z; Stanford Cardinal; Sacramento State Hornets; scheduled | verified addition | S3 ESPN: 2026-11-20T03:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S19: Nov 19 7:00 PM PST |
| 401918056 | absent | 2026-11-20T03:00:00Z; California Golden Bears; East Texas A&M Lions; scheduled | verified addition | S3 ESPN: 2026-11-20T03:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S20: East Texas A&M 2026-11-19 7 p.m. PT (America/Los_Angeles) |
| 401917536 | absent | 2026-11-20T03:30:00Z; Santa Clara Broncos; VCU Rams; scheduled | verified addition | S3 ESPN: 2026-11-20T03:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S21: Nov 19 7:30 PM PT |
| 401920518 | absent | 2026-11-20T04:00:00Z; Kansas Jayhawks; Houston Cougars; scheduled | verified addition. Houston schedule says Nov 20, but its dated Nov 18 recap explicitly says Thursday 10 PM CST, agreeing with Kansas schedule and ESPN. Dated recap resolves stale schedule date. | S3 ESPN: 2026-11-20T04:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S22: #8 Houston 2026-11-19 10 p.m. CT (America/Chicago) |
| 401926773 | 2026-11-20T04:00:00Z; USC Trojans; Tarleton State Texans; active | 2026-11-20T04:00:00Z; USC Trojans; Tarleton State Texans; scheduled | unchanged | S3 ESPN: 2026-11-20T04:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S23: Tarleton State 2026-11-19 8:00 p.m. PT (America/Los_Angeles) |
| 401909698 | absent | 2026-11-20T17:00:00Z; Florida State Seminoles; Green Bay Phoenix; scheduled | verified addition | S24 ESPN: 2026-11-20T17:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S25: Green Bay 2026-11-20 NOON (America/New_York) |
| 401921418 | 2026-11-20T17:30:00Z; Minnesota Golden Gophers; Oklahoma State Cowboys; active | 2026-11-20T17:30:00Z; Minnesota Golden Gophers; Oklahoma State Cowboys; scheduled | unchanged | S24 ESPN: 2026-11-20T17:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S26: Minnesota 2026-11-20 11:30 AM (America/Chicago) |
| 401916122 | 2026-11-20T17:30:00Z; Middle Tennessee Blue Raiders; Temple Owls; active | 2026-11-20T17:30:00Z; Middle Tennessee Blue Raiders; Temple Owls; scheduled | unchanged | S24 ESPN: 2026-11-20T17:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S27: Middle Tennessee 2026-11-20 12:30 PM (America/New_York) |
| 401919019 | 2026-11-20T19:00:00Z; UAB Blazers; George Washington Revolutionaries; active | 2026-11-20T19:00:00Z; UAB Blazers; George Washington Revolutionaries; scheduled | unchanged | S24 ESPN: 2026-11-20T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S28: George Washington 2026-11-20 1 p.m. (America/Chicago)<br>S29: UAB 2026-11-20 2 p.m. (America/New_York) |
| 401920380 | 2026-11-20T20:00:00Z; Virginia Tech Hokies; Northwestern Wildcats; active | 2026-11-20T20:00:00Z; Virginia Tech Hokies; Northwestern Wildcats; scheduled | unchanged | S24 ESPN: 2026-11-20T20:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401916123 | 2026-11-20T20:00:00Z; Stephen F. Austin Lumberjacks; Indiana State Sycamores; active | 2026-11-20T20:00:00Z; Stephen F. Austin Lumberjacks; Indiana State Sycamores; scheduled | unchanged | S24 ESPN: 2026-11-20T20:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920066 | 2026-11-20T21:30:00Z; Liberty Flames; Rhode Island Rams; active | 2026-11-20T21:30:00Z; Liberty Flames; Rhode Island Rams; scheduled | unchanged | S24 ESPN: 2026-11-20T21:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921723 | 2026-11-20T22:00:00Z; Miami Hurricanes; Manhattan Jaspers; active | 2026-11-20T22:00:00Z; Miami Hurricanes; Manhattan Jaspers; scheduled | unchanged | S24 ESPN: 2026-11-20T22:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921419 | 2026-11-20T22:30:00Z; Utah Utes; Dayton Flyers; active | 2026-11-20T22:30:00Z; Utah Utes; Dayton Flyers; scheduled | unchanged | S24 ESPN: 2026-11-20T22:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401916124 | 2026-11-20T23:30:00Z; Southern Illinois Salukis; UT Martin Skyhawks; active | 2026-11-20T22:30:00Z; Southern Illinois Salukis; UT Martin Skyhawks; scheduled | verified correction | S24 ESPN: 2026-11-20T22:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S30: UT Martin 2026-11-20 4:30 PM (CST) (America/Chicago) |
| 401928834 | 2026-11-20T23:00:00Z; Akron Zips; WVU Tech Golden Bears; active | 2026-11-20T23:00:00Z; Akron Zips; WVU Tech Golden Bears; scheduled | unchanged | S24 ESPN: 2026-11-20T23:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401925828 | 2026-11-20T23:30:00Z; App State Mountaineers; North Texas Mean Green; active | 2026-11-20T23:30:00Z; App State Mountaineers; North Texas Mean Green; scheduled | unchanged | S24 ESPN: 2026-11-20T23:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S31: App State 2026-11-20 5:30 PM (America/Chicago) |
| 401920427 | 2026-11-21T00:00:00Z; Virginia Cavaliers; Loyola Maryland Greyhounds; active | 2026-11-21T00:00:00Z; Virginia Cavaliers; Loyola Maryland Greyhounds; scheduled | unchanged | S24 ESPN: 2026-11-21T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401906852 | 2026-11-21T00:00:00Z; Tennessee Volunteers; Coastal Carolina Chanticleers; active | 2026-11-21T00:00:00Z; Tennessee Volunteers; Coastal Carolina Chanticleers; scheduled | unchanged | S24 ESPN: 2026-11-21T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401927396 | 2026-11-21T00:00:00Z; Western Kentucky Hilltoppers; Richmond Spiders; active | 2026-11-21T00:00:00Z; Western Kentucky Hilltoppers; Richmond Spiders; scheduled | unchanged | S24 ESPN: 2026-11-21T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S32: Western Kentucky 2026-11-20 7:00 PM (America/New_York)<br>S33: Richmond 2026-11-20 6:00 PM (America/Chicago) |
| 401926134 | 2026-11-21T00:00:00Z; Purdue Boilermakers; Oakland Golden Grizzlies; active | 2026-11-21T00:00:00Z; Purdue Boilermakers; Oakland Golden Grizzlies; scheduled | unchanged | S24 ESPN: 2026-11-21T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920922 | 2026-11-21T00:00:00Z; Mount St. Mary's Mountaineers; Western Michigan Broncos; active | 2026-11-21T00:00:00Z; Mount St. Mary's Mountaineers; Western Michigan Broncos; scheduled | unchanged | S24 ESPN: 2026-11-21T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920195 | absent | 2026-11-21T00:00:00Z; Drexel Dragons; Saint Joseph's Hawks; scheduled | verified addition | S24 ESPN: 2026-11-21T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S34: Saint Joseph's 2026-11-20 7 p.m. (America/New_York) |
| 401916299 | 2026-11-21T00:00:00Z; Maryland Terrapins; Wagner Seahawks; active | 2026-11-21T00:00:00Z; Maryland Terrapins; Wagner Seahawks; scheduled | unchanged | S24 ESPN: 2026-11-21T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401909709 | absent | 2026-11-21T00:00:00Z; Pittsburgh Panthers; Central Michigan Chippewas; scheduled | verified addition | S24 ESPN: 2026-11-21T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S35: Central Michigan 2026-11-20 7:00 PM (America/New_York) |
| 401925865 | absent | 2026-11-21T00:30:00Z; Mississippi State Bulldogs; Tulsa Golden Hurricane; scheduled | verified addition | S24 ESPN: 2026-11-21T00:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S36: Tulsa 2026-11-20 6:30 p.m. (America/Chicago)<br>S37: Mississippi State 2026-11-20 6:30 p.m. (America/Chicago) |
| 401909545 | 2026-11-21T00:30:00Z; Xavier Musketeers; Iowa Hawkeyes; active | 2026-11-21T00:30:00Z; Xavier Musketeers; Iowa Hawkeyes; scheduled | unchanged | S24 ESPN: 2026-11-21T00:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921757 | absent | 2026-11-21T01:00:00Z; Vanderbilt Commodores; UCF Knights; scheduled | verified addition | S24 ESPN: 2026-11-21T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S38: Nov 20 UCF 7 PM CST |
| 401925740 | absent | 2026-11-21T01:00:00Z; Arkansas Razorbacks; Mississippi Valley State Delta Devils; scheduled | verified addition | S24 ESPN: 2026-11-21T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S39: Nov 20 Mississippi Valley State 7 PM Central |
| 401935675 | absent | 2026-11-21T01:00:00Z; Pepperdine Waves; West Coast Baptist Eagles; scheduled | verified addition | S24 ESPN: 2026-11-21T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S17: West Coast Baptist 2026-11-20 5:00 PM (America/Los_Angeles) |
| 401929459 | 2026-11-21T01:00:00Z; SMU Mustangs; South Alabama Jaguars; active | 2026-11-21T01:00:00Z; SMU Mustangs; South Alabama Jaguars; scheduled | unchanged | S24 ESPN: 2026-11-21T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S40: South Alabama 2026-11-20 7 p.m. CT (America/Chicago) |
| 401919784 | absent | 2026-11-21T01:00:00Z; Missouri Tigers; Le Moyne Dolphins; scheduled | verified addition | S24 ESPN: 2026-11-21T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S41: Nov 20 7 PM CST |
| 401916290 | 2026-11-21T01:00:00Z; Indiana Hoosiers; Kentucky Wildcats; active | 2026-11-21T01:00:00Z; Indiana Hoosiers; Kentucky Wildcats; scheduled | unchanged | S24 ESPN: 2026-11-21T01:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401916125 | 2026-11-21T02:00:00Z; Utah Valley Wolverines; East Carolina Pirates; active | 2026-11-21T01:00:00Z; East Carolina Pirates; Utah Valley Wolverines; scheduled | verified correction. Correct tipoff; retain existing neutral-site role assignment. | S24 ESPN: 2026-11-21T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S42: Utah Valley 2026-11-20 8:00 P.M. (America/New_York) |
| 401909799 | absent | 2026-11-21T01:00:00Z; Kansas State Wildcats; Campbell Fighting Camels; scheduled | verified addition | S24 ESPN: 2026-11-21T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S43: Campbell 2026-11-20 7 p.m. CT (America/Chicago) |
| 401906784 | 2026-11-21T01:00:00Z; Georgia Tech Yellow Jackets; Georgia Bulldogs; active | 2026-11-21T01:00:00Z; Georgia Tech Yellow Jackets; Georgia Bulldogs; scheduled | unchanged | S24 ESPN: 2026-11-21T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S44: Georgia Tech 2026-11-20 8:00 (America/New_York) |
| 401913529 | 2026-11-21T02:00:00Z; Illinois Fighting Illini; Eastern Illinois Panthers; active | 2026-11-21T02:00:00Z; Illinois Fighting Illini; Eastern Illinois Panthers; scheduled | unchanged | S24 ESPN: 2026-11-21T02:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401928795 | absent | 2026-11-21T02:00:00Z; Boise State Broncos; Sam Houston Bearkats; scheduled | verified addition | S24 ESPN: 2026-11-21T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S45: Sam Houston 2026-11-20 7 PM (America/Denver) |
| 401912710 | 2026-11-21T02:00:00Z; North Carolina Tar Heels; Marshall Thundering Herd; active | 2026-11-21T02:00:00Z; North Carolina Tar Heels; Marshall Thundering Herd; scheduled | unchanged | S24 ESPN: 2026-11-21T02:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401925664 | absent | 2026-11-21T03:00:00Z; Fresno State Bulldogs; Alabama State Hornets; scheduled | verified addition | S24 ESPN: 2026-11-21T03:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S46: Alabama State  2026-11-20 7:00 p.m. PT (America/Los_Angeles) |
| 401911252 | absent | 2026-11-21T04:00:00Z; Saint Mary's Gaels; Saint Louis Billikens; scheduled | verified addition | S24 ESPN: 2026-11-21T04:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S47: Saint Louis 2026-11-20 8:00 PM (America/Los_Angeles) |
| 401925756 | 2026-11-21T17:00:00Z; Michigan State Spartans; Detroit Mercy Titans; active | 2026-11-21T17:00:00Z; Michigan State Spartans; Detroit Mercy Titans; scheduled | unchanged | S48 ESPN: 2026-11-21T17:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921811 | absent | 2026-11-21T18:00:00Z; LSU Tigers; Queens University Royals; scheduled | verified addition | S48 ESPN: 2026-11-21T18:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S49: Nov 21 noon CT |
| 401921169 | 2026-11-21T18:00:00Z; Cleveland State Vikings; Kent State Golden Flashes; active | 2026-11-21T18:00:00Z; Cleveland State Vikings; Kent State Golden Flashes; scheduled | unchanged | S48 ESPN: 2026-11-21T18:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920948 | absent | 2026-11-21T18:00:00Z; Eastern Michigan Eagles; Denver Pioneers; scheduled | verified addition | S48 ESPN: 2026-11-21T18:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S50: Denver 2026-11-21 1 p.m. (America/New_York) |
| 401919031 | absent | 2026-11-21T19:00:00Z; Wichita State Shockers; New Mexico Lobos; scheduled | verified addition | S48 ESPN: 2026-11-21T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S51: Nov 21 1 PM CT |
| 401911199 | 2026-11-21T19:00:00Z; Portland Pilots; Fordham Rams; active | 2026-11-21T19:00:00Z; Portland Pilots; Fordham Rams; scheduled | unchanged | S48 ESPN: 2026-11-21T19:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911022 | 2026-11-21T19:00:00Z; Bowling Green Falcons; Northern Illinois Huskies; active | 2026-11-21T19:00:00Z; Bowling Green Falcons; Northern Illinois Huskies; scheduled | unchanged | S48 ESPN: 2026-11-21T19:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401909730 | absent | 2026-11-21T19:00:00Z; Wake Forest Demon Deacons; Western Carolina Catamounts; scheduled | verified addition | S48 ESPN: 2026-11-21T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S52: Western Carolina 2026-11-21 2 p.m. (America/New_York) |
| 401909719 | absent | 2026-11-21T19:00:00Z; Syracuse Orange; Lafayette Leopards; scheduled | verified addition | S48 ESPN: 2026-11-21T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S53: Lafayette 2026-11-21 2 PM (America/New_York) |
| 401927365 | 2026-11-21T20:00:00Z; Missouri State Bears; Drake Bulldogs; active | 2026-11-21T20:00:00Z; Missouri State Bears; Drake Bulldogs; scheduled | unchanged | S48 ESPN: 2026-11-21T20:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921183 | absent | 2026-11-21T21:00:00Z; La Salle Explorers; Pennsylvania Quakers; scheduled | verified addition | S48 ESPN: 2026-11-21T21:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S54: Nov 21 4 PM ET (Penn) |
| 401918995 | absent | 2026-11-21T21:00:00Z; George Mason Patriots; South Florida Bulls; scheduled | verified addition | S48 ESPN: 2026-11-21T21:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S55: George Mason 2026-11-21 4:00 PM (America/New_York) |
| 401917538 | 2026-11-21T21:30:00Z; San Diego Toreros; UC Irvine Anteaters; active | 2026-11-21T21:30:00Z; San Diego Toreros; UC Irvine Anteaters; scheduled | unchanged | S48 ESPN: 2026-11-21T21:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911337 | absent | 2026-11-21T22:00:00Z; UTSA Roadrunners; Air Force Falcons; scheduled | verified addition | S48 ESPN: 2026-11-21T22:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S56: UTSA 2026-11-21 3:00 pm MT (America/Denver) |
| 401911023 | 2026-11-21T23:00:00Z; Massachusetts Minutemen; Maine Black Bears; active | 2026-11-21T23:00:00Z; Massachusetts Minutemen; Maine Black Bears; scheduled | unchanged | S48 ESPN: 2026-11-21T23:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401909517 | 2026-11-21T23:00:00Z; Georgetown Hoyas; Coppin State Eagles; active | 2026-11-21T23:00:00Z; Georgetown Hoyas; Coppin State Eagles; scheduled | unchanged | S48 ESPN: 2026-11-21T23:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921776 | 2026-11-22T00:00:00Z; Villanova Wildcats; Michigan Wolverines; active | 2026-11-22T00:00:00Z; Villanova Wildcats; Michigan Wolverines; scheduled | unchanged | S48 ESPN: 2026-11-22T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S57: Villanova 2026-11-21 7:00 PM (America/New_York) |
| 401917539 | 2026-11-22T00:00:00Z; Loyola Marymount Lions; California Baptist Lancers; active | 2026-11-22T00:00:00Z; Loyola Marymount Lions; California Baptist Lancers; scheduled | unchanged | S48 ESPN: 2026-11-22T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401928998 | 2026-11-22T01:00:00Z; Valparaiso Beacons; Troy Trojans; active | 2026-11-22T01:00:00Z; Valparaiso Beacons; Troy Trojans; scheduled | unchanged | S48 ESPN: 2026-11-22T01:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401917537 | absent | 2026-11-22T03:00:00Z; Pacific Tigers; Bradley Braves; scheduled | verified addition | S48 ESPN: 2026-11-22T03:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S58: Nov 21 7 PM PT |
| 401909567 | 2026-11-22T04:00:00Z; Duke Blue Devils; Washington State Cougars; active | 2026-11-22T04:00:00Z; Duke Blue Devils; Washington State Cougars; scheduled | unchanged | S48 ESPN: 2026-11-22T04:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911024 | 2026-11-22T17:00:00Z; UIC Flames; Miami (OH) RedHawks; active | 2026-11-22T17:00:00Z; UIC Flames; Miami (OH) RedHawks; scheduled | unchanged | S59 ESPN: 2026-11-22T17:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S60: UIC 2026-11-22 12 p.m. (America/New_York) |
| 401902281 | 2026-11-22T18:00:00Z; Nebraska Cornhuskers; Butler Bulldogs; active | 2026-11-22T18:00:00Z; Butler Bulldogs; Nebraska Cornhuskers; scheduled | disputed. Disputed: ESPN/catalog 18:00Z versus both current schools and Ticketmaster 11 AM CST = 17:00Z; no dated correction establishing supersession. Keep stored start and roles. | S59 ESPN: 2026-11-22T18:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S61 attempted; see decision<br>S62 attempted; see decision<br>S63 attempted; see decision |
| 401920736 | 2026-11-22T18:00:00Z; Northwestern Wildcats; Dayton Flyers; active | 2026-11-22T18:00:00Z; Northwestern Wildcats; Dayton Flyers; scheduled | unchanged | S59 ESPN: 2026-11-22T18:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401909527 | 2026-11-22T18:00:00Z; Marquette Golden Eagles; Chicago State Cougars; active | 2026-11-22T18:00:00Z; Marquette Golden Eagles; Chicago State Cougars; scheduled | unchanged | S59 ESPN: 2026-11-22T18:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401928802 | 2026-11-22T19:00:00Z; Western Kentucky Hilltoppers; George Washington Revolutionaries; active | 2026-11-22T19:00:00Z; Western Kentucky Hilltoppers; George Washington Revolutionaries; scheduled | unchanged | S59 ESPN: 2026-11-22T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S29: Western Kentucky 2026-11-22 2 p.m. (America/New_York)<br>S33: George Washington 2026-11-22 1:00 PM (America/Chicago) |
| 401921748 | absent | 2026-11-22T19:00:00Z; Cincinnati Bearcats; UMass Lowell River Hawks; scheduled | verified addition | S59 ESPN: 2026-11-22T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S64: Nov 22 2 PM EST |
| 401921706 | 2026-11-22T19:00:00Z; Duquesne Dukes; Wyoming Cowboys; active | 2026-11-22T19:00:00Z; Duquesne Dukes; Wyoming Cowboys; scheduled | unchanged | S59 ESPN: 2026-11-22T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S65: Wyoming 2026-11-22 2:00 p.m. (America/New_York)<br>S66: Duquesne University 2026-11-22 Noon (America/Denver) |
| 401918988 | absent | 2026-11-22T19:00:00Z; Memphis Tigers; Evansville Purple Aces; scheduled | verified addition | S59 ESPN: 2026-11-22T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S67: Evansville 2026-11-22 1 p.m. (America/Chicago) |
| 401911200 | 2026-11-22T19:00:00Z; Fordham Rams; San Diego Toreros; active | 2026-11-22T19:00:00Z; Fordham Rams; San Diego Toreros; scheduled | unchanged | S59 ESPN: 2026-11-22T19:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401906868 | absent | 2026-11-22T20:00:00Z; Texas Longhorns; Southern Indiana Screaming Eagles; scheduled | verified addition | S59 ESPN: 2026-11-22T20:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S11: Southern Indiana 2026-11-22 2 p.m. CT (America/Chicago) |
| 401929202 | absent | 2026-11-22T20:30:00Z; Texas State Bobcats; McNeese Cowboys; scheduled | verified addition | S59 ESPN: 2026-11-22T20:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S68: Nov 22 2:30 PM CT |
| 401920381 | 2026-11-22T20:30:00Z; Oklahoma State Cowboys; Virginia Tech Hokies; active | 2026-11-22T20:30:00Z; Oklahoma State Cowboys; Virginia Tech Hokies; scheduled | unchanged | S59 ESPN: 2026-11-22T20:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S26: Virginia Tech 2026-11-22 2:30 PM (America/Chicago) |
| 401926795 | 2026-11-22T21:30:00Z; Liberty Flames; Richmond Spiders; active | 2026-11-22T21:30:00Z; Liberty Flames; Richmond Spiders; scheduled | unchanged | S59 ESPN: 2026-11-22T21:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S32: Liberty  2026-11-22 4:30 PM (America/New_York) |
| 401917540 | 2026-11-22T21:30:00Z; Loyola Marymount Lions; UC Irvine Anteaters; active | 2026-11-22T21:30:00Z; Loyola Marymount Lions; UC Irvine Anteaters; scheduled | unchanged | S59 ESPN: 2026-11-22T21:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401925013 | 2026-11-22T22:00:00Z; Lamar Cardinals; Rice Owls; active | 2026-11-22T22:00:00Z; Lamar Cardinals; Rice Owls; scheduled | unchanged | S59 ESPN: 2026-11-22T22:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401909556 | 2026-11-22T22:00:00Z; Boston College Eagles; NJIT Highlanders; active | 2026-11-22T22:00:00Z; Boston College Eagles; NJIT Highlanders; scheduled | unchanged | S59 ESPN: 2026-11-22T22:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401928999 | 2026-11-22T23:00:00Z; Valparaiso Beacons; Southern Miss Golden Eagles; active | 2026-11-22T23:00:00Z; Valparaiso Beacons; Southern Miss Golden Eagles; scheduled | unchanged | S59 ESPN: 2026-11-22T23:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921420 | 2026-11-22T23:00:00Z; Minnesota Golden Gophers; Utah Utes; active | 2026-11-22T23:00:00Z; Minnesota Golden Gophers; Utah Utes; scheduled | unchanged | S59 ESPN: 2026-11-22T23:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920905 | 2026-11-23T00:00:00Z; UCLA Bruins; Delaware Blue Hens; active | 2026-11-23T00:00:00Z; UCLA Bruins; Delaware Blue Hens; scheduled | unchanged | S59 ESPN: 2026-11-23T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401919020 | 2026-11-23T00:00:00Z; UAB Blazers; Rhode Island Rams; active | 2026-11-23T00:00:00Z; UAB Blazers; Rhode Island Rams; scheduled | unchanged | S59 ESPN: 2026-11-23T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S28: Rhode Island 2026-11-22 6 p.m. (America/Chicago) |
| 401917541 | 2026-11-23T00:00:00Z; Portland Pilots; California Baptist Lancers; active | 2026-11-23T00:00:00Z; Portland Pilots; California Baptist Lancers; scheduled | unchanged | S59 ESPN: 2026-11-23T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401926774 | absent | 2026-11-23T01:00:00Z; USC Trojans; Louisiana Ragin' Cajuns; scheduled | verified addition | S59 ESPN: 2026-11-23T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S23: Louisiana 2026-11-22 5:00 p.m. PT (America/Los_Angeles) |
| 401929595 | 2026-11-23T01:00:00Z; Saint Mary's Gaels; Menlo Oaks; active | 2026-11-23T01:00:00Z; Saint Mary's Gaels; Menlo Oaks; scheduled | unchanged | S59 ESPN: 2026-11-23T01:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401917542 | 2026-11-23T02:30:00Z; UC San Diego Tritons; Seattle U Redhawks; active | 2026-11-23T02:30:00Z; UC San Diego Tritons; Seattle U Redhawks; scheduled | unchanged | S59 ESPN: 2026-11-23T02:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911233 | 2026-11-23T04:59:00Z; Loyola Chicago Ramblers; San José State Spartans; active | 2026-11-23T04:59:00Z; Loyola Chicago Ramblers; San José State Spartans; scheduled | unchanged | S59 ESPN: 2026-11-23T04:59:00Z; timeValid=True; STATUS_SCHEDULED |
| 401927397 | 2026-11-23T16:00:00Z; App State Mountaineers; St. Bonaventure Bonnies; active | 2026-11-23T16:00:00Z; App State Mountaineers; St. Bonaventure Bonnies; scheduled | unchanged | S69 ESPN: 2026-11-23T16:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921700 | 2026-11-23T16:00:00Z; Davidson Wildcats; Northern Iowa Panthers; active | 2026-11-23T16:00:00Z; Davidson Wildcats; Northern Iowa Panthers; scheduled | unchanged | S69 ESPN: 2026-11-23T16:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S70: Davidson 2026-11-23 10 a.m. (America/Chicago) |
| 401928830 | 2026-11-23T18:30:00Z; Wright State Raiders; Akron Zips; active | 2026-11-23T18:30:00Z; Wright State Raiders; Akron Zips; scheduled | unchanged | S69 ESPN: 2026-11-23T18:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S71: Wright State 2026-11-23 1:30 PM (America/New_York) |
| 401921701 | 2026-11-23T18:30:00Z; Florida Gulf Coast Eagles; Charlotte 49ers; active | 2026-11-23T18:30:00Z; Florida Gulf Coast Eagles; Charlotte 49ers; scheduled | unchanged | S69 ESPN: 2026-11-23T18:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S72: Florida Gulf Coast 2026-11-23 1:30 PM (America/New_York) |
| 401921658 | 2026-11-23T19:00:00Z; Oregon State Beavers; Tulsa Golden Hurricane; active | 2026-11-23T19:00:00Z; Oregon State Beavers; Tulsa Golden Hurricane; scheduled | unchanged | S69 ESPN: 2026-11-23T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S16: Tulsa 2026-11-23 11 a.m. (America/Los_Angeles)<br>S37: Oregon State 2026-11-23 1 p.m. (America/Chicago) |
| 401918076 | 2026-11-23T19:30:00Z; Clemson Tigers; Ole Miss Rebels; active | 2026-11-23T19:30:00Z; Clemson Tigers; Ole Miss Rebels; scheduled | unchanged | S69 ESPN: 2026-11-23T19:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401929286 | 2026-11-23T21:00:00Z; Belmont Bruins; Yale Bulldogs; active | 2026-11-23T21:00:00Z; Belmont Bruins; Yale Bulldogs; scheduled | unchanged | S69 ESPN: 2026-11-23T21:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401919006 | 2026-11-23T21:00:00Z; Georgia State Panthers; Tulane Green Wave; active | 2026-11-23T21:00:00Z; Georgia State Panthers; Tulane Green Wave; scheduled | unchanged | S69 ESPN: 2026-11-23T21:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911457 | 2026-11-23T21:30:00Z; San Francisco Dons; Nevada Wolf Pack; active | 2026-11-23T21:30:00Z; San Francisco Dons; Nevada Wolf Pack; scheduled | unchanged | S69 ESPN: 2026-11-23T21:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S73: Nevada 2026-11-23 1:30 PM (America/Los_Angeles) |
| 401921708 | 2026-11-23T22:00:00Z; BYU Cougars; Washington Huskies; active | 2026-11-23T22:00:00Z; BYU Cougars; Washington Huskies; scheduled | unchanged | S69 ESPN: 2026-11-23T22:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S18: BYU 2026-11-23 2:00 p.m. PT (America/Los_Angeles) |
| 401911025 | 2026-11-23T23:30:00Z; Buffalo Bulls; RIT Tigers; active | 2026-11-23T23:30:00Z; Buffalo Bulls; RIT Tigers; scheduled | unchanged | S69 ESPN: 2026-11-23T23:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401928838 | 2026-11-24T00:00:00Z; Ball State Cardinals; Spalding Pelicans; active | 2026-11-24T00:00:00Z; Ball State Cardinals; Spalding Pelicans; scheduled | unchanged | S69 ESPN: 2026-11-24T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401925813 | absent | 2026-11-24T00:00:00Z; La Salle Explorers; Penn State Brandywine Lions; scheduled | verified addition | S69 ESPN: 2026-11-24T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S54: Nov 23 7 PM ET |
| 401917543 | 2026-11-24T00:00:00Z; Santa Clara Broncos; Illinois State Redbirds; active | 2026-11-24T00:00:00Z; Santa Clara Broncos; Illinois State Redbirds; scheduled | unchanged | S69 ESPN: 2026-11-24T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401919032 | absent | 2026-11-24T00:30:00Z; Wichita State Shockers; Texas A&M-Corpus Christi Islanders; scheduled | verified addition | S69 ESPN: 2026-11-24T00:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S51: Nov 23 6:30 PM CT |
| 401913530 | 2026-11-24T01:00:00Z; Illinois Fighting Illini; Winthrop Eagles; active | 2026-11-24T01:00:00Z; Illinois Fighting Illini; Winthrop Eagles; scheduled | unchanged | S69 ESPN: 2026-11-24T01:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401909788 | absent | 2026-11-24T01:00:00Z; Kansas Jayhawks; Denver Pioneers; scheduled | verified addition | S69 ESPN: 2026-11-24T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S22: Denver 2026-11-23 7 p.m. CT (America/Chicago) |
| 401913102 | 2026-11-24T01:00:00Z; North Carolina Tar Heels; Monmouth Hawks; active | 2026-11-24T01:00:00Z; North Carolina Tar Heels; Monmouth Hawks; scheduled | unchanged | S69 ESPN: 2026-11-24T01:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401909536 | 2026-11-24T02:00:00Z; Providence Friars; VCU Rams; active | 2026-11-24T02:00:00Z; Providence Friars; VCU Rams; scheduled | unchanged | S69 ESPN: 2026-11-24T02:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401926183 | absent | 2026-11-24T02:30:00Z; Pepperdine Waves; UNC Greensboro Spartans; scheduled | verified addition | S69 ESPN: 2026-11-24T02:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S17: UNC Greensboro 2026-11-23 6:30 PM (America/Los_Angeles) |
| 401920721 | 2026-11-24T03:00:00Z; UNLV Rebels; Eastern Washington Eagles; active | 2026-11-24T03:00:00Z; UNLV Rebels; Eastern Washington Eagles; scheduled | unchanged | S69 ESPN: 2026-11-24T03:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S14: Eastern Washington 2026-11-23 7:00 PM PT (America/Los_Angeles) |
| 401918057 | absent | 2026-11-24T03:00:00Z; California Golden Bears; Alabama State Hornets; scheduled | verified addition | S69 ESPN: 2026-11-24T03:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S20: Alabama State 2026-11-23 7 p.m. PT (America/Los_Angeles) |
| 401909743 | 2026-11-24T04:30:00Z; Arizona Wildcats; Colorado State Rams; active | 2026-11-24T04:30:00Z; Arizona Wildcats; Colorado State Rams; scheduled | unchanged | S69 ESPN: 2026-11-24T04:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S74: Colorado State 2026-11-23 9:30 p.m. MST (America/Phoenix)<br>S75: Arizona 2026-11-23 9:30 p.m. (America/Denver) |
| 401927398 | 2026-11-24T15:00:00Z; St. Bonaventure Bonnies; Wright State Raiders; active | 2026-11-24T15:00:00Z; St. Bonaventure Bonnies; Wright State Raiders; scheduled | unchanged | S76 ESPN: 2026-11-24T15:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401928791 | 2026-11-24T16:00:00Z; New Mexico State Aggies; Ohio Bobcats; active | 2026-11-24T16:00:00Z; New Mexico State Aggies; Ohio Bobcats; scheduled | unchanged | S76 ESPN: 2026-11-24T16:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401928835 | 2026-11-24T17:30:00Z; Akron Zips; Belmont Bruins; active | 2026-11-24T17:30:00Z; Akron Zips; Belmont Bruins; scheduled | unchanged | S76 ESPN: 2026-11-24T17:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S71: Belmont 2026-11-24 12:30 PM (America/New_York) |
| 401928859 | 2026-11-24T18:30:00Z; UIC Flames; Rice Owls; active | 2026-11-24T18:30:00Z; UIC Flames; Rice Owls; scheduled | unchanged | S76 ESPN: 2026-11-24T18:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401906806 | 2026-11-24T18:30:00Z; Pittsburgh Panthers; Oklahoma Sooners; active | 2026-11-24T18:30:00Z; Pittsburgh Panthers; Oklahoma Sooners; scheduled | unchanged | S76 ESPN: 2026-11-24T18:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S35: Oklahoma 2026-11-24 1:30 PM (America/New_York) |
| 401917676 | 2026-11-24T19:00:00Z; San Francisco Dons; Oregon State Beavers; active | 2026-11-24T19:00:00Z; San Francisco Dons; Oregon State Beavers; scheduled | unchanged | S76 ESPN: 2026-11-24T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S73: Oregon State 2026-11-24 11:00 AM (America/Los_Angeles)<br>S16: San Francisco 2026-11-24 11 a.m. (America/Los_Angeles) |
| 401906853 | 2026-11-24T20:00:00Z; Maryland Terrapins; Tennessee Volunteers; active | 2026-11-24T20:00:00Z; Maryland Terrapins; Tennessee Volunteers; scheduled | unchanged | S76 ESPN: 2026-11-24T20:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401915941 | 2026-11-24T20:00:00Z; Miami Hurricanes; TCU Horned Frogs; active | 2026-11-24T20:00:00Z; TCU Horned Frogs; Miami Hurricanes; scheduled | unchanged. Neutral-site provider home/away designation differs; actual participants and start unchanged. Retain catalog roles. | S76 ESPN: 2026-11-24T20:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S13: Miami 2026-11-24 2 p.m. (America/Chicago) |
| 401921666 | 2026-11-24T21:30:00Z; Illinois State Redbirds; Tulsa Golden Hurricane; active | 2026-11-24T21:30:00Z; Illinois State Redbirds; Tulsa Golden Hurricane; scheduled | unchanged | S76 ESPN: 2026-11-24T21:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S37: Illinois State 2026-11-24 3:30 p.m. (America/Chicago) |
| 401909495 | 2026-11-24T22:30:00Z; Creighton Bluejays; Michigan Wolverines; active | 2026-11-24T22:30:00Z; Michigan Wolverines; Creighton Bluejays; scheduled | unchanged. Neutral-site provider home/away designation differs; actual participants and start unchanged. Retain catalog roles. | S76 ESPN: 2026-11-24T22:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S57: Creighton 2026-11-24 2:30 PM PT (America/New_York) |
| 401921707 | 2026-11-24T22:30:00Z; Kent State Golden Flashes; Wyoming Cowboys; active | 2026-11-24T22:30:00Z; Kent State Golden Flashes; Wyoming Cowboys; scheduled | unchanged | S76 ESPN: 2026-11-24T22:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S66: Kent State University 2026-11-24 3:30 p.m. (America/Denver) |
| 401909775 | 2026-11-24T22:30:00Z; Iowa State Cyclones; San Diego State Aztecs; active | 2026-11-24T22:30:00Z; Iowa State Cyclones; San Diego State Aztecs; scheduled | unchanged | S76 ESPN: 2026-11-24T22:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S77: San Diego State 2026-11-24 4:30 PM (America/Chicago) |
| 401924877 | 2026-11-24T23:00:00Z; Rutgers Scarlet Knights; Sacred Heart Pioneers; active | 2026-11-24T23:00:00Z; Rutgers Scarlet Knights; Sacred Heart Pioneers; scheduled | unchanged | S76 ESPN: 2026-11-24T23:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401923262 | 2026-11-24T23:00:00Z; Florida Atlantic Owls; Mercer Bears; active | 2026-11-24T23:00:00Z; Florida Atlantic Owls; Mercer Bears; scheduled | unchanged | S76 ESPN: 2026-11-24T23:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920949 | 2026-11-24T23:00:00Z; Kennesaw State Owls; Eastern Michigan Eagles; active | 2026-11-24T23:00:00Z; Kennesaw State Owls; Eastern Michigan Eagles; scheduled | unchanged | S76 ESPN: 2026-11-24T23:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S50: Kennesaw State 2026-11-24 6 p.m. (America/New_York) |
| 401909505 | 2026-11-24T23:00:00Z; Purdue Boilermakers; DePaul Blue Demons; active | 2026-11-24T23:00:00Z; Purdue Boilermakers; DePaul Blue Demons; scheduled | unchanged | S76 ESPN: 2026-11-24T23:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401906774 | absent | 2026-11-25T00:00:00Z; Florida Gators; Milwaukee Panthers; scheduled | verified addition | S76 ESPN: 2026-11-25T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S5: Milwaukee 2026-11-24 7 PM (America/New_York) |
| 401916319 | 2026-11-25T00:00:00Z; Ohio State Buckeyes; Vanderbilt Commodores; active | 2026-11-25T00:00:00Z; Ohio State Buckeyes; Vanderbilt Commodores; scheduled | unchanged | S76 ESPN: 2026-11-25T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921777 | 2026-11-25T00:00:00Z; Villanova Wildcats; Coppin State Eagles; active | 2026-11-25T00:00:00Z; Villanova Wildcats; Coppin State Eagles; scheduled | unchanged | S76 ESPN: 2026-11-25T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920889 | 2026-11-25T00:00:00Z; Seton Hall Pirates; New Hampshire Wildcats; active | 2026-11-25T00:00:00Z; Seton Hall Pirates; New Hampshire Wildcats; scheduled | unchanged | S76 ESPN: 2026-11-25T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920727 | absent | 2026-11-25T00:00:00Z; Iowa Hawkeyes; UMBC Retrievers; scheduled | verified addition | S76 ESPN: 2026-11-25T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S78: Nov 24 UMBC 6 PM CST |
| 401920309 | absent | 2026-11-25T00:00:00Z; Georgia Tech Yellow Jackets; Samford Bulldogs; scheduled | verified addition | S76 ESPN: 2026-11-25T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S79: Nov 24 Samford 7 PM EST |
| 401918996 | absent | 2026-11-25T00:00:00Z; South Florida Bulls; Stetson Hatters; scheduled | verified addition | S76 ESPN: 2026-11-25T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S55: Stetson 2026-11-24 7:00 PM (America/New_York) |
| 401916291 | 2026-11-25T00:00:00Z; Indiana Hoosiers; Jacksonville Dolphins; active | 2026-11-25T00:00:00Z; Indiana Hoosiers; Jacksonville Dolphins; scheduled | unchanged | S76 ESPN: 2026-11-25T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911458 | 2026-11-25T00:00:00Z; Santa Clara Broncos; Nevada Wolf Pack; active | 2026-11-25T00:00:00Z; Santa Clara Broncos; Nevada Wolf Pack; scheduled | unchanged | S76 ESPN: 2026-11-25T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911027 | 2026-11-25T00:00:00Z; Bowling Green Falcons; Gardner-Webb Runnin' Bulldogs; active | 2026-11-25T00:00:00Z; Bowling Green Falcons; Gardner-Webb Runnin' Bulldogs; scheduled | unchanged | S76 ESPN: 2026-11-25T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920414 | absent | 2026-11-25T00:30:00Z; Duquesne Dukes; High Point Panthers; scheduled | verified addition | S76 ESPN: 2026-11-25T00:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S65: High Point 2026-11-24 7:30 p.m. (America/New_York) |
| 401915942 | 2026-11-25T01:00:00Z; Texas Tech Red Raiders; Louisville Cardinals; active | 2026-11-25T01:00:00Z; Louisville Cardinals; Texas Tech Red Raiders; scheduled | unchanged. Neutral-site provider home/away designation differs; actual participants and start unchanged. Retain catalog roles. | S76 ESPN: 2026-11-25T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S12: Texas Tech 2026-11-24 8 p.m. (America/New_York) |
| 401920709 | absent | 2026-11-25T01:00:00Z; Auburn Tigers; Lipscomb Bisons; scheduled | verified addition | S76 ESPN: 2026-11-25T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S6: Nov 24 7:00 PM CST |
| 401911338 | absent | 2026-11-25T01:00:00Z; Air Force Falcons; Army Black Knights; scheduled | verified addition | S76 ESPN: 2026-11-25T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S56: Army 2026-11-24 6:00 pm MT (America/Denver) |
| 401911026 | absent | 2026-11-25T01:00:00Z; Notre Dame Fighting Irish; Central Michigan Chippewas; scheduled | verified addition | S76 ESPN: 2026-11-25T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S80: Nov 24 at Notre Dame 8 PM Eastern |
| 401911535 | 2026-11-25T01:30:00Z; UTEP Miners; Charleston Cougars; active | 2026-11-25T01:30:00Z; UTEP Miners; Charleston Cougars; scheduled | unchanged | S76 ESPN: 2026-11-25T01:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401928796 | absent | 2026-11-25T02:00:00Z; Washington State Cougars; Sam Houston Bearkats; scheduled | verified addition | S76 ESPN: 2026-11-25T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S81: Nov 24 6 PM PST |
| 401922023 | absent | 2026-11-25T02:00:00Z; Boise State Broncos; Idaho State Bengals; scheduled | verified addition | S76 ESPN: 2026-11-25T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S45: Idaho State 2026-11-24 7 PM (America/Denver) |
| 401921817 | absent | 2026-11-25T02:00:00Z; Missouri Tigers; Evansville Purple Aces; scheduled | verified addition | S76 ESPN: 2026-11-25T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S41: Nov 24 8 PM CST |
| 401909699 | 2026-11-25T02:00:00Z; Florida State Seminoles; UNC Asheville Bulldogs; active | 2026-11-25T02:00:00Z; Florida State Seminoles; UNC Asheville Bulldogs; scheduled | unchanged | S76 ESPN: 2026-11-25T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S25: UNC Asheville 2026-11-24 9:00 PM (America/New_York) |
| 401911253 | 2026-11-25T02:30:00Z; Saint Louis Billikens; Grand Canyon Lopes; active | 2026-11-25T02:30:00Z; Saint Louis Billikens; Grand Canyon Lopes; scheduled | unchanged | S76 ESPN: 2026-11-25T02:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401906762 | 2026-11-25T03:00:00Z; Alabama Crimson Tide; Baylor Bears; active | 2026-11-25T03:00:00Z; Alabama Crimson Tide; Baylor Bears; scheduled | unchanged | S76 ESPN: 2026-11-25T03:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401915943 | 2026-11-25T03:30:00Z; Oregon Ducks; St. John's Red Storm; active | 2026-11-25T03:30:00Z; St. John's Red Storm; Oregon Ducks; scheduled | unchanged. Neutral-site provider home/away designation differs; actual participants and start unchanged. Retain catalog roles. | S76 ESPN: 2026-11-25T03:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S82: Oregon 2026-11-24 10:30 p.m. ET (America/New_York) |
| 401909763 | 2026-11-25T04:59:00Z; Colorado Buffaloes; Stanford Cardinal; active | 2026-11-25T04:59:00Z; Colorado Buffaloes; Stanford Cardinal; scheduled | disputed. Disputed: ESPN/catalog Nov 25 04:59Z; Stanford 9 PM PST and Colorado 10 PM MST both imply 05:00Z, venue explicitly 9 PM PT. One-minute discrepancy withheld without provider clarification. | S76 ESPN: 2026-11-25T04:59:00Z; timeValid=True; STATUS_SCHEDULED<br>S83: Stanford 2026-11-24 10 p.m. (America/Denver)<br>S19 attempted; see decision<br>S83 attempted; see decision<br>S84 attempted; see decision |
| 401924897 | absent | 2026-11-25T05:00:00Z; New Mexico Lobos; Mississippi Valley State Delta Devils; scheduled | missing evidence. Missing evidence: ESPN timeValid=false. New Mexico says Nov 25 7 PM MST (Nov 26 02:00Z); TicketData agrees but upstream attribution unverified; On3 shows 8 PM without explicit timezone in read content. Withhold until independent timezone confirmation. | S85 ESPN: 2026-11-25T05:00:00Z; timeValid=False; STATUS_SCHEDULED<br>S86 attempted; see decision<br>S87 attempted; see decision<br>S88 attempted; see decision |
| 401909800 | 2026-11-25T05:30:00Z; Kansas State Wildcats; Gonzaga Bulldogs; active | 2026-11-25T05:30:00Z; Kansas State Wildcats; Gonzaga Bulldogs; scheduled | unchanged | S76 ESPN: 2026-11-25T05:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S43: Gonzaga 2026-11-24 11:30 p.m. CT (America/Chicago)<br>S89: Kansas State 2026-11-24 9:30 p.m. (America/Los_Angeles) |
| 401927399 | 2026-11-25T15:00:00Z; Belmont Bruins; St. Bonaventure Bonnies; active | 2026-11-25T15:00:00Z; Belmont Bruins; St. Bonaventure Bonnies; scheduled | unchanged | S85 ESPN: 2026-11-25T15:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401928845 | 2026-11-25T16:00:00Z; Ohio Bobcats; Rice Owls; active | 2026-11-25T16:00:00Z; Ohio Bobcats; Rice Owls; scheduled | unchanged | S85 ESPN: 2026-11-25T16:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921702 | 2026-11-25T16:00:00Z; Charlotte 49ers; Northern Iowa Panthers; active | 2026-11-25T16:00:00Z; Charlotte 49ers; Northern Iowa Panthers; scheduled | unchanged | S85 ESPN: 2026-11-25T16:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S70: Charlotte 2026-11-25 10 a.m. (America/Chicago)<br>S72: Northern Iowa 2026-11-25 11:00 AM (America/New_York) |
| 401911201 | absent | 2026-11-25T16:00:00Z; Fordham Rams; Mercy Mavericks; scheduled | verified addition | S85 ESPN: 2026-11-25T16:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S90: Nov 25 11 AM ET |
| 401920428 | 2026-11-25T17:00:00Z; Marquette Golden Eagles; Virginia Cavaliers; active | 2026-11-25T17:00:00Z; Marquette Golden Eagles; Virginia Cavaliers; scheduled | unchanged | S85 ESPN: 2026-11-25T17:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920196 | 2026-11-25T17:00:00Z; Saint Joseph's Hawks; Penn State Abington Nittany Lions; active | 2026-11-25T17:00:00Z; Saint Joseph's Hawks; Penn State Abington Nittany Lions; scheduled | unchanged | S85 ESPN: 2026-11-25T17:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920067 | absent | 2026-11-25T18:00:00Z; Rhode Island Rams; American International Yellow Jackets; scheduled | verified addition | S85 ESPN: 2026-11-25T18:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S91: Nov 25 1 PM ET |
| 401911029 | absent | 2026-11-25T18:00:00Z; Miami (OH) RedHawks; Eastern Kentucky Colonels; scheduled | verified addition | S85 ESPN: 2026-11-25T18:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S60: Eastern Kentucky 2026-11-25 1 p.m. (America/New_York) |
| 401919007 | 2026-11-25T18:30:00Z; Davidson Wildcats; Tulane Green Wave; active | 2026-11-25T18:30:00Z; Davidson Wildcats; Tulane Green Wave; scheduled | unchanged | S85 ESPN: 2026-11-25T18:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921669 | 2026-11-25T19:00:00Z; LSU Tigers; Arizona State Sun Devils; active | 2026-11-25T19:00:00Z; LSU Tigers; Arizona State Sun Devils; scheduled | unchanged | S85 ESPN: 2026-11-25T19:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401928850 | absent | 2026-11-25T19:00:00Z; Western Michigan Broncos; Grace Christian Tigers; scheduled | verified addition | S85 ESPN: 2026-11-25T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S92: Nov 25 2 PM ET |
| 401920809 | 2026-11-25T19:30:00Z; Xavier Musketeers; Texas A&M Aggies; active | 2026-11-25T19:30:00Z; Xavier Musketeers; Texas A&M Aggies; scheduled | unchanged | S85 ESPN: 2026-11-25T19:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401928836 | 2026-11-25T20:00:00Z; App State Mountaineers; Akron Zips; active | 2026-11-25T20:00:00Z; App State Mountaineers; Akron Zips; scheduled | unchanged | S85 ESPN: 2026-11-25T20:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401919042 | absent | 2026-11-25T20:00:00Z; Oklahoma State Cowboys; Jackson State Tigers; scheduled | verified addition | S85 ESPN: 2026-11-25T20:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S26: Jackson State 2026-11-25 2:00 PM (America/Chicago) |
| 401921670 | 2026-11-25T21:30:00Z; USC Trojans; South Carolina Gamecocks; active | 2026-11-25T21:30:00Z; USC Trojans; South Carolina Gamecocks; scheduled | unchanged | S85 ESPN: 2026-11-25T21:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S23: South Carolina 2026-11-25 1:30 p.m. PT (America/Los_Angeles) |
| 401926065 | 2026-11-25T22:00:00Z; Nebraska Cornhuskers; Southern Jaguars; active | 2026-11-25T22:00:00Z; Nebraska Cornhuskers; Southern Jaguars; scheduled | unchanged | S85 ESPN: 2026-11-25T22:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401925688 | absent | 2026-11-25T22:00:00Z; Texas State Bobcats; Alcorn State Braves; scheduled | verified addition | S85 ESPN: 2026-11-25T22:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S68: Nov 25 4 PM CT |
| 401917182 | 2026-11-25T22:00:00Z; Penn State Nittany Lions; Memphis Tigers; active | 2026-11-25T22:00:00Z; Penn State Nittany Lions; Memphis Tigers; scheduled | unchanged | S85 ESPN: 2026-11-25T22:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S67: Penn State 2026-11-25 4 p.m. (America/Chicago) |
| 401911241 | absent | 2026-11-25T23:00:00Z; Richmond Spiders; Bethune-Cookman Wildcats; scheduled | verified addition | S85 ESPN: 2026-11-25T23:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S32: Bethune-Cookman 2026-11-25 6:00 PM (America/New_York) |
| 401909720 | absent | 2026-11-25T23:00:00Z; Syracuse Orange; UAlbany Great Danes; scheduled | verified addition | S85 ESPN: 2026-11-25T23:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S53: Albany 2026-11-25 6 PM (America/New_York) |
| 401909568 | 2026-11-26T00:00:00Z; Duke Blue Devils; UConn Huskies; active | 2026-11-26T00:00:00Z; Duke Blue Devils; UConn Huskies; scheduled | unchanged | S85 ESPN: 2026-11-26T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920076 | absent | 2026-11-26T00:00:00Z; George Mason Patriots; Longwood Lancers; scheduled | verified addition | S85 ESPN: 2026-11-26T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S93: Nov 25 Longwood 7 PM Fairfax local EST |
| 401918971 | 2026-11-26T00:00:00Z; Utah State Aggies; SMU Mustangs; active | 2026-11-26T00:00:00Z; Utah State Aggies; SMU Mustangs; scheduled | unchanged | S85 ESPN: 2026-11-26T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S40: Utah State 2026-11-25 6 p.m. CT (America/Chicago) |
| 401918960 | absent | 2026-11-26T00:00:00Z; NC State Wolfpack; Norfolk State Spartans; scheduled | verified addition | S85 ESPN: 2026-11-26T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S7: Norfolk State 2026-11-25 7 PM (America/New_York) |
| 401911028 | 2026-11-26T00:00:00Z; Wisconsin Badgers; Northeastern Huskies; active | 2026-11-26T00:00:00Z; Wisconsin Badgers; Northeastern Huskies; scheduled | unchanged | S85 ESPN: 2026-11-26T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401929287 | 2026-11-26T00:30:00Z; Mississippi State Bulldogs; Wake Forest Demon Deacons; active | 2026-11-26T00:30:00Z; Mississippi State Bulldogs; Wake Forest Demon Deacons; scheduled | unchanged | S85 ESPN: 2026-11-26T00:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S36: Wake Forest 2026-11-25 6:30 p.m. (America/Chicago)<br>S52: Mississippi State 2026-11-25 7:30 p.m. (America/New_York) |
| 401920138 | 2026-11-26T01:00:00Z; Pepperdine Waves; Cal State Bakersfield Roadrunners; active | 2026-11-26T01:00:00Z; Pepperdine Waves; Cal State Bakersfield Roadrunners; scheduled | unchanged | S85 ESPN: 2026-11-26T01:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911522 | 2026-11-26T01:30:00Z; UC Davis Aggies; Omaha Mavericks; active | 2026-11-26T01:30:00Z; UC Davis Aggies; Omaha Mavericks; scheduled | unchanged | S85 ESPN: 2026-11-26T01:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401917545 | 2026-11-26T02:00:00Z; Loyola Marymount Lions; Eastern Washington Eagles; active | 2026-11-26T02:00:00Z; Loyola Marymount Lions; Eastern Washington Eagles; scheduled | unchanged | S85 ESPN: 2026-11-26T02:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401917544 | absent | 2026-11-26T03:30:00Z; Jacksonville State Gamecocks; Pacific Tigers; scheduled | verified addition | S85 ESPN: 2026-11-26T03:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S94: Pacific 2026-11-25 9:30 p.m. (America/Chicago) |
| 401929005 | 2026-11-26T04:59:00Z; Hawai'i Rainbow Warriors; Incarnate Word Cardinals; active | 2026-11-26T04:59:00Z; Hawai'i Rainbow Warriors; Incarnate Word Cardinals; scheduled | unchanged | S85 ESPN: 2026-11-26T04:59:00Z; timeValid=True; STATUS_SCHEDULED |
| 401929281 | 2026-11-26T16:00:00Z; Cincinnati Bearcats; Georgia Bulldogs; active | 2026-11-26T16:00:00Z; Cincinnati Bearcats; Georgia Bulldogs; scheduled | unchanged | S95 ESPN: 2026-11-26T16:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S44: Cincinnati 2026-11-26 11:00 a.m. (America/New_York) |
| 401912231 | absent | 2026-11-26T17:00:00Z; UTSA Roadrunners; Army Black Knights; scheduled | verified addition | S95 ESPN: 2026-11-26T17:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S96: Nov 26 11 AM CST |
| 401906807 | 2026-11-26T17:00:00Z; Purdue Boilermakers; Oklahoma Sooners; active | 2026-11-26T17:00:00Z; Purdue Boilermakers; Oklahoma Sooners; scheduled | unchanged | S95 ESPN: 2026-11-26T17:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401929282 | 2026-11-26T18:30:00Z; UCF Knights; Boston College Eagles; active | 2026-11-26T18:30:00Z; UCF Knights; Boston College Eagles; scheduled | unchanged | S95 ESPN: 2026-11-26T18:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921674 | 2026-11-26T19:00:00Z; Arizona State Sun Devils; South Carolina Gamecocks; active | 2026-11-26T19:00:00Z; Arizona State Sun Devils; South Carolina Gamecocks; scheduled | unchanged | S95 ESPN: 2026-11-26T19:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401906869 | 2026-11-26T19:30:00Z; Texas Longhorns; Georgetown Hoyas; active | 2026-11-26T19:30:00Z; Texas Longhorns; Georgetown Hoyas; scheduled | unchanged | S95 ESPN: 2026-11-26T19:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S11: Georgetown  2026-11-26 1:30 p.m. CT / 11:30 a.m. PT (America/Chicago) |
| 401925757 | 2026-11-26T21:30:00Z; Michigan State Spartans; Arkansas Razorbacks; active | 2026-11-26T21:30:00Z; Michigan State Spartans; Arkansas Razorbacks; scheduled | unchanged | S95 ESPN: 2026-11-26T21:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921673 | 2026-11-26T21:30:00Z; USC Trojans; Utah State Aggies; active | 2026-11-26T21:30:00Z; USC Trojans; Utah State Aggies; scheduled | unchanged | S95 ESPN: 2026-11-26T21:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S23: Utah State 2026-11-26 1:30 p.m. PT (America/Los_Angeles) |
| 401917547 | 2026-11-26T22:00:00Z; UCLA Bruins; Saint Mary's Gaels; active | 2026-11-26T22:00:00Z; UCLA Bruins; Saint Mary's Gaels; scheduled | unchanged | S95 ESPN: 2026-11-26T22:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S47: UCLA 2026-11-26 2:00 PM (America/Los_Angeles) |
| 401918972 | 2026-11-27T00:00:00Z; LSU Tigers; SMU Mustangs; active | 2026-11-27T00:00:00Z; LSU Tigers; SMU Mustangs; scheduled | unchanged | S95 ESPN: 2026-11-27T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S40: LSU 2026-11-26 6 p.m. CT (America/Chicago) |
| 401909506 | 2026-11-27T00:00:00Z; Pittsburgh Panthers; DePaul Blue Demons; active | 2026-11-27T00:00:00Z; Pittsburgh Panthers; DePaul Blue Demons; scheduled | unchanged | S95 ESPN: 2026-11-27T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S35: DePaul 2026-11-26 7:00 PM (America/New_York) |
| 401911523 | absent | 2026-11-27T01:00:00Z; UC Davis Aggies; Jacksonville State Gamecocks; scheduled | verified addition | S95 ESPN: 2026-11-27T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S94: UC Davis 2026-11-26 7 p.m. (America/Chicago) |
| 401917546 | 2026-11-27T03:30:00Z; Omaha Mavericks; Pacific Tigers; active | 2026-11-27T03:30:00Z; Omaha Mavericks; Pacific Tigers; scheduled | unchanged | S95 ESPN: 2026-11-27T03:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920429 | 2026-11-27T16:00:00Z; Xavier Musketeers; Virginia Cavaliers; active | 2026-11-27T16:00:00Z; Xavier Musketeers; Virginia Cavaliers; scheduled | unchanged | S97 ESPN: 2026-11-27T16:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921827 | absent | 2026-11-27T19:00:00Z; Vanderbilt Commodores; Southern Jaguars; scheduled | verified addition | S97 ESPN: 2026-11-27T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S38: Nov 27 Southern 1 PM CST |
| 401929181 | absent | 2026-11-27T19:00:00Z; Fresno State Bulldogs; South Alabama Jaguars; scheduled | verified addition | S97 ESPN: 2026-11-27T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S46: South Alabama 2026-11-27 11:00 a.m. PT (America/Los_Angeles) |
| 401928468 | 2026-11-27T20:00:00Z; Louisiana Tech Bulldogs; Texas State Bobcats; active | 2026-11-27T20:00:00Z; Louisiana Tech Bulldogs; Texas State Bobcats; scheduled | unchanged | S97 ESPN: 2026-11-27T20:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401919021 | absent | 2026-11-27T20:00:00Z; UAB Blazers; Auburn Montgomery Senators; scheduled | verified addition | S97 ESPN: 2026-11-27T20:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S28: Auburn Montgomery 2026-11-27 2 p.m. (America/Chicago) |
| 401902282 | 2026-11-27T20:00:00Z; Butler Bulldogs; Bellarmine Knights; active | 2026-11-27T20:00:00Z; Butler Bulldogs; Bellarmine Knights; scheduled | unchanged | S97 ESPN: 2026-11-27T20:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921417 | 2026-11-27T20:30:00Z; Bucknell Bison; La Salle Explorers; active | 2026-11-27T20:30:00Z; Bucknell Bison; La Salle Explorers; scheduled | unchanged | S97 ESPN: 2026-11-27T20:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921818 | absent | 2026-11-27T21:00:00Z; Missouri Tigers; Arkansas-Pine Bluff Golden Lions; scheduled | verified addition | S97 ESPN: 2026-11-27T21:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S41: Nov 27 3 PM CST |
| 401911212 | absent | 2026-11-27T21:00:00Z; George Washington Revolutionaries; UMBC Retrievers; scheduled | verified addition | S97 ESPN: 2026-11-27T21:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S29: UMBC 2026-11-27 4 p.m. (America/New_York) |
| 401929283 | 2026-11-27T21:30:00Z; Boston College Eagles; Cincinnati Bearcats; active | 2026-11-27T21:30:00Z; Boston College Eagles; Cincinnati Bearcats; scheduled | unchanged | S97 ESPN: 2026-11-27T21:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401909789 | 2026-11-27T22:00:00Z; Kansas Jayhawks; Villanova Wildcats; active | 2026-11-27T22:00:00Z; Kansas Jayhawks; Villanova Wildcats; scheduled | unchanged | S97 ESPN: 2026-11-27T22:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S22: Villanova 2026-11-27 4 p.m. CT (America/Chicago) |
| 401920810 | 2026-11-27T22:00:00Z; Texas A&M Aggies; Marquette Golden Eagles; active | 2026-11-27T22:00:00Z; Texas A&M Aggies; Marquette Golden Eagles; scheduled | unchanged | S97 ESPN: 2026-11-27T22:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920382 | absent | 2026-11-27T22:00:00Z; Virginia Tech Hokies; Old Dominion Monarchs; scheduled | verified addition | S97 ESPN: 2026-11-27T22:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S98: Nov 27 5 PM EST |
| 401927366 | absent | 2026-11-27T22:30:00Z; Boise State Broncos; Drake Bulldogs; scheduled | verified addition | S97 ESPN: 2026-11-27T22:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S45: Drake  2026-11-27 3:30 PM (America/Denver) |
| 401913531 | 2026-11-27T23:00:00Z; Illinois Fighting Illini; Western Kentucky Hilltoppers; active | 2026-11-27T23:00:00Z; Illinois Fighting Illini; Western Kentucky Hilltoppers; scheduled | unchanged | S97 ESPN: 2026-11-27T23:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911030 | 2026-11-27T23:00:00Z; Indiana Hoosiers; Bowling Green Falcons; active | 2026-11-27T23:00:00Z; Indiana Hoosiers; Bowling Green Falcons; scheduled | unchanged | S97 ESPN: 2026-11-27T23:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401929284 | 2026-11-28T00:00:00Z; UCF Knights; Georgia Bulldogs; active | 2026-11-28T00:00:00Z; Georgia Bulldogs; UCF Knights; scheduled | unchanged. Neutral-site provider home/away designation differs; actual participants and start unchanged. Retain catalog roles. | S97 ESPN: 2026-11-28T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S44: UCF 2026-11-27 7:00 (America/New_York) |
| 401918980 | absent | 2026-11-28T00:00:00Z; East Carolina Pirates; North Carolina Wesleyan Battling Bishops; scheduled | verified addition | S97 ESPN: 2026-11-28T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S42: NC Wesleyan 2026-11-27 7:00 P.M. (America/New_York) |
| 401912711 | 2026-11-28T00:00:00Z; North Carolina Tar Heels; West Virginia Mountaineers; active | 2026-11-28T00:00:00Z; North Carolina Tar Heels; West Virginia Mountaineers; scheduled | unchanged | S97 ESPN: 2026-11-28T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S4: North Carolina 2026-11-27 7 p.m. (America/New_York) |
| 401925703 | 2026-11-28T00:30:00Z; Houston Cougars; Oakland Golden Grizzlies; active | 2026-11-28T00:30:00Z; Houston Cougars; Oakland Golden Grizzlies; scheduled | unchanged | S97 ESPN: 2026-11-28T00:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S99: Oakland 2026-11-27 6:30 p.m. (America/Chicago) |
| 401925829 | 2026-11-28T02:30:00Z; North Texas Mean Green; North Dakota State Bison; active | 2026-11-28T01:00:00Z; North Texas Mean Green; North Dakota State Bison; scheduled | verified correction | S97 ESPN: 2026-11-28T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S31: North Dakota State 2026-11-27 7 PM (America/Chicago)<br>S100: North Texas 2026-11-27 7 p.m. CT (America/Chicago) |
| 401922264 | absent | 2026-11-28T01:00:00Z; Washington State Cougars; Idaho Vandals; scheduled | verified addition | S97 ESPN: 2026-11-28T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S81: Nov 27 5 PM PST |
| 401920737 | 2026-11-28T01:00:00Z; Northwestern Wildcats; Northeastern Huskies; active | 2026-11-28T01:00:00Z; Northwestern Wildcats; Northeastern Huskies; scheduled | unchanged | S97 ESPN: 2026-11-28T01:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911524 | absent | 2026-11-28T01:00:00Z; UC Davis Aggies; Pacific Tigers; scheduled | verified addition | S97 ESPN: 2026-11-28T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S101: Nov 27 5 PM PT |
| 401919033 | 2026-11-28T02:00:00Z; Kentucky Wildcats; Wichita State Shockers; active | 2026-11-28T02:00:00Z; Kentucky Wildcats; Wichita State Shockers; scheduled | unchanged | S97 ESPN: 2026-11-28T02:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920890 | 2026-11-28T17:00:00Z; Seton Hall Pirates; Siena Saints; active | 2026-11-28T17:00:00Z; Seton Hall Pirates; Siena Saints; scheduled | unchanged | S102 ESPN: 2026-11-28T17:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401918961 | absent | 2026-11-28T17:00:00Z; NC State Wolfpack; Elon Phoenix; scheduled | verified addition | S102 ESPN: 2026-11-28T17:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S7: Elon 2026-11-28 12 PM (America/New_York) |
| 401927389 | absent | 2026-11-28T18:00:00Z; Northern Iowa Panthers; Robert Morris Colonials; scheduled | verified addition | S102 ESPN: 2026-11-28T18:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S70: Robert Morris 2026-11-28 12 p.m. (America/Chicago) |
| 401927379 | 2026-11-28T18:00:00Z; Indiana State Sycamores; IU Columbus Crimson Pride; active | 2026-11-28T18:00:00Z; Indiana State Sycamores; IU Columbus Crimson Pride; scheduled | unchanged | S102 ESPN: 2026-11-28T18:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920310 | absent | 2026-11-28T18:00:00Z; Georgia Tech Yellow Jackets; Alcorn State Braves; scheduled | verified addition | S102 ESPN: 2026-11-28T18:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S79: Nov 28 Alcorn State 1 PM EST |
| 401926757 | 2026-11-28T15:30:00Z; Pepperdine Waves; Lehigh Mountain Hawks; active | 2026-11-28T18:30:00Z; Pepperdine Waves; Lehigh Mountain Hawks; scheduled | verified correction | S102 ESPN: 2026-11-28T18:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S17: Lehigh 2026-11-28 10:30 AM (America/Los_Angeles) |
| 401920728 | absent | 2026-11-28T19:00:00Z; Iowa Hawkeyes; Prairie View A&M Panthers; scheduled | verified addition. ESPN timeValid=false midnight is not a conflicting confirmed time; official and AXS venue listing confirm 13:00 CST. | S102 ESPN: 2026-11-28T05:00:00Z; timeValid=False; STATUS_SCHEDULED<br>S78: Nov 28 Prairie View A&M 1 PM CST<br>S103: Nov 28 1 PM at Carver-Hawkeye Arena, Iowa City |
| 401920077 | 2026-11-28T19:00:00Z; George Mason Patriots; Marist Red Foxes; active | 2026-11-28T19:00:00Z; George Mason Patriots; Marist Red Foxes; scheduled | unchanged | S102 ESPN: 2026-11-28T19:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401919736 | absent | 2026-11-28T19:00:00Z; Bradley Braves; Chicago State Cougars; scheduled | missing evidence. Missing evidence: Bradley page has no schedule content; venue shell has no event time in actual content; NEC shows 2 PM without timezone. ESPN 19:00Z and On3 1 PM suggest Central, but official timezone not established. Withhold. | S102 ESPN: 2026-11-28T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S104 attempted; see decision<br>S105 attempted; see decision<br>S106 attempted; see decision<br>S107 attempted; see decision |
| 401911202 | 2026-11-28T19:00:00Z; Harvard Crimson; Fordham Rams; active | 2026-11-28T19:00:00Z; Harvard Crimson; Fordham Rams; scheduled | unchanged | S102 ESPN: 2026-11-28T19:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911031 | 2026-11-28T19:00:00Z; Southern Indiana Screaming Eagles; Ball State Cardinals; active | 2026-11-28T19:00:00Z; Southern Indiana Screaming Eagles; Ball State Cardinals; scheduled | unchanged | S102 ESPN: 2026-11-28T19:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401928848 | 2026-11-28T20:00:00Z; Valparaiso Beacons; Toledo Rockets; active | 2026-11-28T20:00:00Z; Valparaiso Beacons; Toledo Rockets; scheduled | unchanged | S102 ESPN: 2026-11-28T20:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S9: Valparaiso 2026-11-28 3:00 p.m. (America/New_York) |
| 401926229 | 2026-11-28T20:00:00Z; New Mexico State Aggies; Denver Pioneers; active | 2026-11-28T20:00:00Z; New Mexico State Aggies; Denver Pioneers; scheduled | unchanged | S102 ESPN: 2026-11-28T20:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401924913 | 2026-11-28T20:00:00Z; UNLV Rebels; UT Rio Grande Valley Vaqueros; active | 2026-11-28T20:00:00Z; UNLV Rebels; UT Rio Grande Valley Vaqueros; scheduled | unchanged | S102 ESPN: 2026-11-28T20:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911312 | 2026-11-28T20:00:00Z; Air Force Falcons; Brown Bears; active | 2026-11-28T20:00:00Z; Air Force Falcons; Brown Bears; scheduled | unchanged | S102 ESPN: 2026-11-28T20:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S56: Brown  2026-11-28 1:00 pm MT (America/Denver) |
| 401929172 | absent | 2026-11-28T20:30:00Z; Boise State Broncos; North Texas Mean Green; scheduled | verified addition | S102 ESPN: 2026-11-28T20:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S45: North Texas 2026-11-28 1:30 PM (America/Denver)<br>S31: Boise State 2026-11-28 2:30 PM (America/Chicago) |
| 401911032 | 2026-11-28T20:30:00Z; Towson Tigers; Buffalo Bulls; active | 2026-11-28T20:30:00Z; Towson Tigers; Buffalo Bulls; scheduled | unchanged | S102 ESPN: 2026-11-28T20:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401917549 | absent | 2026-11-28T21:00:00Z; San Diego Toreros; Northern Colorado Bears; scheduled | verified addition | S102 ESPN: 2026-11-28T21:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S108: Nov 28 1 PM PT |
| 401920436 | 2026-11-28T21:00:00Z; Utah Valley Wolverines; San José State Spartans; active | 2026-11-28T21:00:00Z; Utah Valley Wolverines; San José State Spartans; scheduled | unchanged | S102 ESPN: 2026-11-28T21:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920197 | absent | 2026-11-28T22:00:00Z; Monmouth Hawks; Saint Joseph's Hawks; scheduled | verified addition | S102 ESPN: 2026-11-28T22:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S109: Nov 28 5 PM ET |
| 401917548 | 2026-11-28T22:00:00Z; Seattle U Redhawks; UC Irvine Anteaters; active | 2026-11-28T22:00:00Z; Seattle U Redhawks; UC Irvine Anteaters; scheduled | unchanged | S102 ESPN: 2026-11-28T22:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911459 | absent | 2026-11-28T22:00:00Z; Nevada Wolf Pack; Cal Poly Humboldt Lumberjacks; scheduled | verified addition | S102 ESPN: 2026-11-28T22:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S110: Nov 28 2 PM PT |
| 401927367 | 2026-11-28T22:00:00Z; North Dakota State Bison; Drake Bulldogs; active | 2026-11-28T23:00:00Z; North Dakota State Bison; Drake Bulldogs; scheduled | verified correction | S102 ESPN: 2026-11-28T23:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S100: Drake 2026-11-28 5 p.m. CT (America/Chicago) |
| 401911242 | absent | 2026-11-28T23:00:00Z; Richmond Spiders; VMI Keydets; scheduled | verified addition | S102 ESPN: 2026-11-28T23:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S32: VMI 2026-11-28 6:00 PM (America/New_York) |
| 401921065 | absent | 2026-11-29T00:00:00Z; San Francisco Dons; Bethune-Cookman Wildcats; scheduled | verified addition | S102 ESPN: 2026-11-29T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S73: Bethune-Cookman 2026-11-28 4:00 p.m. (America/Los_Angeles) |
| 401920954 | absent | 2026-11-29T00:00:00Z; Southern Illinois Salukis; Portland State Vikings; scheduled | verified addition | S102 ESPN: 2026-11-29T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S30: Portland State 2026-11-28 6 PM (America/Chicago) |
| 401917550 | absent | 2026-11-29T00:00:00Z; Santa Clara Broncos; Utah Tech Trailblazers; scheduled | verified addition | S102 ESPN: 2026-11-29T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S21: Nov 28 4 PM PT |
| 401925783 | absent | 2026-11-29T00:30:00Z; Duquesne Dukes; South Carolina State Bulldogs; scheduled | verified addition | S102 ESPN: 2026-11-29T00:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S65: South Carolina State 2026-11-28 7:30 p.m. (America/New_York) |
| 401919851 | absent | 2026-11-29T01:00:00Z; Notre Dame Fighting Irish; Stonehill Skyhawks; scheduled | verified addition | S102 ESPN: 2026-11-29T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S111: Nov 28 at Notre Dame 8 PM Eastern |
| 401916308 | 2026-11-29T01:00:00Z; Minnesota Golden Gophers; California Golden Bears; active | 2026-11-29T01:00:00Z; Minnesota Golden Gophers; California Golden Bears; scheduled | unchanged | S102 ESPN: 2026-11-29T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S20: Minnesota 2026-11-28 5 p.m. PT / 7 p.m. CT (America/Los_Angeles) |
| 401917551 | 2026-11-29T03:00:00Z; UC San Diego Tritons; Loyola Marymount Lions; active | 2026-11-29T03:00:00Z; UC San Diego Tritons; Loyola Marymount Lions; scheduled | unchanged | S102 ESPN: 2026-11-29T03:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401927392 | 2026-11-29T18:00:00Z; Massachusetts Minutemen; Loyola Chicago Ramblers; active | 2026-11-29T18:00:00Z; Massachusetts Minutemen; Loyola Chicago Ramblers; scheduled | unchanged | S112 ESPN: 2026-11-29T18:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911189 | 2026-11-29T18:00:00Z; Memphis Tigers; Dayton Flyers; active | 2026-11-29T18:00:00Z; Dayton Flyers; Memphis Tigers; scheduled | unchanged. Neutral-site provider home/away designation differs; actual participants and start unchanged. Retain catalog roles. | S112 ESPN: 2026-11-29T18:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S67: Dayton 2026-11-29 12 p.m. (America/Chicago) |
| 401920280 | 2026-11-29T18:30:00Z; UIC Flames; Canisius Golden Griffins; active | 2026-11-29T18:30:00Z; UIC Flames; Canisius Golden Griffins; scheduled | unchanged | S112 ESPN: 2026-11-29T18:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401926869 | absent | 2026-11-29T19:00:00Z; Oregon State Beavers; Milwaukee Panthers; scheduled | verified addition | S112 ESPN: 2026-11-29T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S16: Milwaukee 2026-11-29 11 a.m. (America/Los_Angeles) |
| 401925866 | absent | 2026-11-29T19:00:00Z; Tulsa Golden Hurricane; IU Indianapolis Jaguars; scheduled | verified addition | S112 ESPN: 2026-11-29T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S37: Nov 29 1 PM CT (IU Indy) |
| 401924898 | 2026-11-29T19:00:00Z; New Mexico Lobos; Utah State Aggies; active | 2026-11-29T19:00:00Z; New Mexico Lobos; Utah State Aggies; scheduled | unchanged | S112 ESPN: 2026-11-29T19:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401923263 | 2026-11-29T19:00:00Z; Florida Atlantic Owls; Davidson Wildcats; active | 2026-11-29T19:00:00Z; Florida Atlantic Owls; Davidson Wildcats; scheduled | unchanged | S112 ESPN: 2026-11-29T19:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921098 | absent | 2026-11-29T19:00:00Z; Arkansas State Red Wolves; Rice Owls; scheduled | verified addition | S112 ESPN: 2026-11-29T19:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S113: Nov 29 1 PM CT |
| 401917984 | 2026-11-29T19:00:00Z; Tulane Green Wave; UL Monroe Warhawks; active | 2026-11-29T19:00:00Z; Tulane Green Wave; UL Monroe Warhawks; scheduled | unchanged | S112 ESPN: 2026-11-29T19:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401928842 | 2026-11-29T20:00:00Z; Kent State Golden Flashes; Malone Pioneers; active | 2026-11-29T20:00:00Z; Kent State Golden Flashes; Malone Pioneers; scheduled | unchanged | S112 ESPN: 2026-11-29T20:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401925821 | absent | 2026-11-29T20:00:00Z; Charlotte 49ers; Western Carolina Catamounts; scheduled | verified addition | S112 ESPN: 2026-11-29T20:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S72: Western Carolina 2026-11-29 3:00 PM (America/New_York) |
| 401922254 | 2026-11-29T19:00:00Z; Florida State Seminoles; West Florida Argonauts; active | 2026-11-29T20:00:00Z; Florida State Seminoles; West Florida Argonauts; scheduled | verified correction | S112 ESPN: 2026-11-29T20:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S25: West Florida 2026-11-29 3:00 PM (America/New_York) |
| 401920722 | absent | 2026-11-29T20:00:00Z; Wyoming Cowboys; Eastern Washington Eagles; scheduled | verified addition | S112 ESPN: 2026-11-29T20:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S66: Eastern Washington University 2026-11-29 1 p.m. (America/Denver) |
| 401919043 | absent | 2026-11-29T20:00:00Z; Oklahoma State Cowboys; Tennessee State Tigers; scheduled | verified addition | S112 ESPN: 2026-11-29T20:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S26: Tennessee State 2026-11-29 2:00 PM (America/Chicago) |
| 401911255 | 2026-11-29T20:30:00Z; Saint Louis Billikens; South Florida Bulls; active | 2026-11-29T20:30:00Z; Saint Louis Billikens; South Florida Bulls; scheduled | unchanged | S112 ESPN: 2026-11-29T20:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S55: Saint Louis 2026-11-29 3:30 PM (America/New_York) |
| 401922232 | absent | 2026-11-29T21:00:00Z; Houston Cougars; Queens University Royals; scheduled | verified addition | S112 ESPN: 2026-11-29T21:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S99: Queens 2026-11-29 3 p.m. (America/Chicago) |
| 401926145 | absent | 2026-11-29T21:00:00Z; SIU Edwardsville Cougars; UTSA Roadrunners; scheduled | verified addition | S112 ESPN: 2026-11-29T21:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S114: Nov 29 3 PM CT |
| 401925831 | 2026-11-29T21:00:00Z; Boise State Broncos; North Dakota State Bison; active | 2026-11-29T21:00:00Z; Boise State Broncos; North Dakota State Bison; scheduled | unchanged | S112 ESPN: 2026-11-29T21:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S45: North Dakota State 2026-11-29 2 PM (America/Denver)<br>S100: Boise State 2026-11-29 3 p.m. CT (America/Chicago) |
| 401917552 | 2026-11-29T22:00:00Z; Stanford Cardinal; Portland Pilots; active | 2026-11-29T21:00:00Z; Stanford Cardinal; Portland Pilots; scheduled | verified correction | S112 ESPN: 2026-11-29T21:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S19: Nov 29 1:00 PM PST |
| 401925830 | absent | 2026-11-29T21:30:00Z; North Texas Mean Green; Drake Bulldogs; scheduled | disputed. Disputed: ESPN 21:30Z, North Texas/Drake schedules 5:30 PM CST = 23:30Z, venue 4:30 PM MT = 23:30Z. No dated correction resolving provider conflict; withhold addition. | S112 ESPN: 2026-11-29T21:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S31: Drake 2026-11-29 5:30 PM (America/Chicago)<br>S31 attempted; see decision<br>S10 attempted; see decision<br>S115 attempted; see decision<br>S116 attempted; see decision |
| 401925067 | absent | 2026-11-29T22:00:00Z; Texas State Bobcats; Nicholls Colonels; scheduled | verified addition | S112 ESPN: 2026-11-29T22:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S68: Nov 29 4 PM CT |
| 401916320 | 2026-11-29T22:30:00Z; Ohio State Buckeyes; Lipscomb Bisons; active | 2026-11-29T22:30:00Z; Ohio State Buckeyes; Lipscomb Bisons; scheduled | unchanged | S112 ESPN: 2026-11-29T22:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401929182 | 2026-11-29T22:30:00Z; Fresno State Bulldogs; South Dakota State Jackrabbits; active | 2026-11-29T23:00:00Z; Fresno State Bulldogs; South Dakota State Jackrabbits; scheduled | verified correction | S112 ESPN: 2026-11-29T23:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S46: South Dakota State  2026-11-29 3:00 p.m. PT (America/Los_Angeles) |
| 401925898 | 2026-11-30T00:30:00Z; Washington Huskies; Norfolk State Spartans; active | 2026-11-30T00:30:00Z; Washington Huskies; Norfolk State Spartans; scheduled | unchanged | S112 ESPN: 2026-11-30T00:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S18: Norfolk State 2026-11-29 4:30 p.m. PT (America/Los_Angeles) |
| 401911348 | 2026-11-30T01:00:00Z; Grand Canyon Lopes; Incarnate Word Cardinals; active | 2026-11-30T01:00:00Z; Grand Canyon Lopes; Incarnate Word Cardinals; scheduled | unchanged | S112 ESPN: 2026-11-30T01:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920687 | 2026-11-30T23:30:00Z; UConn Huskies; Rider Broncs; active | 2026-11-30T23:30:00Z; UConn Huskies; Rider Broncs; scheduled | unchanged | S117 ESPN: 2026-11-30T23:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401919034 | absent | 2026-12-01T00:30:00Z; Wichita State Shockers; Southeast Missouri State Redhawks; scheduled | verified addition | S117 ESPN: 2026-12-01T00:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S51: Nov 30 6:30 PM CT |
| 401927383 | absent | 2026-12-01T01:00:00Z; Murray State Racers; Washington State Cougars; scheduled | verified addition | S117 ESPN: 2026-12-01T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S8: Washington State 2026-11-30 7 p.m. (America/Chicago) |
| 401919737 | absent | 2026-12-01T01:00:00Z; Evansville Purple Aces; Chicago State Cougars; scheduled | verified addition | S117 ESPN: 2026-12-01T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S118: Nov 30 7 PM CT |
| 401921735 | absent | 2026-12-01T02:00:00Z; Arizona State Sun Devils; Montana Grizzlies; scheduled | verified addition | S117 ESPN: 2026-12-01T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S119: Nov 30 7 PM MST |
| 401906785 | 2026-12-01T22:00:00Z; Georgia Bulldogs; Boston College Eagles; active | 2026-12-01T22:00:00Z; Georgia Bulldogs; Boston College Eagles; scheduled | unchanged | S120 ESPN: 2026-12-01T22:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S44: Boston College 2026-12-01 5:00 (America/New_York) |
| 401920683 | 2026-12-01T23:30:00Z; St. John's Red Storm; Columbia Lions; active | 2026-12-01T23:30:00Z; St. John's Red Storm; Columbia Lions; scheduled | unchanged | S120 ESPN: 2026-12-01T23:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S82: Columbia 2026-12-01 6:30 p.m. (America/New_York) |
| 401921778 | absent | 2026-12-01T23:30:00Z; Temple Owls; Villanova Wildcats; scheduled | verified addition | S120 ESPN: 2026-12-01T23:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S27: Villanova 2026-12-01 6:30 PM (America/New_York) |
| 401906854 | 2026-12-02T00:00:00Z; Tennessee Volunteers; Florida State Seminoles; active | 2026-12-02T00:00:00Z; Tennessee Volunteers; Florida State Seminoles; scheduled | unchanged | S120 ESPN: 2026-12-02T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S25: Tennessee 2026-12-01 7:00 PM (America/New_York) |
| 401925734 | 2026-12-02T00:00:00Z; Michigan Wolverines; Mississippi Valley State Delta Devils; active | 2026-12-02T00:00:00Z; Michigan Wolverines; Mississippi Valley State Delta Devils; scheduled | unchanged | S120 ESPN: 2026-12-02T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S57: Mississippi Valley State* 2026-12-01 7:00 PM (America/New_York) |
| 401925814 | absent | 2026-12-02T00:00:00Z; La Salle Explorers; Wofford Terriers; scheduled | verified addition | S120 ESPN: 2026-12-02T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S54: Dec 1 7 PM ET |
| 401921874 | 2026-12-02T00:00:00Z; Purdue Boilermakers; Iowa Hawkeyes; active | 2026-12-02T00:00:00Z; Purdue Boilermakers; Iowa Hawkeyes; scheduled | unchanged | S120 ESPN: 2026-12-02T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920880 | absent | 2026-12-02T00:00:00Z; UCF Knights; Jacksonville Dolphins; scheduled | verified addition | S120 ESPN: 2026-12-02T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S121: Dec 1 7 PM EST |
| 401919830 | absent | 2026-12-02T00:00:00Z; West Virginia Mountaineers; Mercyhurst Lakers; scheduled | verified addition | S120 ESPN: 2026-12-02T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S4: Mercyhurst  2026-12-01 7 p.m. (America/New_York) |
| 401918962 | 2026-12-02T00:00:00Z; NC State Wolfpack; South Carolina Gamecocks; active | 2026-12-02T00:00:00Z; NC State Wolfpack; South Carolina Gamecocks; scheduled | unchanged | S120 ESPN: 2026-12-02T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S7: South Carolina 2026-12-01 7 PM (America/New_York) |
| 401918077 | 2026-12-02T00:00:00Z; Clemson Tigers; Auburn Tigers; active | 2026-12-02T00:00:00Z; Clemson Tigers; Auburn Tigers; scheduled | unchanged | S120 ESPN: 2026-12-02T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401917178 | absent | 2026-12-02T00:00:00Z; Penn State Nittany Lions; UAlbany Great Danes; scheduled | verified addition | S120 ESPN: 2026-12-02T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S122: Dec 1 7 PM EST |
| 401911313 | absent | 2026-12-02T00:00:00Z; Rhode Island Rams; Brown Bears; scheduled | verified addition | S120 ESPN: 2026-12-02T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S91: Dec 1 7 PM ET |
| 401911243 | 2026-12-02T00:00:00Z; East Carolina Pirates; Richmond Spiders; active | 2026-12-02T00:00:00Z; East Carolina Pirates; Richmond Spiders; scheduled | unchanged | S120 ESPN: 2026-12-02T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S42: Richmond 2026-12-01 7:00 P.M. (America/New_York)<br>S32: East Carolina 2026-12-01 7:00 PM (America/New_York) |
| 401911213 | absent | 2026-12-02T00:00:00Z; George Washington Revolutionaries; SE Louisiana Lions; scheduled | verified addition | S120 ESPN: 2026-12-02T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S29: Dec 1 7 PM ET (Southeastern Louisiana) |
| 401911203 | absent | 2026-12-02T00:00:00Z; Fordham Rams; Boston University Terriers; scheduled | verified addition | S120 ESPN: 2026-12-02T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S90: Dec 1 7 PM ET |
| 401909710 | 2026-12-02T00:00:00Z; Missouri Tigers; Pittsburgh Panthers; active | 2026-12-02T00:00:00Z; Missouri Tigers; Pittsburgh Panthers; scheduled | unchanged | S120 ESPN: 2026-12-02T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S35: Missouri 2026-12-01 7:00 PM (America/New_York) |
| 401909537 | 2026-12-02T00:00:00Z; Providence Friars; Stonehill Skyhawks; active | 2026-12-02T00:00:00Z; Providence Friars; Stonehill Skyhawks; scheduled | unchanged | S120 ESPN: 2026-12-02T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401912712 | 2026-12-02T00:30:00Z; North Carolina Tar Heels; Arkansas Razorbacks; active | 2026-12-02T00:30:00Z; North Carolina Tar Heels; Arkansas Razorbacks; scheduled | unchanged | S120 ESPN: 2026-12-02T00:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920762 | absent | 2026-12-02T00:30:00Z; Western Kentucky Hilltoppers; Belmont Bruins; scheduled | verified addition | S120 ESPN: 2026-12-02T00:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S33: Belmont 2026-12-01 6:30 PM (America/Chicago) |
| 401909528 | 2026-12-02T00:30:00Z; Marquette Golden Eagles; Wagner Seahawks; active | 2026-12-02T00:30:00Z; Marquette Golden Eagles; Wagner Seahawks; scheduled | unchanged | S120 ESPN: 2026-12-02T00:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401909790 | absent | 2026-12-02T01:00:00Z; Kansas Jayhawks; Northern Iowa Panthers; scheduled | verified addition | S120 ESPN: 2026-12-02T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S22: Northern Iowa 2026-12-01 7 p.m. CT (America/Chicago)<br>S70: #11 Kansas 2026-12-01 7 p.m. (America/Chicago) |
| 401927358 | 2026-12-02T01:00:00Z; Bradley Braves; Loras Duhawks; active | 2026-12-02T01:00:00Z; Bradley Braves; Loras Duhawks; scheduled | unchanged | S120 ESPN: 2026-12-02T01:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401925689 | absent | 2026-12-02T01:00:00Z; Iowa State Cyclones; Alcorn State Braves; scheduled | verified addition | S120 ESPN: 2026-12-02T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S77: Alcorn State 2026-12-01 7:00 PM (America/Chicago) |
| 401921873 | 2026-12-02T01:00:00Z; Indiana Hoosiers; Rutgers Scarlet Knights; active | 2026-12-02T01:00:00Z; Indiana Hoosiers; Rutgers Scarlet Knights; scheduled | unchanged | S120 ESPN: 2026-12-02T01:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401918973 | absent | 2026-12-02T01:00:00Z; SMU Mustangs; Stephen F. Austin Lumberjacks; scheduled | verified addition | S120 ESPN: 2026-12-02T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S40: Stephen F. Austin 2026-12-01 7 p.m. CT (America/Chicago) |
| 401917969 | 2026-12-02T01:00:00Z; Abilene Christian Wildcats; Pepperdine Waves; active | 2026-12-02T01:00:00Z; Abilene Christian Wildcats; Pepperdine Waves; scheduled | unchanged | S120 ESPN: 2026-12-02T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S17: Abilene Christian 2026-12-01 7:00 PM CT / 5:00 PM PT (America/Los_Angeles) |
| 401909507 | 2026-12-02T01:00:00Z; DePaul Blue Demons; North Alabama Lions; active | 2026-12-02T01:00:00Z; DePaul Blue Demons; North Alabama Lions; scheduled | unchanged | S120 ESPN: 2026-12-02T01:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401909496 | 2026-12-02T01:00:00Z; Creighton Bluejays; Oral Roberts Golden Eagles; active | 2026-12-02T01:00:00Z; Creighton Bluejays; Oral Roberts Golden Eagles; scheduled | unchanged | S120 ESPN: 2026-12-02T01:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401906870 | 2026-12-02T02:00:00Z; Louisville Cardinals; Texas Longhorns; active | 2026-12-02T02:00:00Z; Louisville Cardinals; Texas Longhorns; scheduled | unchanged | S120 ESPN: 2026-12-02T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S11: Louisville 2026-12-01 8 p.m. CT / 9 p.m. ET (America/Chicago)<br>S12: Texas 2026-12-01 9 p.m.  (America/New_York) |
| 401909744 | absent | 2026-12-02T02:00:00Z; Arizona Wildcats; LSU New Orleans Privateers; scheduled | verified addition | S120 ESPN: 2026-12-02T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S74: LSU New Orleans 2026-12-01 7:00 PM MST (America/Phoenix) |
| 401909731 | 2026-12-02T02:00:00Z; LSU Tigers; Wake Forest Demon Deacons; active | 2026-12-02T02:00:00Z; LSU Tigers; Wake Forest Demon Deacons; scheduled | unchanged | S120 ESPN: 2026-12-02T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S52: LSU 2026-12-01 9 p.m. (America/New_York) |
| 401929177 | absent | 2026-12-02T02:00:00Z; Colorado State Rams; UT Arlington Mavericks; scheduled | verified addition | S120 ESPN: 2026-12-02T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S75: UT Arlington 2026-12-01 7:00 p.m. (America/Denver) |
| 401921876 | 2026-12-02T02:00:00Z; Northwestern Wildcats; Wisconsin Badgers; active | 2026-12-02T02:00:00Z; Northwestern Wildcats; Wisconsin Badgers; scheduled | unchanged | S120 ESPN: 2026-12-02T02:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920383 | 2026-12-02T02:00:00Z; Virginia Tech Hokies; Ole Miss Rebels; active | 2026-12-02T02:00:00Z; Virginia Tech Hokies; Ole Miss Rebels; scheduled | unchanged | S120 ESPN: 2026-12-02T02:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911525 | absent | 2026-12-02T02:00:00Z; UC Davis Aggies; Portland Pilots; scheduled | verified addition | S120 ESPN: 2026-12-02T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S101: Dec 1 6 PM PT |
| 401911339 | 2026-12-02T02:00:00Z; Air Force Falcons; Denver Pioneers; active | 2026-12-02T02:00:00Z; Air Force Falcons; Denver Pioneers; scheduled | unchanged | S120 ESPN: 2026-12-02T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S56: Denver 2026-12-01 7:00 pm MT (America/Denver) |
| 401909764 | absent | 2026-12-02T02:00:00Z; Colorado Buffaloes; UTEP Miners; scheduled | verified addition | S120 ESPN: 2026-12-02T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S83: UTEP 2026-12-01 7 p.m. (America/Denver) |
| 401906808 | 2026-12-02T02:00:00Z; Oklahoma Sooners; Syracuse Orange; active | 2026-12-02T02:00:00Z; Oklahoma Sooners; Syracuse Orange; scheduled | unchanged | S120 ESPN: 2026-12-02T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S53: Oklahoma 2026-12-01 9 PM (America/New_York) |
| 401906775 | 2026-12-02T02:30:00Z; Florida Gators; Duke Blue Devils; active | 2026-12-02T02:30:00Z; Florida Gators; Duke Blue Devils; scheduled | unchanged | S120 ESPN: 2026-12-02T02:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S5: Duke 2026-12-01 9:30 PM (America/New_York) |
| 401917555 | 2026-12-02T02:30:00Z; San Diego Toreros; Hawai'i Rainbow Warriors; active | 2026-12-02T02:30:00Z; San Diego Toreros; Hawai'i Rainbow Warriors; scheduled | unchanged | S120 ESPN: 2026-12-02T02:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401917554 | absent | 2026-12-02T02:30:00Z; Saint Mary's Gaels; Hofstra Pride; scheduled | verified addition | S120 ESPN: 2026-12-02T02:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S47: Hofstra 2026-12-01 6:30 PM (America/Los_Angeles) |
| 401921875 | 2026-12-02T03:00:00Z; UCLA Bruins; Oregon Ducks; active | 2026-12-02T03:00:00Z; UCLA Bruins; Oregon Ducks; scheduled | unchanged | S120 ESPN: 2026-12-02T03:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S15: UCLA 2026-12-01 7 p.m. PT (America/Los_Angeles) |
| 401917553 | absent | 2026-12-02T03:00:00Z; Seattle U Redhawks; Norfolk State Spartans; scheduled | verified addition | S120 ESPN: 2026-12-02T03:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S123: Dec 1 7 PM PST |
| 401918989 | 2026-12-02T17:00:00Z; Memphis Tigers; Jackson State Tigers; active | 2026-12-02T17:00:00Z; Memphis Tigers; Jackson State Tigers; scheduled | unchanged | S124 ESPN: 2026-12-02T17:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S67: Jackson State 2026-12-02 11 a.m. (America/Chicago) |
| 401921877 | 2026-12-02T23:30:00Z; Michigan State Spartans; Minnesota Golden Gophers; active | 2026-12-02T23:30:00Z; Michigan State Spartans; Minnesota Golden Gophers; scheduled | unchanged | S124 ESPN: 2026-12-02T23:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911037 | absent | 2026-12-02T23:30:00Z; Eastern Michigan Eagles; Massachusetts Minutemen; scheduled | verified addition | S124 ESPN: 2026-12-02T23:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S50: UMass 2026-12-02 6:30 p.m. (America/New_York) |
| 401909518 | 2026-12-02T23:30:00Z; Georgetown Hoyas; UMass Lowell River Hawks; active | 2026-12-02T23:30:00Z; Georgetown Hoyas; UMass Lowell River Hawks; scheduled | unchanged | S124 ESPN: 2026-12-02T23:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401926146 | 2026-12-03T00:00:00Z; Indiana State Sycamores; SIU Edwardsville Cougars; active | 2026-12-03T00:00:00Z; Indiana State Sycamores; SIU Edwardsville Cougars; scheduled | unchanged | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401923264 | absent | 2026-12-03T00:00:00Z; Florida International Panthers; Florida Atlantic Owls; scheduled | verified addition | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S125: Dec 2 7 PM ET |
| 401922510 | absent | 2026-12-03T00:00:00Z; UIC Flames; Valparaiso Beacons; scheduled | verified addition | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S126: Dec 2 6 PM CT |
| 401921749 | absent | 2026-12-03T00:00:00Z; Cincinnati Bearcats; Monmouth Hawks; scheduled | verified addition | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S64: Dec 2 7 PM EST |
| 401921268 | 2026-12-03T00:00:00Z; Dayton Flyers; Loyola Maryland Greyhounds; active | 2026-12-03T00:00:00Z; Dayton Flyers; Loyola Maryland Greyhounds; scheduled | unchanged | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920239 | 2026-12-03T00:00:00Z; Davidson Wildcats; Dartmouth Big Green; active | 2026-12-03T00:00:00Z; Davidson Wildcats; Dartmouth Big Green; scheduled | unchanged | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920078 | 2026-12-03T00:00:00Z; High Point Panthers; George Mason Patriots; active | 2026-12-03T00:00:00Z; High Point Panthers; George Mason Patriots; scheduled | unchanged | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401918997 | absent | 2026-12-03T00:00:00Z; South Florida Bulls; West Florida Argonauts; scheduled | verified addition | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S55: West Florida 2026-12-02 7:00 PM (America/New_York) |
| 401912216 | 2026-12-03T00:00:00Z; Maryland Terrapins; American University Eagles; active | 2026-12-03T00:00:00Z; Maryland Terrapins; American University Eagles; scheduled | unchanged | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911038 | absent | 2026-12-03T00:00:00Z; Ohio Bobcats; Toledo Rockets; scheduled | verified addition | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S9: Ohio 2026-12-02 7:00 p.m. (America/New_York) |
| 401911036 | absent | 2026-12-03T00:00:00Z; Western Michigan Broncos; Buffalo Bulls; scheduled | verified addition | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S92: Dec 2 7 PM ET |
| 401911035 | 2026-12-03T00:00:00Z; Kent State Golden Flashes; Bowling Green Falcons; active | 2026-12-03T00:00:00Z; Kent State Golden Flashes; Bowling Green Falcons; scheduled | unchanged | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401911034 | absent | 2026-12-03T00:00:00Z; Miami (OH) RedHawks; Central Michigan Chippewas; scheduled | verified addition | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S60: Central Michigan 2026-12-02 7 p.m. (America/New_York) |
| 401911033 | absent | 2026-12-03T00:00:00Z; Akron Zips; Ball State Cardinals; scheduled | verified addition | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S71: Ball State  2026-12-02 7:00 PM (America/New_York) |
| 401909546 | 2026-12-03T00:00:00Z; Xavier Musketeers; Texas Southern Tigers; active | 2026-12-03T00:00:00Z; Xavier Musketeers; Texas Southern Tigers; scheduled | unchanged | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401902283 | 2026-12-03T00:00:00Z; Butler Bulldogs; Presbyterian Blue Hose; active | 2026-12-03T00:00:00Z; Butler Bulldogs; Presbyterian Blue Hose; scheduled | unchanged | S124 ESPN: 2026-12-03T00:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920430 | 2026-12-03T00:15:00Z; Virginia Cavaliers; Kentucky Wildcats; active | 2026-12-03T00:15:00Z; Virginia Cavaliers; Kentucky Wildcats; scheduled | unchanged | S124 ESPN: 2026-12-03T00:15:00Z; timeValid=True; STATUS_SCHEDULED |
| 401921647 | 2026-12-03T00:15:00Z; Notre Dame Fighting Irish; Vanderbilt Commodores; active | 2026-12-03T00:15:00Z; Notre Dame Fighting Irish; Vanderbilt Commodores; scheduled | unchanged | S124 ESPN: 2026-12-03T00:15:00Z; timeValid=True; STATUS_SCHEDULED |
| 401919022 | absent | 2026-12-03T00:30:00Z; UAB Blazers; Samford Bulldogs; scheduled | verified addition | S124 ESPN: 2026-12-03T00:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S28: Samford  2026-12-02 6:30 p.m. (America/Chicago) |
| 401917921 | absent | 2026-12-03T01:00:00Z; Houston Cougars; Central Arkansas Bears; scheduled | verified addition | S124 ESPN: 2026-12-03T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S99: Central Arkansas 2026-12-02 7 p.m. (America/Chicago) |
| 401928469 | absent | 2026-12-03T01:00:00Z; Texas State Bobcats; Louisiana Tech Bulldogs; scheduled | verified addition | S124 ESPN: 2026-12-03T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S68: Dec 2 7 PM CT |
| 401926070 | 2026-12-03T01:00:00Z; Eastern Illinois Panthers; Illinois State Redbirds; active | 2026-12-03T01:00:00Z; Eastern Illinois Panthers; Illinois State Redbirds; scheduled | unchanged | S124 ESPN: 2026-12-03T01:00:00Z; timeValid=True; STATUS_SCHEDULED |
| 401925867 | absent | 2026-12-03T01:00:00Z; Tulsa Golden Hurricane; Haskell Jayhawks; scheduled | verified addition | S124 ESPN: 2026-12-03T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S37: Dec 2 7 PM CT (Haskell Indian Nations) |
| 401925822 | absent | 2026-12-03T01:00:00Z; Charlotte 49ers; Charleston Cougars; scheduled | verified addition | S124 ESPN: 2026-12-03T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S72: Dec 2 8 PM ET (College of Charleston) |
| 401919738 | absent | 2026-12-03T01:00:00Z; Murray State Racers; Chicago State Cougars; scheduled | verified addition | S124 ESPN: 2026-12-03T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S8: Chicago State 2026-12-02 7 p.m. (America/Chicago) |
| 401911401 | absent | 2026-12-03T01:00:00Z; Oklahoma State Cowboys; Grand Canyon Lopes; scheduled | verified addition | S124 ESPN: 2026-12-03T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S26: Grand Canyon 2026-12-02 7:00 PM (America/Chicago) |
| 401911256 | absent | 2026-12-03T01:00:00Z; Saint Louis Billikens; Arkansas-Pine Bluff Golden Lions; scheduled | verified addition | S124 ESPN: 2026-12-03T01:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S127: Dec 2 7 PM CT |
| 401921878 | 2026-12-03T01:30:00Z; Nebraska Cornhuskers; Ohio State Buckeyes; active | 2026-12-03T01:30:00Z; Nebraska Cornhuskers; Ohio State Buckeyes; scheduled | unchanged | S124 ESPN: 2026-12-03T01:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401919008 | 2026-12-03T01:30:00Z; Southern Miss Golden Eagles; Tulane Green Wave; active | 2026-12-03T01:30:00Z; Southern Miss Golden Eagles; Tulane Green Wave; scheduled | unchanged | S124 ESPN: 2026-12-03T01:30:00Z; timeValid=True; STATUS_SCHEDULED |
| 401918058 | 2026-12-03T02:00:00Z; Utah Utes; California Golden Bears; active | 2026-12-03T02:00:00Z; Utah Utes; California Golden Bears; scheduled | unchanged | S124 ESPN: 2026-12-03T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S20: Utah 2026-12-02 6 p.m. PT / 7 p.m. MT (America/Los_Angeles) |
| 401917955 | absent | 2026-12-03T02:00:00Z; Wyoming Cowboys; Austin Peay Governors; scheduled | verified addition | S124 ESPN: 2026-12-03T02:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S66: Austin Peay 2026-12-02 7 p.m. (America/Denver) |
| 401906763 | 2026-12-03T02:15:00Z; Miami Hurricanes; Alabama Crimson Tide; active | 2026-12-03T02:15:00Z; Miami Hurricanes; Alabama Crimson Tide; scheduled | unchanged | S124 ESPN: 2026-12-03T02:15:00Z; timeValid=True; STATUS_SCHEDULED |
| 401920811 | 2026-12-03T02:15:00Z; Texas A&M Aggies; Stanford Cardinal; active | 2026-12-03T02:15:00Z; Texas A&M Aggies; Stanford Cardinal; scheduled | unchanged | S124 ESPN: 2026-12-03T02:15:00Z; timeValid=True; STATUS_SCHEDULED |
| 401906795 | 2026-12-03T02:15:00Z; Mississippi State Bulldogs; Georgia Tech Yellow Jackets; active | 2026-12-03T02:15:00Z; Mississippi State Bulldogs; Georgia Tech Yellow Jackets; scheduled | unchanged | S124 ESPN: 2026-12-03T02:15:00Z; timeValid=True; STATUS_SCHEDULED<br>S36: Georgia Tech 2026-12-02 8:15 p.m. (America/Chicago) |
| 401929187 | absent | 2026-12-03T03:00:00Z; Gonzaga Bulldogs; Eastern Oregon Mountaineers; scheduled | verified addition | S124 ESPN: 2026-12-03T03:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S89: Eastern Oregon 2026-12-02 7 p.m. (America/Los_Angeles) |
| 401921066 | absent | 2026-12-03T03:00:00Z; San Francisco Dons; UNLV Rebels; scheduled | verified addition | S124 ESPN: 2026-12-03T03:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S14: San Francisco 2026-12-02 7:00 PM PT (America/Los_Angeles)<br>S73: UNLV 2026-12-02 7:00 p.m. (America/Los_Angeles) |
| 401917556 | absent | 2026-12-03T03:00:00Z; Santa Clara Broncos; Fresno State Bulldogs; scheduled | verified addition | S124 ESPN: 2026-12-03T03:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S46: Santa Clara  2026-12-02 7:00 p.m. PT (America/Los_Angeles) |
| 401911460 | absent | 2026-12-03T03:00:00Z; Nevada Wolf Pack; Pacific Tigers; scheduled | verified addition | S124 ESPN: 2026-12-03T03:00:00Z; timeValid=True; STATUS_SCHEDULED<br>S110: Dec 2 7 PM PT |
| 401921879 | 2026-12-03T03:30:00Z; USC Trojans; Washington Huskies; active | 2026-12-03T03:30:00Z; USC Trojans; Washington Huskies; scheduled | unchanged | S124 ESPN: 2026-12-03T03:30:00Z; timeValid=True; STATUS_SCHEDULED<br>S18: USC 2026-12-02 7:30 p.m. PT (America/Los_Angeles)<br>S23: Washington 2026-12-02 7:30 p.m. PT (America/Los_Angeles) |

## Source URLs

- S1: https://goducks.com/news/2026/11/14/mens-basketball-game-against-pepperdine-postponed
- S2: https://pepperdinewaves.com/news/2026/11/14/mens-basketball-mens-basketballs-game-at-oregon-postponed
- S3: https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=20261119&groups=50&limit=1000
- S4: https://wvusports.com/sports/mens-basketball/schedule
- S5: https://floridagators.com/sports/mens-basketball/schedule
- S6: https://auburntigers.com/sports/mens-basketball/schedule
- S7: https://gopack.com/sports/mens-basketball/schedule
- S8: https://goracers.com/sports/mens-basketball/schedule
- S9: https://utrockets.com/sports/mens-basketball/schedule
- S10: https://godrakebulldogs.com/sports/mens-basketball/schedule
- S11: https://texaslonghorns.com/sports/mens-basketball/schedule
- S12: https://gocards.com/sports/mens-basketball/schedule
- S13: https://gofrogs.com/sports/mens-basketball/schedule
- S14: https://unlvrebels.com/sports/mens-basketball/schedule
- S15: https://goducks.com/sports/mens-basketball/schedule
- S16: https://osubeavers.com/sports/mens-basketball/schedule
- S17: https://pepperdinewaves.com/sports/mens-basketball/schedule
- S18: https://gohuskies.com/sports/mens-basketball/schedule
- S19: https://gostanford.com/sports/mens-basketball/schedule
- S20: https://calbears.com/sports/mens-basketball/schedule
- S21: https://santaclarabroncos.com/sports/mens-basketball/schedule
- S22: https://kuathletics.com/sports/mens-basketball/schedule
- S23: https://usctrojans.com/sports/mens-basketball/schedule
- S24: https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=20261120&groups=50&limit=1000
- S25: https://seminoles.com/sports/mens-basketball/schedule
- S26: https://okstate.com/sports/mens-basketball/schedule
- S27: https://owlsports.com/sports/mens-basketball/schedule
- S28: https://uabsports.com/sports/mens-basketball/schedule
- S29: https://gwsports.com/sports/mens-basketball/schedule
- S30: https://siusalukis.com/sports/mens-basketball/schedule
- S31: https://meangreensports.com/sports/mens-basketball/schedule
- S32: https://richmondspiders.com/sports/mens-basketball/schedule
- S33: https://wkusports.com/sports/mens-basketball/schedule
- S34: https://drexeldragons.com/sports/mens-basketball/schedule
- S35: https://pittsburghpanthers.com/sports/mens-basketball/schedule
- S36: https://hailstate.com/sports/mens-basketball/schedule
- S37: https://tulsahurricane.com/sports/mens-basketball/schedule
- S38: https://vucommodores.com/sports/mbball/schedule
- S39: https://arkansasrazorbacks.com/sport/m-baskbl/schedule/
- S40: https://smumustangs.com/sports/mens-basketball/schedule
- S41: https://mutigers.com/sports/mens-basketball/schedule
- S42: https://ecupirates.com/sports/mens-basketball/schedule
- S43: https://kstatesports.com/sports/mens-basketball/schedule
- S44: https://georgiadogs.com/sports/mens-basketball/schedule
- S45: https://broncosports.com/sports/mens-basketball/schedule
- S46: https://gobulldogs.com/sports/mens-basketball/schedule
- S47: https://smcgaels.com/sports/mens-basketball/schedule
- S48: https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=20261121&groups=50&limit=1000
- S49: https://lsusports.net/sports/mens-basketball/schedule
- S50: https://emueagles.com/sports/mens-basketball/schedule
- S51: https://goshockers.com/sports/mens-basketball/schedule
- S52: https://godeacs.com/sports/mens-basketball/schedule
- S53: https://cuse.com/sports/mens-basketball/schedule
- S54: https://goexplorers.com/sports/mens-basketball/schedule
- S55: https://gousfbulls.com/sports/mens-basketball/schedule
- S56: https://goairforcefalcons.com/sports/mens-basketball/schedule
- S57: https://mgoblue.com/sports/mens-basketball/schedule
- S58: https://pacifictigers.com/sports/mens-basketball/schedule
- S59: https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=20261122&groups=50&limit=1000
- S60: https://miamiredhawks.com/sports/mens-basketball/schedule
- S61: https://butlersports.com/sports/mens-basketball/schedule
- S62: https://huskers.com/sports/mens-basketball/schedule
- S63: https://www.ticketmaster.com/butler-vs-nebraska-men-s-basketball-chicago-11-22-2026/event/040064F6D248F7ED?tt_scene=anchor_view
- S64: https://gobearcats.com/sports/mens-basketball/schedule
- S65: https://goduquesne.com/sports/mens-basketball/schedule
- S66: https://gowyo.com/sports/mens-basketball/schedule
- S67: https://gotigersgo.com/sports/mens-basketball/schedule
- S68: https://txst.com/sports/mens-basketball/schedule
- S69: https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=20261123&groups=50&limit=1000
- S70: https://unipanthers.com/sports/mens-basketball/schedule
- S71: https://gozips.com/sports/mens-basketball/schedule
- S72: https://charlotte49ers.com/sports/mens-basketball/schedule
- S73: https://usfdons.com/sports/mens-basketball/schedule
- S74: https://arizonawildcats.com/sports/mens-basketball/schedule
- S75: https://csurams.com/sports/mens-basketball/schedule
- S76: https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=20261124&groups=50&limit=1000
- S77: https://cyclones.com/sports/mens-basketball/schedule
- S78: https://hawkeyesports.com/sports/mbball/schedule
- S79: https://ramblinwreck.com/sports/m-baskbl/schedule
- S80: https://cmuchippewas.com/sports/mens-basketball/schedule
- S81: https://wsucougars.com/sports/mens-basketball/schedule
- S82: https://redstormsports.com/sports/mens-basketball/schedule
- S83: https://cubuffs.com/sports/mens-basketball/schedule
- S84: https://www.acrisurearena.com/events/detail/acrisure-series-day-3
- S85: https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=20261125&groups=50&limit=1000
- S86: https://golobos.com/sports/mbball/schedule
- S87: https://www.ticketdata.com/events/172427516
- S88: https://www.on3.com/college/basketball/schedule/?date=2026-11-25
- S89: https://gozags.com/sports/mens-basketball/schedule
- S90: https://fordhamsports.com/sports/mens-basketball/schedule
- S91: https://gorhody.com/sports/mens-basketball/schedule
- S92: https://wmubroncos.com/sports/mens-basketball/schedule
- S93: https://www.eaglebankarena.com/events/detail/george-mason-vs-longwood-11252026
- S94: https://jaxstatesports.com/sports/mens-basketball/schedule
- S95: https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=20261126&groups=50&limit=1000
- S96: https://goutsa.com/sports/mens-basketball/schedule
- S97: https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=20261127&groups=50&limit=1000
- S98: https://hokiesports.com/sports/mens-basketball/schedule
- S99: https://uhcougars.com/sports/mens-basketball/schedule
- S100: https://gobison.com/sports/mens-basketball/schedule
- S101: https://ucdavisaggies.com/sports/mens-basketball/schedule
- S102: https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=20261128&groups=50&limit=1000
- S103: https://www.axs.com/events/1582311/prairie-view-am-panthers-at-iowa-hawkeyes-mens-basketball-tickets
- S104: https://bradleybraves.com/sports/mens-basketball/schedule/2026-27
- S105: https://arena.peoriaciviccenter.com/event/bradley-mens-basketball-v-chicago-state/tm_vv1a6zkfwgkeil4az/
- S106: https://necsports.com/schedule.aspx?schedule=9913
- S107: https://www.on3.com/college/basketball/schedule/?date=2026-11-28
- S108: https://usdtoreros.com/sports/mens-basketball/schedule
- S109: https://monmouthhawks.com/sports/mens-basketball/schedule
- S110: https://nevadawolfpack.com/sports/mens-basketball/schedule
- S111: https://stonehillskyhawks.com/sports/mens-basketball/schedule
- S112: https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=20261129&groups=50&limit=1000
- S113: https://astateredwolves.com/sports/mens-basketball/schedule
- S114: https://siuecougars.com/sports/mens-basketball/schedule
- S115: https://mountainamericacenter.com/snake-river-invitational/
- S116: https://calendar.unt.edu/event/unt-mens-basketball-vs-drake
- S117: https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=20261130&groups=50&limit=1000
- S118: https://gopurpleaces.com/sports/mens-basketball/schedule
- S119: https://thesundevils.com/sports/mens-basketball/schedule
- S120: https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=20261201&groups=50&limit=1000
- S121: https://ucfknights.com/sports/mens-basketball/schedule
- S122: https://gopsusports.com/sports/mens-basketball/schedule
- S123: https://goseattleu.com/sports/mens-basketball/schedule
- S124: https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=20261202&groups=50&limit=1000
- S125: https://fiusports.com/sports/mens-basketball/schedule
- S126: https://uicflames.com/sports/mens-basketball/schedule
- S127: https://slubillikens.com/sports/mens-basketball/schedule

## Validation and resume

Validation: core build, data typecheck, data tests (80 passed, two optional database tests
skipped), workspace lint, workspace typecheck, and `git diff --check` passed.
Workspace typecheck initially lacked generated package outputs; local data/API/jobs builds
passed and the subsequent full typecheck passed. No persistent infrastructure was started.
The optional tests require `UFC_TEST_DATABASE_URL`, which was not configured.
A catalog comparison confirms all 1,604 original IDs remain, 145 IDs were added, and exactly
nine existing tuples changed (eight times and one availability). PR/head and exact results
are recorded in the PR body.
Resume by fetching main and inspecting the same branch/PR; revisit the five decisions above
and newly resolved tournament rounds before expanding beyond this window.
