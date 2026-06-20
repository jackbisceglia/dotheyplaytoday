import type { Subject } from "@dtpt/core-v2/modules/subjects/schema";
import type { SportTeamSubject } from "@dtpt/core-v2/modules/subjects/variants/sport.schema";
import { Match } from "effect";

import { getNbaLogo } from "./nba.js";
import { getNflLogo } from "./nfl.js";
import { getWorldCupLogo } from "./world-cup.js";

type League = {
  readonly id: SportTeamSubject["leagueId"];
  readonly label: string;
};

export const leagues = [
  { id: "nba", label: "NBA" },
  { id: "nfl", label: "NFL" },
  { id: "world-cup", label: "WORLD CUP" },
] as const satisfies readonly League[];

export const getSportsLogo = (details: SportTeamSubject) =>
  Match.value(details.leagueId).pipe(
    Match.when("nba", () => getNbaLogo(details.abbreviation)),
    Match.when("nfl", () => getNflLogo(details.abbreviation)),
    Match.when("world-cup", () => getWorldCupLogo(details.abbreviation)),
    Match.exhaustive,
  );

export const getTeams = (subjects: readonly Subject[]) =>
  subjects.toSorted((a, b) =>
    a.details.display.localeCompare(b.details.display),
  );
