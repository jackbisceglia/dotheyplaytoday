import type { SubjectDetails } from "@dtpt/core/modules/subjects/schema";
import { Match } from "effect";

import { getSportsLogo, leagues as sportsLeagues } from "./sports/index.js";

export const leagues = [...sportsLeagues, { id: "ufc", label: "UFC" }] as const;

export const getSubjectLogo = (details: SubjectDetails) =>
  Match.value(details).pipe(
    Match.tag("sports_team", getSportsLogo),
    Match.tag("mma_fighter", "mma_tracking", () => "🥊"),
    Match.exhaustive,
  );

export const getSubjectAbbreviation = (details: SubjectDetails) =>
  Match.value(details).pipe(
    Match.tag("sports_team", (team) => team.abbreviation),
    Match.tag("mma_fighter", "mma_tracking", (subject) => subject.display),
    Match.exhaustive,
  );
