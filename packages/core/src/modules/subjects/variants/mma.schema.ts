import { Effect, Schema } from "effect";

export const MmaLeagueIds = ["ufc"] as const;

export type MmaLeagueId = typeof MmaLeagueId.Type;
export const MmaLeagueId = Schema.Literals(MmaLeagueIds);

const P4pRank = Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 15 }));

export type MmaFighterSubject = typeof MmaFighterSubject.Type;
export const MmaFighterSubject = Schema.TaggedStruct("mma_fighter", {
  leagueId: MmaLeagueId,
  display: Schema.NonEmptyString,
  profileUrl: Schema.optionalKey(Schema.NonEmptyString),
  p4p: P4pRank.pipe(
    Schema.NullOr,
    Schema.withDecodingDefaultKey(Effect.succeed(null)),
  ),
});

export type MmaTrackingSubject = typeof MmaTrackingSubject.Type;
export const MmaTrackingSubject = Schema.TaggedStruct("mma_tracking", {
  leagueId: MmaLeagueId,
  display: Schema.NonEmptyString,
  scope: Schema.Literals(["numbered", "all"]),
});
