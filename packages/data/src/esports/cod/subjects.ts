import type { EsportsSeedEncoded } from "../../schema/esports.js";
import { getTeamFeedIds } from "./events.js";

type CodEsportsSubjectSeed = EsportsSeedEncoded["subjects"][number];

// The twelve franchises for the 2027 season. M80 bought the Boston Breach
// spot on 2026-08-26.
export const Teams = {
  CarolinaRoyalRavens: {
    id: "00000000-0000-4000-8000-000000000901",
    _tag: "esports_team",
    details: {
      _tag: "esports_team",
      gameId: "cod",
      location: "Carolina",
      name: "Royal Ravens",
      display: "Carolina Royal Ravens",
      abbreviation: "CAR",
      slug: "carolina-royal-ravens",
    },
    feedIds: getTeamFeedIds("Carolina Royal Ravens"),
  },
  Cloud9NewYork: {
    id: "00000000-0000-4000-8000-000000000902",
    _tag: "esports_team",
    details: {
      _tag: "esports_team",
      gameId: "cod",
      location: "New York",
      name: "Cloud9",
      display: "Cloud9 New York",
      abbreviation: "NY",
      slug: "cloud9-new-york",
    },
    feedIds: getTeamFeedIds("Cloud9 New York"),
  },
  FaZeVegas: {
    id: "00000000-0000-4000-8000-000000000903",
    _tag: "esports_team",
    details: {
      _tag: "esports_team",
      gameId: "cod",
      location: "Vegas",
      name: "FaZe",
      display: "FaZe Vegas",
      abbreviation: "VGS",
      slug: "faze-vegas",
    },
    feedIds: getTeamFeedIds("FaZe Vegas"),
  },
  G2Minnesota: {
    id: "00000000-0000-4000-8000-000000000904",
    _tag: "esports_team",
    details: {
      _tag: "esports_team",
      gameId: "cod",
      location: "Minnesota",
      name: "G2",
      display: "G2 Minnesota",
      abbreviation: "MIN",
      slug: "g2-minnesota",
    },
    feedIds: getTeamFeedIds("G2 Minnesota"),
  },
  LosAngelesThieves: {
    id: "00000000-0000-4000-8000-000000000905",
    _tag: "esports_team",
    details: {
      _tag: "esports_team",
      gameId: "cod",
      location: "Los Angeles",
      name: "Thieves",
      display: "Los Angeles Thieves",
      abbreviation: "LAT",
      slug: "los-angeles-thieves",
    },
    feedIds: getTeamFeedIds("Los Angeles Thieves"),
  },
  M80Boston: {
    id: "00000000-0000-4000-8000-000000000906",
    _tag: "esports_team",
    details: {
      _tag: "esports_team",
      gameId: "cod",
      location: "Boston",
      name: "M80",
      display: "M80 Boston",
      abbreviation: "BOS",
      slug: "m80-boston",
    },
    feedIds: getTeamFeedIds("M80 Boston"),
  },
  MiamiHeretics: {
    id: "00000000-0000-4000-8000-000000000907",
    _tag: "esports_team",
    details: {
      _tag: "esports_team",
      gameId: "cod",
      location: "Miami",
      name: "Heretics",
      display: "Miami Heretics",
      abbreviation: "MIA",
      slug: "miami-heretics",
    },
    feedIds: getTeamFeedIds("Miami Heretics"),
  },
  OpTicTexas: {
    id: "00000000-0000-4000-8000-000000000908",
    _tag: "esports_team",
    details: {
      _tag: "esports_team",
      gameId: "cod",
      location: "Texas",
      name: "OpTic",
      display: "OpTic Texas",
      abbreviation: "TX",
      slug: "optic-texas",
    },
    feedIds: getTeamFeedIds("OpTic Texas"),
  },
  ParisGentleMates: {
    id: "00000000-0000-4000-8000-000000000909",
    _tag: "esports_team",
    details: {
      _tag: "esports_team",
      gameId: "cod",
      location: "Paris",
      name: "Gentle Mates",
      display: "Paris Gentle Mates",
      abbreviation: "PAR",
      slug: "paris-gentle-mates",
    },
    feedIds: getTeamFeedIds("Paris Gentle Mates"),
  },
  RiyadhFalcons: {
    id: "00000000-0000-4000-8000-000000000910",
    _tag: "esports_team",
    details: {
      _tag: "esports_team",
      gameId: "cod",
      location: "Riyadh",
      name: "Falcons",
      display: "Riyadh Falcons",
      abbreviation: "RYD",
      slug: "riyadh-falcons",
    },
    feedIds: getTeamFeedIds("Riyadh Falcons"),
  },
  TorontoKOI: {
    id: "00000000-0000-4000-8000-000000000911",
    _tag: "esports_team",
    details: {
      _tag: "esports_team",
      gameId: "cod",
      location: "Toronto",
      name: "KOI",
      display: "Toronto KOI",
      abbreviation: "TOR",
      slug: "toronto-koi",
    },
    feedIds: getTeamFeedIds("Toronto KOI"),
  },
  VancouverSurge: {
    id: "00000000-0000-4000-8000-000000000912",
    _tag: "esports_team",
    details: {
      _tag: "esports_team",
      gameId: "cod",
      location: "Vancouver",
      name: "Surge",
      display: "Vancouver Surge",
      abbreviation: "VAN",
      slug: "vancouver-surge",
    },
    feedIds: getTeamFeedIds("Vancouver Surge"),
  },
} as const satisfies Record<string, CodEsportsSubjectSeed>;

export const subjects = Object.values(Teams);
