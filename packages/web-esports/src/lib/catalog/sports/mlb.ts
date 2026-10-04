const fallback = "⚾";

const logos = {
  ATH: "🐘",
  ATL: "🪓",
  AZ: "🐍",
  BAL: "🐦",
  BOS: "🧦",
  CHC: "🐻",
  CIN: "🔴",
  CLE: "🛡️",
  COL: "🏔️",
  CWS: "🧦",
  DET: "🐅",
  HOU: "🚀",
  KC: "👑",
  LAA: "😇",
  LAD: "💙",
  MIA: "🐟",
  MIL: "🍺",
  MIN: "🌲",
  NYM: "🗽",
  NYY: "🎩",
  PHI: "🔔",
  PIT: "☠️",
  SD: "⛪",
  SEA: "🔱",
  SF: "🌉",
  STL: "🐦",
  TB: "🌊",
  TEX: "🤠",
  TOR: "🐦",
  WSH: "🏛️",
};

export const getMlbLogo = (abbr: string) =>
  abbr in logos ? logos[abbr as keyof typeof logos] : fallback;
