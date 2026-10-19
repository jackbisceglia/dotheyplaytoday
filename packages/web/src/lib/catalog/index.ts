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
    Match.tag("mma_fighter", (fighter) => {
      const [firstName, ...remainingNames] = fighter.display.split(" ");
      if (!firstName || remainingNames.length === 0) return fighter.display;
      return `${firstName.charAt(0)}. ${remainingNames.join(" ")}`;
    }),
    Match.tag("mma_tracking", (tracking) =>
      Match.value(tracking.scope).pipe(
        Match.when("numbered", () => "PPVs"),
        Match.when("all", () => "All Cards"),
        Match.exhaustive,
      ),
    ),
    Match.exhaustive,
  );
