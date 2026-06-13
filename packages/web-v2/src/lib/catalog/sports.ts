import { Match } from "effect";

import type { SportsTeamDetails, Subject } from "../api.js";
import { getNbaLogo, nbaTeams } from "./nba.js";
import { getNflLogo, nflTeams } from "./nfl.js";

type League = {
  readonly id: SportsTeamDetails["leagueId"];
  readonly label: string;
};

export const leagues = [
  { id: "nba", label: "NBA" },
  { id: "nfl", label: "NFL" },
] as const satisfies readonly League[];

export const sportsTeamSubjects = [
  ...nbaTeams,
  ...nflTeams,
] satisfies readonly Subject[];

export const getSportsLogo = (details: SportsTeamDetails) =>
  Match.value(details.leagueId).pipe(
    Match.when("nba", () => getNbaLogo(details.abbreviation)),
    Match.when("nfl", () => getNflLogo(details.abbreviation)),
    Match.exhaustive,
  );

export const getTeams = (subjects: readonly Subject[]) =>
  subjects.toSorted((a, b) =>
    `${a.details.location} ${a.details.name}`.localeCompare(
      `${b.details.location} ${b.details.name}`,
    ),
  );
