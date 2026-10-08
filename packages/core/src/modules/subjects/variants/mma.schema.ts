import { Schema } from "effect";

export type MmaFighterSubject = typeof MmaFighterSubject.Type;
export const MmaFighterSubject = Schema.TaggedStruct("mma_fighter", {
  leagueId: Schema.Literal("ufc"),
  display: Schema.NonEmptyString,
  profileUrl: Schema.NonEmptyString,
});

export type MmaCoverageSubject = typeof MmaCoverageSubject.Type;
export const MmaCoverageSubject = Schema.TaggedStruct("mma_coverage", {
  leagueId: Schema.Literal("ufc"),
  display: Schema.NonEmptyString,
  coverage: Schema.Literals(["numbered", "all"]),
});
