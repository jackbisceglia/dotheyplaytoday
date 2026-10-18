import type { Subject } from "../subjects/schema.js";

/** Keep the initial weekly scope explicit as the daily catalog grows. */
export const supportsWeeklyDigest = (subject: Subject): boolean =>
  subject._tag === "sports_team" &&
  subject.details._tag === "sports_team" &&
  ["nba", "nfl", "mlb", "nhl"].includes(subject.details.league.id);
