import type { SportLeague } from "@dtpt/core/modules/subjects/variants/sport.schema";

type NcaamConferenceId = (typeof SportLeague.cases.ncaam.Type)["conferenceId"];

export const conferenceLabels = {
  acc: "ACC",
  aac: "American",
  a10: "Atlantic 10",
  "big-east": "Big East",
  "big-ten": "Big Ten",
  "big-12": "Big 12",
  mac: "MAC",
  mvc: "Missouri Valley",
  "mountain-west": "Mountain West",
  "pac-12": "Pac-12",
  sec: "SEC",
  wcc: "WCC",
} satisfies Record<NcaamConferenceId, string>;

const fallback = "🏀";

export const getNcaamLogo = (_abbr: string) => fallback;
