import type { Subject } from "@dtpt/core/modules/subjects/schema";
import type { SportTeamSubject } from "@dtpt/core/modules/subjects/variants/sport.schema";
import { Match } from "effect";

import { getMlbLogo } from "./mlb.js";
import { getNbaLogo } from "./nba.js";
import { getNflLogo } from "./nfl.js";

type League = {
  readonly id: SportTeamSubject["leagueId"];
  readonly label: string;
};

export const leagues = [
  { id: "nba", label: "NBA" },
  { id: "nfl", label: "NFL" },
  { id: "mlb", label: "MLB" },
] as const satisfies readonly League[];

export const getSportsLogo = (details: SportTeamSubject) =>
  Match.value(details.leagueId).pipe(
    Match.when("nba", () => getNbaLogo(details.abbreviation)),
    Match.when("nfl", () => getNflLogo(details.abbreviation)),
    Match.when("mlb", () => getMlbLogo(details.abbreviation)),
    Match.exhaustive,
  );

export const getTeams = (subjects: readonly Subject[]) =>
  subjects.toSorted((a, b) =>
    a.details.display.localeCompare(b.details.display),
  );
