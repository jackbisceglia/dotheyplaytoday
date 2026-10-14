import type { SportTeamSubject } from "@dtpt/core/modules/subjects/variants/sport.schema";

import type { SportsSubject } from "./sports/index.js";

type CollegeConferenceId = Extract<
  SportTeamSubject["league"],
  { id: "ncaam" }
>["conferenceId"];

const conferenceLabels = {
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
} satisfies Record<CollegeConferenceId, string>;

// College leagues are browsed by AP Top 25 or conference instead of as one
// grid. Teams arrive filtered to the league and sorted by display name.
export const isCollegeLeague = (leagueId: string | undefined) =>
  leagueId === "ncaam";

export const topRankedGroup = "top-25";

export type CollegeGroup = { readonly id: string; readonly label: string };

export function getCollegeGroups(teams: readonly SportsSubject[]) {
  const conferences = new Map<string, string>();
  for (const team of teams) {
    if (team.details.league.id === "ncaam") {
      const id = team.details.league.conferenceId;
      conferences.set(id, conferenceLabels[id]);
    }
  }

  return {
    ranked: teams.some((team) => team.details.apRank !== undefined),
    conferences: [...conferences]
      .map(([id, label]): CollegeGroup => ({ id, label }))
      .toSorted((a, b) => a.label.localeCompare(b.label)),
  };
}

export const getCollegeTeams = (
  teams: readonly SportsSubject[],
  groupId: string,
) =>
  groupId === topRankedGroup
    ? teams
        .filter((team) => team.details.apRank !== undefined)
        .toSorted(
          (a, b) =>
            (a.details.apRank ?? Infinity) - (b.details.apRank ?? Infinity),
        )
    : teams.filter((team) => team.details.league.conferenceId === groupId);
