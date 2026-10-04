const fallback = "🏒";

const logos = {
  ANA: "🦆",
  BOS: "🐻",
  BUF: "⚔️",
  CGY: "🔥",
  CAR: "🌀",
  CHI: "🪶",
  COL: "🏔️",
  CBJ: "🧨",
  DAL: "⭐",
  DET: "🔴",
  EDM: "🛢️",
  FLA: "🐆",
  LA: "👑",
  MIN: "🌲",
  MTL: "🇨🇦",
  NSH: "🎸",
  NJ: "😈",
  NYI: "🏝️",
  NYR: "🗽",
  OTT: "🏛️",
  PHI: "🧡",
  PIT: "🐧",
  SJ: "🦈",
  SEA: "🐙",
  STL: "🎺",
  TB: "⚡",
  TOR: "🍁",
  UTAH: "🦣",
  VAN: "🐋",
  VGK: "🛡️",
  WSH: "🦅",
  WPG: "✈️",
};

export const getNhlLogo = (abbr: string) =>
  abbr in logos ? logos[abbr as keyof typeof logos] : fallback;
