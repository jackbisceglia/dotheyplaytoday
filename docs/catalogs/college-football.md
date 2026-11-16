# College football catalog

## Coverage policy

`ncaaf` follows CBB's explicit conference allowlist, using **football** membership
for the 2026 season. It supports 112 teams in the eight CBB conferences that
sponsor FBS football: ACC (17), American (14), Big Ten (18), Big 12 (16), MAC
(13), Mountain West (10), Pac-12 (8), and SEC (16).

Atlantic 10, Big East, Missouri Valley, and WCC do not sponsor football. Missouri
Valley Football is a separate conference and is not implicitly included.
Independent Notre Dame and UConn are not ACC/Big East football members; neither
is supported. C-USA, Sun Belt, FCS, and other divisions are outside this policy.
Their teams can appear as opponents without receiving subjects or feed edges.

Football-only Army and Navy belong to the American; Wichita State does not play
football. Sacramento State belongs to the MAC; NIU and North Dakota State belong
to the Mountain West, alongside new full member UTEP. Pac-12 includes Texas
State but not non-football Gonzaga. No basketball subject IDs or memberships
are reused or changed.

Membership was checked on 2026-11-14 against ESPN's season-specific
[standings](https://site.api.espn.com/apis/v2/sports/football/college-football/standings?season=2026)
and official sources for sport-specific differences:

- [Pac-12's eight football members and flex schedule](https://pac-12.com/news/2026/2/9/general-the-new-pac-12-announces-its-2026-football-schedule.aspx).
- [Mountain West's ten football members](https://themw.com/news/2026/6/4/mw-announces-2026-football-schedule.aspx).
- [Sacramento State's MAC football affiliation](https://getsomemaction.com/news/2026/6/29/sacramento-state-officially-joins-mac-as-football-affiliate-member.aspx).
- [American's 14-team configuration](https://goarmywestpoint.com/news/2025/10/14/footballs-2026-american-conference-opponents-set).

## Schedule snapshot and refresh

Fetched 2026-11-14 from ESPN's college-football team schedule endpoint:
`https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/{espnId}/schedule?season=2026`.
Team names, full nicknames, abbreviations, and slugs came from the same provider's
[team catalog](https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=1000).
The identity table below records every included provider ID.

The 112 team feeds contained 759 distinct regular-season games. The checked-in
snapshot includes 707 and excludes 52 with unconfirmed starts. Both the event
and competition must explicitly have `timeValid: true`, matching UTC dates,
two identified opponents with home/away designations, and a scheduled, live,
or completed status. Duplicate appearances agreed on start and participants.
There were no cancelled/postponed games in this snapshot. Missing dates or
confirmation must never become guessed noon/midnight notification events.

Published starts span August 29 through December 12, 2026; 112 are on or after
November 14 at 00:00 UTC. This is a snapshot, not a live feed or a completeness
claim. Later TV selections, postseason pairings, cancellations and rescheduling
require another reviewed catalog update. There are no postseason placeholders.
Pac-12 November 28 flex matchups are still provisional and excluded (their
starts were also unconfirmed); confirm the participants as well as kickoff on
refresh. Prior confirmed games that become postponed/cancelled must explicitly
be deactivated; omission from a later seed does not remove existing database rows.

UTC instants are retained verbatim, adding seconds where omitted. For independent
timezone checks, [Eastern Michigan's release](https://emueagles.com/news/2026/5/27/kickoff-times-tv-set-for-eight-emu-football-games)
sets Sacramento State on August 29 at 6:30 PM Eastern (`22:30Z`, EDT), and
[Army's release](https://goarmywestpoint.com/news/2026/5/27/army-football-announces-2026-kickoff-times-and-tv-networks-features-four-national-broadcasts)
sets Army–Navy on December 12 at 3 PM Eastern (`20:00Z`, EST). Display and
notification dates use the subscriber's timezone, including games whose UTC
date is the following day. Neutral sites retain ESPN's designated home/away
roles, as CBB does; venue/neutral-site presentation is not modeled.

## Integration and release review

The layout is CBB's `sports/ncaaf/{subjects,events,index}.ts`: explicit stable
subject UUIDs in the `400000000001`–`400000000112` suffix range, ESPN-derived
event UUIDs (`00000000-0000-4000-8000-000{espnGameId}`), and
`sports_game:espn:{eventUuid}` source IDs. Events shared by two supported teams
are stored once and linked to both feeds. Never renumber subjects on refresh.

`SportLeague` validates football's eight conferences and nullable AP rank with
the same missing-key default as CBB. No rankings are populated, so the shared
college picker initially shows conferences, not Top 25. Signup, the four-pick
limit, dashboard, daily reminders, and weekly digest use existing sports paths.
The generic football emoji is used. NFL's special kickoff headline remains NFL-only.

`SeedCollections` registers the catalog and `CatalogSeedVersion` is
`2026-11-14.1`. Development subsets and production's historical cutoff apply
unchanged. No database migration or scheduled task is added. Release schema
consumers before publishing the new catalog so older workers do not encounter
an unknown league. Deploy web headline PNGs with the release. This PR does not
perform deployment or seeding.

After building core and data, run the existing web headline generator. Commit
new PNGs and run the asset coverage test, which checks all catalog team and
weekly headline paths and dimensions. Existing identical nickname tiles are
shared with CBB/pro sports. Provider terms/SLA and automatic reconciliation
remain unverified, as for CBB; inspect these before treating snapshots as live
coverage.

## Stable team identities

Subject suffixes below are appended to `00000000-0000-4000-8000-`.

| Subject suffix | ESPN team ID | Team                        | Football conference |
| -------------- | ------------ | --------------------------- | ------------------- |
| 400000000001   | 2005         | Air Force Falcons           | mountain-west       |
| 400000000002   | 2006         | Akron Zips                  | mac                 |
| 400000000003   | 333          | Alabama Crimson Tide        | sec                 |
| 400000000004   | 9            | Arizona State Sun Devils    | big-12              |
| 400000000005   | 12           | Arizona Wildcats            | big-12              |
| 400000000006   | 8            | Arkansas Razorbacks         | sec                 |
| 400000000007   | 349          | Army Black Knights          | aac                 |
| 400000000008   | 2            | Auburn Tigers               | sec                 |
| 400000000009   | 252          | BYU Cougars                 | big-12              |
| 400000000010   | 2050         | Ball State Cardinals        | mac                 |
| 400000000011   | 239          | Baylor Bears                | big-12              |
| 400000000012   | 68           | Boise State Broncos         | pac-12              |
| 400000000013   | 103          | Boston College Eagles       | acc                 |
| 400000000014   | 189          | Bowling Green Falcons       | mac                 |
| 400000000015   | 2084         | Buffalo Bulls               | mac                 |
| 400000000016   | 25           | California Golden Bears     | acc                 |
| 400000000017   | 2117         | Central Michigan Chippewas  | mac                 |
| 400000000018   | 2429         | Charlotte 49ers             | aac                 |
| 400000000019   | 2132         | Cincinnati Bearcats         | big-12              |
| 400000000020   | 228          | Clemson Tigers              | acc                 |
| 400000000021   | 38           | Colorado Buffaloes          | big-12              |
| 400000000022   | 36           | Colorado State Rams         | pac-12              |
| 400000000023   | 150          | Duke Blue Devils            | acc                 |
| 400000000024   | 151          | East Carolina Pirates       | aac                 |
| 400000000025   | 2199         | Eastern Michigan Eagles     | mac                 |
| 400000000026   | 2226         | Florida Atlantic Owls       | aac                 |
| 400000000027   | 57           | Florida Gators              | sec                 |
| 400000000028   | 52           | Florida State Seminoles     | acc                 |
| 400000000029   | 278          | Fresno State Bulldogs       | pac-12              |
| 400000000030   | 61           | Georgia Bulldogs            | sec                 |
| 400000000031   | 59           | Georgia Tech Yellow Jackets | acc                 |
| 400000000032   | 62           | Hawai'i Rainbow Warriors    | mountain-west       |
| 400000000033   | 248          | Houston Cougars             | big-12              |
| 400000000034   | 356          | Illinois Fighting Illini    | big-ten             |
| 400000000035   | 84           | Indiana Hoosiers            | big-ten             |
| 400000000036   | 2294         | Iowa Hawkeyes               | big-ten             |
| 400000000037   | 66           | Iowa State Cyclones         | big-12              |
| 400000000038   | 2305         | Kansas Jayhawks             | big-12              |
| 400000000039   | 2306         | Kansas State Wildcats       | big-12              |
| 400000000040   | 2309         | Kent State Golden Flashes   | mac                 |
| 400000000041   | 96           | Kentucky Wildcats           | sec                 |
| 400000000042   | 99           | LSU Tigers                  | sec                 |
| 400000000043   | 97           | Louisville Cardinals        | acc                 |
| 400000000044   | 120          | Maryland Terrapins          | big-ten             |
| 400000000045   | 113          | Massachusetts Minutemen     | mac                 |
| 400000000046   | 235          | Memphis Tigers              | aac                 |
| 400000000047   | 193          | Miami (OH) RedHawks         | mac                 |
| 400000000048   | 2390         | Miami Hurricanes            | acc                 |
| 400000000049   | 127          | Michigan State Spartans     | big-ten             |
| 400000000050   | 130          | Michigan Wolverines         | big-ten             |
| 400000000051   | 135          | Minnesota Golden Gophers    | big-ten             |
| 400000000052   | 344          | Mississippi State Bulldogs  | sec                 |
| 400000000053   | 142          | Missouri Tigers             | sec                 |
| 400000000054   | 152          | NC State Wolfpack           | acc                 |
| 400000000055   | 2426         | Navy Midshipmen             | aac                 |
| 400000000056   | 158          | Nebraska Cornhuskers        | big-ten             |
| 400000000057   | 2440         | Nevada Wolf Pack            | mountain-west       |
| 400000000058   | 167          | New Mexico Lobos            | mountain-west       |
| 400000000059   | 153          | North Carolina Tar Heels    | acc                 |
| 400000000060   | 2449         | North Dakota State Bison    | mountain-west       |
| 400000000061   | 249          | North Texas Mean Green      | aac                 |
| 400000000062   | 2459         | Northern Illinois Huskies   | mountain-west       |
| 400000000063   | 77           | Northwestern Wildcats       | big-ten             |
| 400000000064   | 195          | Ohio Bobcats                | mac                 |
| 400000000065   | 194          | Ohio State Buckeyes         | big-ten             |
| 400000000066   | 201          | Oklahoma Sooners            | sec                 |
| 400000000067   | 197          | Oklahoma State Cowboys      | big-12              |
| 400000000068   | 145          | Ole Miss Rebels             | sec                 |
| 400000000069   | 2483         | Oregon Ducks                | big-ten             |
| 400000000070   | 204          | Oregon State Beavers        | pac-12              |
| 400000000071   | 213          | Penn State Nittany Lions    | big-ten             |
| 400000000072   | 221          | Pittsburgh Panthers         | acc                 |
| 400000000073   | 2509         | Purdue Boilermakers         | big-ten             |
| 400000000074   | 242          | Rice Owls                   | aac                 |
| 400000000075   | 164          | Rutgers Scarlet Knights     | big-ten             |
| 400000000076   | 2567         | SMU Mustangs                | acc                 |
| 400000000077   | 16           | Sacramento State Hornets    | mac                 |
| 400000000078   | 21           | San Diego State Aztecs      | pac-12              |
| 400000000079   | 23           | San José State Spartans     | mountain-west       |
| 400000000080   | 2579         | South Carolina Gamecocks    | sec                 |
| 400000000081   | 58           | South Florida Bulls         | aac                 |
| 400000000082   | 24           | Stanford Cardinal           | acc                 |
| 400000000083   | 183          | Syracuse Orange             | acc                 |
| 400000000084   | 2628         | TCU Horned Frogs            | big-12              |
| 400000000085   | 218          | Temple Owls                 | aac                 |
| 400000000086   | 2633         | Tennessee Volunteers        | sec                 |
| 400000000087   | 245          | Texas A&M Aggies            | sec                 |
| 400000000088   | 251          | Texas Longhorns             | sec                 |
| 400000000089   | 326          | Texas State Bobcats         | pac-12              |
| 400000000090   | 2641         | Texas Tech Red Raiders      | big-12              |
| 400000000091   | 2649         | Toledo Rockets              | mac                 |
| 400000000092   | 2655         | Tulane Green Wave           | aac                 |
| 400000000093   | 202          | Tulsa Golden Hurricane      | aac                 |
| 400000000094   | 5            | UAB Blazers                 | aac                 |
| 400000000095   | 2116         | UCF Knights                 | big-12              |
| 400000000096   | 26           | UCLA Bruins                 | big-ten             |
| 400000000097   | 2439         | UNLV Rebels                 | mountain-west       |
| 400000000098   | 30           | USC Trojans                 | big-ten             |
| 400000000099   | 2638         | UTEP Miners                 | mountain-west       |
| 400000000100   | 2636         | UTSA Roadrunners            | aac                 |
| 400000000101   | 328          | Utah State Aggies           | pac-12              |
| 400000000102   | 254          | Utah Utes                   | big-12              |
| 400000000103   | 238          | Vanderbilt Commodores       | sec                 |
| 400000000104   | 258          | Virginia Cavaliers          | acc                 |
| 400000000105   | 259          | Virginia Tech Hokies        | acc                 |
| 400000000106   | 154          | Wake Forest Demon Deacons   | acc                 |
| 400000000107   | 264          | Washington Huskies          | big-ten             |
| 400000000108   | 265          | Washington State Cougars    | pac-12              |
| 400000000109   | 277          | West Virginia Mountaineers  | big-12              |
| 400000000110   | 2711         | Western Michigan Broncos    | mac                 |
| 400000000111   | 275          | Wisconsin Badgers           | big-ten             |
| 400000000112   | 2751         | Wyoming Cowboys             | mountain-west       |
