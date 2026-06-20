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

export const getNflLogo = (abbr: string) =>
  abbr in logos ? logos[abbr as keyof typeof logos] : fallback;
