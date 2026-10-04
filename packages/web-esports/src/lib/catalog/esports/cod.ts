const fallback = "🎮";

const logos = {
  BOS: "🧨",
  CAR: "🐦‍⬛",
  LAT: "💯",
  MIA: "🌴",
  MIN: "⚔️",
  NY: "☁️",
  PAR: "🎩",
  RYD: "🦅",
  TOR: "🎏",
  TX: "🧱",
  VAN: "🌊",
  VGS: "🎲",
};

export const getCodLogo = (abbr: string) =>
  abbr in logos ? logos[abbr as keyof typeof logos] : fallback;
