import { SportLeague } from "@dtpt/core/modules/subjects/variants/sport.schema";

import type { SportsSubject } from "./sports/index.js";

type CollegeLeague = typeof SportLeague.cases.ncaam.Type;
type CollegeTeam = SportsSubject & {
  readonly details: { readonly league: CollegeLeague };
};

// College leagues are browsed by AP Top 25 or conference instead of as one
// grid. Teams arrive filtered to the league and sorted by display name.
export const isCollegeTeam = (team: SportsSubject): team is CollegeTeam =>
  SportLeague.guards.ncaam(team.details.league);

// [SLOP: TO FIX] Group selection mixes "top-25" and conference IDs as plain
// strings, losing the schema-derived conference type. Use tagged top25/conference
// variants and preserve typed conference IDs through groups and selection.
export const topRankedGroup = "top-25";

export type CollegeGroup = { readonly id: string; readonly label: string };

export function getCollegeGroups(
  teams: readonly CollegeTeam[],
  labels: Readonly<Record<CollegeLeague["conferenceId"], string>>,
) {
  const conferences = new Map<string, string>();
  for (const team of teams) {
    const id = team.details.league.conferenceId;
    conferences.set(id, labels[id]);
  }

  return {
    ranked: teams.some((team) => team.details.league.apRank !== null),
    conferences: [...conferences]
      .map(([id, label]): CollegeGroup => ({ id, label }))
      .toSorted((a, b) => a.label.localeCompare(b.label)),
  };
}

export const getCollegeTeams = (
  teams: readonly CollegeTeam[],
  groupId: string,
) =>
  groupId === topRankedGroup
    ? teams
        .flatMap((team) => {
          const league = team.details.league;
          return league.apRank !== null ? [{ team, rank: league.apRank }] : [];
        })
        .toSorted((a, b) => a.rank - b.rank)
        .map(({ team }) => team)
    : teams.filter((team) => team.details.league.conferenceId === groupId);
