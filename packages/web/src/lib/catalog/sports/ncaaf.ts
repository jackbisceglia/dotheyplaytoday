import type { SportLeague } from "@dtpt/core/modules/subjects/variants/sport.schema";

type NcaafConferenceId = (typeof SportLeague.cases.ncaaf.Type)["conferenceId"];

export const conferenceLabels = {
  acc: "ACC",
  aac: "American",
  "big-ten": "Big Ten",
  "big-12": "Big 12",
  mac: "MAC",
  "mountain-west": "Mountain West",
  "pac-12": "Pac-12",
  sec: "SEC",
} satisfies Record<NcaafConferenceId, string>;

const fallback = "🏈";

export const getNcaafLogo = (_abbr: string) => fallback;
