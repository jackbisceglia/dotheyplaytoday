import { Schema } from "effect";

export type MmaFighterSubject = typeof MmaFighterSubject.Type;
export const MmaFighterSubject = Schema.TaggedStruct("mma_fighter", {
  leagueId: Schema.Literal("ufc"),
  display: Schema.NonEmptyString,
  profileUrl: Schema.NonEmptyString,
});

export type MmaTrackingSubject = typeof MmaTrackingSubject.Type;
export const MmaTrackingSubject = Schema.TaggedStruct("mma_tracking", {
  leagueId: Schema.Literal("ufc"),
  display: Schema.NonEmptyString,
  coverage: Schema.Literals(["numbered", "all"]),
});
