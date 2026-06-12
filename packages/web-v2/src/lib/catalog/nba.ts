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

type SportTeamSubjectInput = Parameters<typeof SportTeamSubject.make>[0];

const nbaTeam = (id: Subject["id"], input: SportTeamSubjectInput): Subject => {
  const details = SportTeamSubject.make(input);

  return {
    id,
    _tag: details._tag,
    details,
  };
};

export const NBA_TEAMS = [
  nbaTeam("00000000-0000-4000-8000-000000000101", {
    leagueId: "nba",
    location: "Atlanta",
    name: "Hawks",
    abbreviation: "ATL",
    slug: "atlanta-hawks",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000102", {
    leagueId: "nba",
    location: "Boston",
    name: "Celtics",
    abbreviation: "BOS",
    slug: "boston-celtics",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000103", {
    leagueId: "nba",
    location: "Brooklyn",
    name: "Nets",
    abbreviation: "BKN",
    slug: "brooklyn-nets",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000104", {
    leagueId: "nba",
    location: "Charlotte",
    name: "Hornets",
    abbreviation: "CHA",
    slug: "charlotte-hornets",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000105", {
    leagueId: "nba",
    location: "Chicago",
    name: "Bulls",
    abbreviation: "CHI",
    slug: "chicago-bulls",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000106", {
    leagueId: "nba",
    location: "Cleveland",
    name: "Cavaliers",
    abbreviation: "CLE",
    slug: "cleveland-cavaliers",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000107", {
    leagueId: "nba",
    location: "Dallas",
    name: "Mavericks",
    abbreviation: "DAL",
    slug: "dallas-mavericks",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000108", {
    leagueId: "nba",
    location: "Denver",
    name: "Nuggets",
    abbreviation: "DEN",
    slug: "denver-nuggets",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000109", {
    leagueId: "nba",
    location: "Detroit",
    name: "Pistons",
    abbreviation: "DET",
    slug: "detroit-pistons",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000110", {
    leagueId: "nba",
    location: "Golden State",
    name: "Warriors",
    abbreviation: "GSW",
    slug: "golden-state-warriors",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000111", {
    leagueId: "nba",
    location: "Houston",
    name: "Rockets",
    abbreviation: "HOU",
    slug: "houston-rockets",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000112", {
    leagueId: "nba",
    location: "Indiana",
    name: "Pacers",
    abbreviation: "IND",
    slug: "indiana-pacers",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000113", {
    leagueId: "nba",
    location: "LA",
    name: "Clippers",
    abbreviation: "LAC",
    slug: "la-clippers",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000114", {
    leagueId: "nba",
    location: "Los Angeles",
    name: "Lakers",
    abbreviation: "LAL",
    slug: "los-angeles-lakers",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000115", {
    leagueId: "nba",
    location: "Memphis",
    name: "Grizzlies",
    abbreviation: "MEM",
    slug: "memphis-grizzlies",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000116", {
    leagueId: "nba",
    location: "Miami",
    name: "Heat",
    abbreviation: "MIA",
    slug: "miami-heat",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000117", {
    leagueId: "nba",
    location: "Milwaukee",
    name: "Bucks",
    abbreviation: "MIL",
    slug: "milwaukee-bucks",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000118", {
    leagueId: "nba",
    location: "Minnesota",
    name: "Timberwolves",
    abbreviation: "MIN",
    slug: "minnesota-timberwolves",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000119", {
    leagueId: "nba",
    location: "New Orleans",
    name: "Pelicans",
    abbreviation: "NOP",
    slug: "new-orleans-pelicans",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000120", {
    leagueId: "nba",
    location: "New York",
    name: "Knicks",
    abbreviation: "NYK",
    slug: "new-york-knicks",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000121", {
    leagueId: "nba",
    location: "Oklahoma City",
    name: "Thunder",
    abbreviation: "OKC",
    slug: "oklahoma-city-thunder",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000122", {
    leagueId: "nba",
    location: "Orlando",
    name: "Magic",
    abbreviation: "ORL",
    slug: "orlando-magic",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000123", {
    leagueId: "nba",
    location: "Philadelphia",
    name: "76ers",
    abbreviation: "PHI",
    slug: "philadelphia-76ers",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000124", {
    leagueId: "nba",
    location: "Phoenix",
    name: "Suns",
    abbreviation: "PHX",
    slug: "phoenix-suns",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000125", {
    leagueId: "nba",
    location: "Portland",
    name: "Trail Blazers",
    abbreviation: "POR",
    slug: "portland-trail-blazers",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000126", {
    leagueId: "nba",
    location: "Sacramento",
    name: "Kings",
    abbreviation: "SAC",
    slug: "sacramento-kings",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000127", {
    leagueId: "nba",
    location: "San Antonio",
    name: "Spurs",
    abbreviation: "SAS",
    slug: "san-antonio-spurs",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000128", {
    leagueId: "nba",
    location: "Toronto",
    name: "Raptors",
    abbreviation: "TOR",
    slug: "toronto-raptors",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000129", {
    leagueId: "nba",
    location: "Utah",
    name: "Jazz",
    abbreviation: "UTA",
    slug: "utah-jazz",
  }),
  nbaTeam("00000000-0000-4000-8000-000000000130", {
    leagueId: "nba",
    location: "Washington",
    name: "Wizards",
    abbreviation: "WAS",
    slug: "washington-wizards",
  }),
] as const satisfies readonly Subject[];

export const getLogo = (abbr: string) => NBA_LOGOS[abbr] ?? FALLBACK_LOGO;

export const getTeams = (subjects: readonly Subject[]) =>
  subjects.toSorted((a, b) =>
    `${a.details.location} ${a.details.name}`.localeCompare(
      `${b.details.location} ${b.details.name}`,
    ),
  );
