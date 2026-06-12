import { SportTeamSubject } from "@dtpt/core-v2/modules/subjects/variants/sport.schema";

import type { Subject } from "../api.js";

const FALLBACK_LOGO = "🏀";

const NBA_LOGOS: Readonly<Record<string, string>> = {
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

const makeNbaSubjectId = (index: number): Subject["id"] =>
  `00000000-0000-4000-8000-${String(index + 101).padStart(12, "0")}`;

const makeNbaTeam = (index: number, fn: NbaTeamBuilder): Subject => {
  const details = fn(makeSportTeamSubject);

  return {
    id: makeNbaSubjectId(index),
    _tag: details._tag,
    details,
  };
};

export const NBA_TEAMS = [
  makeNbaTeam(0, (make) =>
    make({
      leagueId: "nba",
      location: "Atlanta",
      name: "Hawks",
      abbreviation: "ATL",
      slug: "atlanta-hawks",
    }),
  ),
  makeNbaTeam(1, (make) =>
    make({
      leagueId: "nba",
      location: "Boston",
      name: "Celtics",
      abbreviation: "BOS",
      slug: "boston-celtics",
    }),
  ),
  makeNbaTeam(2, (make) =>
    make({
      leagueId: "nba",
      location: "Brooklyn",
      name: "Nets",
      abbreviation: "BKN",
      slug: "brooklyn-nets",
    }),
  ),
  makeNbaTeam(3, (make) =>
    make({
      leagueId: "nba",
      location: "Charlotte",
      name: "Hornets",
      abbreviation: "CHA",
      slug: "charlotte-hornets",
    }),
  ),
  makeNbaTeam(4, (make) =>
    make({
      leagueId: "nba",
      location: "Chicago",
      name: "Bulls",
      abbreviation: "CHI",
      slug: "chicago-bulls",
    }),
  ),
  makeNbaTeam(5, (make) =>
    make({
      leagueId: "nba",
      location: "Cleveland",
      name: "Cavaliers",
      abbreviation: "CLE",
      slug: "cleveland-cavaliers",
    }),
  ),
  makeNbaTeam(6, (make) =>
    make({
      leagueId: "nba",
      location: "Dallas",
      name: "Mavericks",
      abbreviation: "DAL",
      slug: "dallas-mavericks",
    }),
  ),
  makeNbaTeam(7, (make) =>
    make({
      leagueId: "nba",
      location: "Denver",
      name: "Nuggets",
      abbreviation: "DEN",
      slug: "denver-nuggets",
    }),
  ),
  makeNbaTeam(8, (make) =>
    make({
      leagueId: "nba",
      location: "Detroit",
      name: "Pistons",
      abbreviation: "DET",
      slug: "detroit-pistons",
    }),
  ),
  makeNbaTeam(9, (make) =>
    make({
      leagueId: "nba",
      location: "Golden State",
      name: "Warriors",
      abbreviation: "GSW",
      slug: "golden-state-warriors",
    }),
  ),
  makeNbaTeam(10, (make) =>
    make({
      leagueId: "nba",
      location: "Houston",
      name: "Rockets",
      abbreviation: "HOU",
      slug: "houston-rockets",
    }),
  ),
  makeNbaTeam(11, (make) =>
    make({
      leagueId: "nba",
      location: "Indiana",
      name: "Pacers",
      abbreviation: "IND",
      slug: "indiana-pacers",
    }),
  ),
  makeNbaTeam(12, (make) =>
    make({
      leagueId: "nba",
      location: "LA",
      name: "Clippers",
      abbreviation: "LAC",
      slug: "la-clippers",
    }),
  ),
  makeNbaTeam(13, (make) =>
    make({
      leagueId: "nba",
      location: "Los Angeles",
      name: "Lakers",
      abbreviation: "LAL",
      slug: "los-angeles-lakers",
    }),
  ),
  makeNbaTeam(14, (make) =>
    make({
      leagueId: "nba",
      location: "Memphis",
      name: "Grizzlies",
      abbreviation: "MEM",
      slug: "memphis-grizzlies",
    }),
  ),
  makeNbaTeam(15, (make) =>
    make({
      leagueId: "nba",
      location: "Miami",
      name: "Heat",
      abbreviation: "MIA",
      slug: "miami-heat",
    }),
  ),
  makeNbaTeam(16, (make) =>
    make({
      leagueId: "nba",
      location: "Milwaukee",
      name: "Bucks",
      abbreviation: "MIL",
      slug: "milwaukee-bucks",
    }),
  ),
  makeNbaTeam(17, (make) =>
    make({
      leagueId: "nba",
      location: "Minnesota",
      name: "Timberwolves",
      abbreviation: "MIN",
      slug: "minnesota-timberwolves",
    }),
  ),
  makeNbaTeam(18, (make) =>
    make({
      leagueId: "nba",
      location: "New Orleans",
      name: "Pelicans",
      abbreviation: "NOP",
      slug: "new-orleans-pelicans",
    }),
  ),
  makeNbaTeam(19, (make) =>
    make({
      leagueId: "nba",
      location: "New York",
      name: "Knicks",
      abbreviation: "NYK",
      slug: "new-york-knicks",
    }),
  ),
  makeNbaTeam(20, (make) =>
    make({
      leagueId: "nba",
      location: "Oklahoma City",
      name: "Thunder",
      abbreviation: "OKC",
      slug: "oklahoma-city-thunder",
    }),
  ),
  makeNbaTeam(21, (make) =>
    make({
      leagueId: "nba",
      location: "Orlando",
      name: "Magic",
      abbreviation: "ORL",
      slug: "orlando-magic",
    }),
  ),
  makeNbaTeam(22, (make) =>
    make({
      leagueId: "nba",
      location: "Philadelphia",
      name: "76ers",
      abbreviation: "PHI",
      slug: "philadelphia-76ers",
    }),
  ),
  makeNbaTeam(23, (make) =>
    make({
      leagueId: "nba",
      location: "Phoenix",
      name: "Suns",
      abbreviation: "PHX",
      slug: "phoenix-suns",
    }),
  ),
  makeNbaTeam(24, (make) =>
    make({
      leagueId: "nba",
      location: "Portland",
      name: "Trail Blazers",
      abbreviation: "POR",
      slug: "portland-trail-blazers",
    }),
  ),
  makeNbaTeam(25, (make) =>
    make({
      leagueId: "nba",
      location: "Sacramento",
      name: "Kings",
      abbreviation: "SAC",
      slug: "sacramento-kings",
    }),
  ),
  makeNbaTeam(26, (make) =>
    make({
      leagueId: "nba",
      location: "San Antonio",
      name: "Spurs",
      abbreviation: "SAS",
      slug: "san-antonio-spurs",
    }),
  ),
  makeNbaTeam(27, (make) =>
    make({
      leagueId: "nba",
      location: "Toronto",
      name: "Raptors",
      abbreviation: "TOR",
      slug: "toronto-raptors",
    }),
  ),
  makeNbaTeam(28, (make) =>
    make({
      leagueId: "nba",
      location: "Utah",
      name: "Jazz",
      abbreviation: "UTA",
      slug: "utah-jazz",
    }),
  ),
  makeNbaTeam(29, (make) =>
    make({
      leagueId: "nba",
      location: "Washington",
      name: "Wizards",
      abbreviation: "WAS",
      slug: "washington-wizards",
    }),
  ),
] satisfies readonly Subject[];

export const getLogo = (abbr: string) => NBA_LOGOS[abbr] ?? FALLBACK_LOGO;

export const getTeams = (subjects: readonly Subject[]) =>
  subjects.toSorted((a, b) =>
    `${a.details.location} ${a.details.name}`.localeCompare(
      `${b.details.location} ${b.details.name}`,
    ),
  );
