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

type NbaTeamBuilderContext = {
  readonly make: typeof makeSportTeamSubject;
};

type NbaTeamBuilder = (context: NbaTeamBuilderContext) => Subject["details"];

const makeNbaSubjectId = (index: number): Subject["id"] =>
  `00000000-0000-4000-8000-${String(index + 101).padStart(12, "0")}`;

const makeNbaTeam = (fn: NbaTeamBuilder, index: number): Subject => {
  const details = fn({ make: makeSportTeamSubject });

  return {
    id: makeNbaSubjectId(index),
    _tag: details._tag,
    details,
  };
};

export const NBA_TEAMS = [
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Atlanta",
        name: "Hawks",
        abbreviation: "ATL",
        slug: "atlanta-hawks",
      }),
    0,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Boston",
        name: "Celtics",
        abbreviation: "BOS",
        slug: "boston-celtics",
      }),
    1,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Brooklyn",
        name: "Nets",
        abbreviation: "BKN",
        slug: "brooklyn-nets",
      }),
    2,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Charlotte",
        name: "Hornets",
        abbreviation: "CHA",
        slug: "charlotte-hornets",
      }),
    3,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Chicago",
        name: "Bulls",
        abbreviation: "CHI",
        slug: "chicago-bulls",
      }),
    4,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Cleveland",
        name: "Cavaliers",
        abbreviation: "CLE",
        slug: "cleveland-cavaliers",
      }),
    5,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Dallas",
        name: "Mavericks",
        abbreviation: "DAL",
        slug: "dallas-mavericks",
      }),
    6,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Denver",
        name: "Nuggets",
        abbreviation: "DEN",
        slug: "denver-nuggets",
      }),
    7,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Detroit",
        name: "Pistons",
        abbreviation: "DET",
        slug: "detroit-pistons",
      }),
    8,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Golden State",
        name: "Warriors",
        abbreviation: "GSW",
        slug: "golden-state-warriors",
      }),
    9,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Houston",
        name: "Rockets",
        abbreviation: "HOU",
        slug: "houston-rockets",
      }),
    10,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Indiana",
        name: "Pacers",
        abbreviation: "IND",
        slug: "indiana-pacers",
      }),
    11,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "LA",
        name: "Clippers",
        abbreviation: "LAC",
        slug: "la-clippers",
      }),
    12,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Los Angeles",
        name: "Lakers",
        abbreviation: "LAL",
        slug: "los-angeles-lakers",
      }),
    13,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Memphis",
        name: "Grizzlies",
        abbreviation: "MEM",
        slug: "memphis-grizzlies",
      }),
    14,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Miami",
        name: "Heat",
        abbreviation: "MIA",
        slug: "miami-heat",
      }),
    15,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Milwaukee",
        name: "Bucks",
        abbreviation: "MIL",
        slug: "milwaukee-bucks",
      }),
    16,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Minnesota",
        name: "Timberwolves",
        abbreviation: "MIN",
        slug: "minnesota-timberwolves",
      }),
    17,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "New Orleans",
        name: "Pelicans",
        abbreviation: "NOP",
        slug: "new-orleans-pelicans",
      }),
    18,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "New York",
        name: "Knicks",
        abbreviation: "NYK",
        slug: "new-york-knicks",
      }),
    19,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Oklahoma City",
        name: "Thunder",
        abbreviation: "OKC",
        slug: "oklahoma-city-thunder",
      }),
    20,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Orlando",
        name: "Magic",
        abbreviation: "ORL",
        slug: "orlando-magic",
      }),
    21,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Philadelphia",
        name: "76ers",
        abbreviation: "PHI",
        slug: "philadelphia-76ers",
      }),
    22,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Phoenix",
        name: "Suns",
        abbreviation: "PHX",
        slug: "phoenix-suns",
      }),
    23,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Portland",
        name: "Trail Blazers",
        abbreviation: "POR",
        slug: "portland-trail-blazers",
      }),
    24,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Sacramento",
        name: "Kings",
        abbreviation: "SAC",
        slug: "sacramento-kings",
      }),
    25,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "San Antonio",
        name: "Spurs",
        abbreviation: "SAS",
        slug: "san-antonio-spurs",
      }),
    26,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Toronto",
        name: "Raptors",
        abbreviation: "TOR",
        slug: "toronto-raptors",
      }),
    27,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Utah",
        name: "Jazz",
        abbreviation: "UTA",
        slug: "utah-jazz",
      }),
    28,
  ),
  makeNbaTeam(
    (ctx) =>
      ctx.make({
        leagueId: "nba",
        location: "Washington",
        name: "Wizards",
        abbreviation: "WAS",
        slug: "washington-wizards",
      }),
    29,
  ),
] satisfies readonly Subject[];

export const getLogo = (abbr: string) => NBA_LOGOS[abbr] ?? FALLBACK_LOGO;

export const getTeams = (subjects: readonly Subject[]) =>
  subjects.toSorted((a, b) =>
    `${a.details.location} ${a.details.name}`.localeCompare(
      `${b.details.location} ${b.details.name}`,
    ),
  );
