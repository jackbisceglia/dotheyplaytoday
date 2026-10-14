import { getSportConference } from "@dtpt/core/modules/subjects/variants/sport.schema";

import type { SportsSubject } from "./sports/index.js";

// College leagues are browsed by AP Top 25 or conference instead of as one
// grid. Teams arrive filtered to the league and sorted by display name.
export const isCollegeLeague = (leagueId: string | undefined) =>
  leagueId === "ncaam";

export const topRankedGroup = "top-25";

export type CollegeGroup = { readonly id: string; readonly label: string };

export function getCollegeGroups(teams: readonly SportsSubject[]) {
  const conferences = new Map<string, string>();
  for (const team of teams) {
    const conference = getSportConference(
      team.details.leagueId,
      team.details.conferenceId,
    );
    if (conference) conferences.set(conference.id, conference.label);
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
    : teams.filter((team) => team.details.conferenceId === groupId);
