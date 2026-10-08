const fallback = "🏀";

const logos = new Map(
  Object.entries({
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
  }),
);

export const getNbaLogo = (abbr: string) => logos.get(abbr) ?? fallback;
