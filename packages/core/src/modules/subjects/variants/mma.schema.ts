import { Effect, Schema } from "effect";

export const MmaLeagueIds = ["ufc"] as const;

export type MmaLeagueId = typeof MmaLeagueId.Type;
export const MmaLeagueId = Schema.Literals(MmaLeagueIds);

export type MmaFighterSubject = typeof MmaFighterSubject.Type;
export const MmaFighterSubject = Schema.TaggedStruct("mma_fighter", {
  leagueId: MmaLeagueId,
  display: Schema.NonEmptyString,
  profileUrl: Schema.optionalKey(Schema.NonEmptyString),
  // Men's UFC pound-for-pound rank; older stored fighter details omit it.
  p4p: Schema.NullOr(
    Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 15 })),
  ).pipe(Schema.withDecodingDefaultKey(Effect.succeed(null))),
});

export type MmaTrackingSubject = typeof MmaTrackingSubject.Type;
export const MmaTrackingSubject = Schema.TaggedStruct("mma_tracking", {
  leagueId: MmaLeagueId,
  display: Schema.NonEmptyString,
  scope: Schema.Literals(["numbered", "all"]),
});
