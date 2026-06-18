import { Subject } from "@dtpt/core-v2/modules/subjects/schema";
import { SportTeamSubject } from "@dtpt/core-v2/modules/subjects/variants/sport.schema";

const fallback = "🏀";

const logos = {
  ATL: "🦅",
  BOS: "🍀",
  BKN: "🕸️",
  CHA: "🐝",
  CHI: "🐂",
  CLE: "⚔️",
  DAL: "🐴",
  DEN: "⛏️",
  DET: "🔧",
  GSW: "🌉",
  HOU: "🚀",
  IND: "🏁",
  LAC: "⛵",
  LAL: "🌟",
  MEM: "🐻",
  MIA: "🔥",
  MIL: "🦌",
  MIN: "🐺",
  NOP: "🪶",
  NYK: "🗽",
  OKC: "⚡",
  ORL: "🪄",
  PHI: "🔔",
  PHX: "☀️",
  POR: "🌲",
  SAC: "👑",
  SAS: "🤠",
  TOR: "🦖",
  UTA: "🎷",
  WAS: "🧙",
};

const makeSportTeamSubject: typeof SportTeamSubject.make = (input) =>
  SportTeamSubject.make(input);

type NbaTeamBuilder = (make: typeof makeSportTeamSubject) => Subject["details"];

const makeNbaSubjectId = (serial: number): Subject["id"] =>
  Subject.fields.id.make(
    `00000000-0000-4000-8000-${String(serial + 100).padStart(12, "0")}`,
  );

const makeNbaTeam = (serial: number, fn: NbaTeamBuilder): Subject => {
  const details = fn(makeSportTeamSubject);

  return {
    id: makeNbaSubjectId(serial),
    _tag: details._tag,
    details,
  };
};

export const nbaTeams = [
  makeNbaTeam(1, (make) =>
    make({
      leagueId: "nba",
      location: "Atlanta",
      name: "Hawks",
      display: "Atlanta Hawks",
      abbreviation: "ATL",
      slug: "atlanta-hawks",
    }),
  ),
  makeNbaTeam(2, (make) =>
    make({
      leagueId: "nba",
      location: "Boston",
      name: "Celtics",
      display: "Boston Celtics",
      abbreviation: "BOS",
      slug: "boston-celtics",
    }),
  ),
  makeNbaTeam(3, (make) =>
    make({
      leagueId: "nba",
      location: "Brooklyn",
      name: "Nets",
      display: "Brooklyn Nets",
      abbreviation: "BKN",
      slug: "brooklyn-nets",
    }),
  ),
  makeNbaTeam(4, (make) =>
    make({
      leagueId: "nba",
      location: "Charlotte",
      name: "Hornets",
      display: "Charlotte Hornets",
      abbreviation: "CHA",
      slug: "charlotte-hornets",
    }),
  ),
  makeNbaTeam(5, (make) =>
    make({
      leagueId: "nba",
      location: "Chicago",
      name: "Bulls",
      display: "Chicago Bulls",
      abbreviation: "CHI",
      slug: "chicago-bulls",
    }),
  ),
  makeNbaTeam(6, (make) =>
    make({
      leagueId: "nba",
      location: "Cleveland",
      name: "Cavaliers",
      display: "Cleveland Cavaliers",
      abbreviation: "CLE",
      slug: "cleveland-cavaliers",
    }),
  ),
  makeNbaTeam(7, (make) =>
    make({
      leagueId: "nba",
      location: "Dallas",
      name: "Mavericks",
      display: "Dallas Mavericks",
      abbreviation: "DAL",
      slug: "dallas-mavericks",
    }),
  ),
  makeNbaTeam(8, (make) =>
    make({
      leagueId: "nba",
      location: "Denver",
      name: "Nuggets",
      display: "Denver Nuggets",
      abbreviation: "DEN",
      slug: "denver-nuggets",
    }),
  ),
  makeNbaTeam(9, (make) =>
    make({
      leagueId: "nba",
      location: "Detroit",
      name: "Pistons",
      display: "Detroit Pistons",
      abbreviation: "DET",
      slug: "detroit-pistons",
    }),
  ),
  makeNbaTeam(10, (make) =>
    make({
      leagueId: "nba",
      location: "Golden State",
      name: "Warriors",
      display: "Golden State Warriors",
      abbreviation: "GSW",
      slug: "golden-state-warriors",
    }),
  ),
  makeNbaTeam(11, (make) =>
    make({
      leagueId: "nba",
      location: "Houston",
      name: "Rockets",
      display: "Houston Rockets",
      abbreviation: "HOU",
      slug: "houston-rockets",
    }),
  ),
  makeNbaTeam(12, (make) =>
    make({
      leagueId: "nba",
      location: "Indiana",
      name: "Pacers",
      display: "Indiana Pacers",
      abbreviation: "IND",
      slug: "indiana-pacers",
    }),
  ),
  makeNbaTeam(13, (make) =>
    make({
      leagueId: "nba",
      location: "LA",
      name: "Clippers",
      display: "LA Clippers",
      abbreviation: "LAC",
      slug: "la-clippers",
    }),
  ),
  makeNbaTeam(14, (make) =>
    make({
      leagueId: "nba",
      location: "Los Angeles",
      name: "Lakers",
      display: "Los Angeles Lakers",
      abbreviation: "LAL",
      slug: "los-angeles-lakers",
    }),
  ),
  makeNbaTeam(15, (make) =>
    make({
      leagueId: "nba",
      location: "Memphis",
      name: "Grizzlies",
      display: "Memphis Grizzlies",
      abbreviation: "MEM",
      slug: "memphis-grizzlies",
    }),
  ),
  makeNbaTeam(16, (make) =>
    make({
      leagueId: "nba",
      location: "Miami",
      name: "Heat",
      display: "Miami Heat",
      abbreviation: "MIA",
      slug: "miami-heat",
    }),
  ),
  makeNbaTeam(17, (make) =>
    make({
      leagueId: "nba",
      location: "Milwaukee",
      name: "Bucks",
      display: "Milwaukee Bucks",
      abbreviation: "MIL",
      slug: "milwaukee-bucks",
    }),
  ),
  makeNbaTeam(18, (make) =>
    make({
      leagueId: "nba",
      location: "Minnesota",
      name: "Timberwolves",
      display: "Minnesota Timberwolves",
      abbreviation: "MIN",
      slug: "minnesota-timberwolves",
    }),
  ),
  makeNbaTeam(19, (make) =>
    make({
      leagueId: "nba",
      location: "New Orleans",
      name: "Pelicans",
      display: "New Orleans Pelicans",
      abbreviation: "NOP",
      slug: "new-orleans-pelicans",
    }),
  ),
  makeNbaTeam(20, (make) =>
    make({
      leagueId: "nba",
      location: "New York",
      name: "Knicks",
      display: "New York Knicks",
      abbreviation: "NYK",
      slug: "new-york-knicks",
    }),
  ),
  makeNbaTeam(21, (make) =>
    make({
      leagueId: "nba",
      location: "Oklahoma City",
      name: "Thunder",
      display: "Oklahoma City Thunder",
      abbreviation: "OKC",
      slug: "oklahoma-city-thunder",
    }),
  ),
  makeNbaTeam(22, (make) =>
    make({
      leagueId: "nba",
      location: "Orlando",
      name: "Magic",
      display: "Orlando Magic",
      abbreviation: "ORL",
      slug: "orlando-magic",
    }),
  ),
  makeNbaTeam(23, (make) =>
    make({
      leagueId: "nba",
      location: "Philadelphia",
      name: "76ers",
      display: "Philadelphia 76ers",
      abbreviation: "PHI",
      slug: "philadelphia-76ers",
    }),
  ),
  makeNbaTeam(24, (make) =>
    make({
      leagueId: "nba",
      location: "Phoenix",
      name: "Suns",
      display: "Phoenix Suns",
      abbreviation: "PHX",
      slug: "phoenix-suns",
    }),
  ),
  makeNbaTeam(25, (make) =>
    make({
      leagueId: "nba",
      location: "Portland",
      name: "Trail Blazers",
      display: "Portland Trail Blazers",
      abbreviation: "POR",
      slug: "portland-trail-blazers",
    }),
  ),
  makeNbaTeam(26, (make) =>
    make({
      leagueId: "nba",
      location: "Sacramento",
      name: "Kings",
      display: "Sacramento Kings",
      abbreviation: "SAC",
      slug: "sacramento-kings",
    }),
  ),
  makeNbaTeam(27, (make) =>
    make({
      leagueId: "nba",
      location: "San Antonio",
      name: "Spurs",
      display: "San Antonio Spurs",
      abbreviation: "SAS",
      slug: "san-antonio-spurs",
    }),
  ),
  makeNbaTeam(28, (make) =>
    make({
      leagueId: "nba",
      location: "Toronto",
      name: "Raptors",
      display: "Toronto Raptors",
      abbreviation: "TOR",
      slug: "toronto-raptors",
    }),
  ),
  makeNbaTeam(29, (make) =>
    make({
      leagueId: "nba",
      location: "Utah",
      name: "Jazz",
      display: "Utah Jazz",
      abbreviation: "UTA",
      slug: "utah-jazz",
    }),
  ),
  makeNbaTeam(30, (make) =>
    make({
      leagueId: "nba",
      location: "Washington",
      name: "Wizards",
      display: "Washington Wizards",
      abbreviation: "WAS",
      slug: "washington-wizards",
    }),
  ),
] satisfies readonly Subject[];

export const getNbaLogo = (abbr: string) =>
  abbr in logos ? logos[abbr as keyof typeof logos] : fallback;
