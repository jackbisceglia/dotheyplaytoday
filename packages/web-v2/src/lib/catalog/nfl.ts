import { SubjectId, type Subject } from "@dtpt/core-v2/modules/subjects/schema";
import { SportTeamSubject } from "@dtpt/core-v2/modules/subjects/variants/sport.schema";

const fallback = "🏈";

const logos = {
  ARI: "🌵",
  ATL: "🔴",
  BAL: "🟣",
  BUF: "❄️",
  CAR: "🔵",
  CHI: "🐻",
  CIN: "🐅",
  CLE: "🟤",
  DAL: "⭐",
  DEN: "⛰️",
  DET: "🦁",
  GB: "🧀",
  HOU: "🚀",
  IND: "🏇",
  JAX: "🐆",
  KC: "🏹",
  LAC: "⚡",
  LAR: "🐏",
  LV: "☠️",
  MIA: "🌊",
  MIN: "🛡️",
  NE: "🇺🇸",
  NO: "⚜️",
  NYG: "🏙️",
  NYJ: "✈️",
  PHI: "🦅",
  PIT: "⚙️",
  SEA: "🌲",
  SF: "🌉",
  TB: "🏴‍☠️",
  TEN: "⚔️",
  WSH: "🏛️",
};

const makeNflTeam = (
  serial: number,
  input: Omit<Parameters<typeof SportTeamSubject.make>[0], "leagueId">,
): Subject => {
  const id = SubjectId.make(
    `00000000-0000-4000-8000-${String(serial + 200).padStart(12, "0")}`,
  );
  const details = SportTeamSubject.make({ ...input, leagueId: "nfl" });

  return {
    id,
    _tag: details._tag,
    details,
  };
};

export const nflTeams = [
  makeNflTeam(1, {
    location: "Arizona",
    name: "Cardinals",
    abbreviation: "ARI",
    slug: "arizona-cardinals",
  }),
  makeNflTeam(2, {
    location: "Atlanta",
    name: "Falcons",
    abbreviation: "ATL",
    slug: "atlanta-falcons",
  }),
  makeNflTeam(3, {
    location: "Baltimore",
    name: "Ravens",
    abbreviation: "BAL",
    slug: "baltimore-ravens",
  }),
  makeNflTeam(4, {
    location: "Buffalo",
    name: "Bills",
    abbreviation: "BUF",
    slug: "buffalo-bills",
  }),
  makeNflTeam(5, {
    location: "Carolina",
    name: "Panthers",
    abbreviation: "CAR",
    slug: "carolina-panthers",
  }),
  makeNflTeam(6, {
    location: "Chicago",
    name: "Bears",
    abbreviation: "CHI",
    slug: "chicago-bears",
  }),
  makeNflTeam(7, {
    location: "Cincinnati",
    name: "Bengals",
    abbreviation: "CIN",
    slug: "cincinnati-bengals",
  }),
  makeNflTeam(8, {
    location: "Cleveland",
    name: "Browns",
    abbreviation: "CLE",
    slug: "cleveland-browns",
  }),
  makeNflTeam(9, {
    location: "Dallas",
    name: "Cowboys",
    abbreviation: "DAL",
    slug: "dallas-cowboys",
  }),
  makeNflTeam(10, {
    location: "Denver",
    name: "Broncos",
    abbreviation: "DEN",
    slug: "denver-broncos",
  }),
  makeNflTeam(11, {
    location: "Detroit",
    name: "Lions",
    abbreviation: "DET",
    slug: "detroit-lions",
  }),
  makeNflTeam(12, {
    location: "Green Bay",
    name: "Packers",
    abbreviation: "GB",
    slug: "green-bay-packers",
  }),
  makeNflTeam(13, {
    location: "Houston",
    name: "Texans",
    abbreviation: "HOU",
    slug: "houston-texans",
  }),
  makeNflTeam(14, {
    location: "Indianapolis",
    name: "Colts",
    abbreviation: "IND",
    slug: "indianapolis-colts",
  }),
  makeNflTeam(15, {
    location: "Jacksonville",
    name: "Jaguars",
    abbreviation: "JAX",
    slug: "jacksonville-jaguars",
  }),
  makeNflTeam(16, {
    location: "Kansas City",
    name: "Chiefs",
    abbreviation: "KC",
    slug: "kansas-city-chiefs",
  }),
  makeNflTeam(17, {
    location: "Las Vegas",
    name: "Raiders",
    abbreviation: "LV",
    slug: "las-vegas-raiders",
  }),
  makeNflTeam(18, {
    location: "Los Angeles",
    name: "Chargers",
    abbreviation: "LAC",
    slug: "los-angeles-chargers",
  }),
  makeNflTeam(19, {
    location: "Los Angeles",
    name: "Rams",
    abbreviation: "LAR",
    slug: "los-angeles-rams",
  }),
  makeNflTeam(20, {
    location: "Miami",
    name: "Dolphins",
    abbreviation: "MIA",
    slug: "miami-dolphins",
  }),
  makeNflTeam(21, {
    location: "Minnesota",
    name: "Vikings",
    abbreviation: "MIN",
    slug: "minnesota-vikings",
  }),
  makeNflTeam(22, {
    location: "New England",
    name: "Patriots",
    abbreviation: "NE",
    slug: "new-england-patriots",
  }),
  makeNflTeam(23, {
    location: "New Orleans",
    name: "Saints",
    abbreviation: "NO",
    slug: "new-orleans-saints",
  }),
  makeNflTeam(24, {
    location: "New York",
    name: "Giants",
    abbreviation: "NYG",
    slug: "new-york-giants",
  }),
  makeNflTeam(25, {
    location: "New York",
    name: "Jets",
    abbreviation: "NYJ",
    slug: "new-york-jets",
  }),
  makeNflTeam(26, {
    location: "Philadelphia",
    name: "Eagles",
    abbreviation: "PHI",
    slug: "philadelphia-eagles",
  }),
  makeNflTeam(27, {
    location: "Pittsburgh",
    name: "Steelers",
    abbreviation: "PIT",
    slug: "pittsburgh-steelers",
  }),
  makeNflTeam(28, {
    location: "San Francisco",
    name: "49ers",
    abbreviation: "SF",
    slug: "san-francisco-49ers",
  }),
  makeNflTeam(29, {
    location: "Seattle",
    name: "Seahawks",
    abbreviation: "SEA",
    slug: "seattle-seahawks",
  }),
  makeNflTeam(30, {
    location: "Tampa Bay",
    name: "Buccaneers",
    abbreviation: "TB",
    slug: "tampa-bay-buccaneers",
  }),
  makeNflTeam(31, {
    location: "Tennessee",
    name: "Titans",
    abbreviation: "TEN",
    slug: "tennessee-titans",
  }),
  makeNflTeam(32, {
    location: "Washington",
    name: "Commanders",
    abbreviation: "WSH",
    slug: "washington-commanders",
  }),
] satisfies readonly Subject[];

export const getNflLogo = (abbr: string) =>
  abbr in logos ? logos[abbr as keyof typeof logos] : fallback;
