import { Schema } from "effect";

export const SportLeagueIds = ["nba", "nfl", "world-cup"] as const;

export type SportLeagueId = typeof SportLeagueId.Type;
export const SportLeagueId = Schema.Literals(SportLeagueIds);

export type SportTeamSubject = typeof SportTeamSubject.Type;
export const SportTeamSubject = Schema.TaggedStruct("sports_team", {
  leagueId: SportLeagueId,
  display: Schema.NonEmptyString,
  location: Schema.NonEmptyString,
  name: Schema.NonEmptyString,
  abbreviation: Schema.NonEmptyString,
  slug: Schema.optional(Schema.NonEmptyString),
});
