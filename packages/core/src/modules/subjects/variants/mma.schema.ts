import { Schema } from "effect";

export const MmaLeagueIds = ["ufc"] as const;

export type MmaLeagueId = typeof MmaLeagueId.Type;
export const MmaLeagueId = Schema.Literals(MmaLeagueIds);

export type MmaFighterSubject = typeof MmaFighterSubject.Type;
export const MmaFighterSubject = Schema.TaggedStruct("mma_fighter", {
  leagueId: MmaLeagueId,
  display: Schema.NonEmptyString,
  profileUrl: Schema.NonEmptyString,
});

export type MmaTrackingSubject = typeof MmaTrackingSubject.Type;
export const MmaTrackingSubject = Schema.TaggedStruct("mma_tracking", {
  leagueId: MmaLeagueId,
  display: Schema.NonEmptyString,
  scope: Schema.Literals(["numbered", "all"]),
});
