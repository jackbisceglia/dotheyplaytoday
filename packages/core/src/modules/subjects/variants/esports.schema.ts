import { Schema } from "effect";

export const EsportsGameIds = ["cod"] as const;

export type EsportsGameId = typeof EsportsGameId.Type;
export const EsportsGameId = Schema.Literals(EsportsGameIds);

export type EsportsTeamSubject = typeof EsportsTeamSubject.Type;
export const EsportsTeamSubject = Schema.TaggedStruct("esports_team", {
  gameId: EsportsGameId,
  display: Schema.NonEmptyString,
  location: Schema.NonEmptyString,
  name: Schema.NonEmptyString,
  abbreviation: Schema.NonEmptyString,
  slug: Schema.optional(Schema.NonEmptyString),
});
