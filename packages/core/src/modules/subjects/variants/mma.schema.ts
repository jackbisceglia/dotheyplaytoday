import { Effect, Schema } from "effect";

export const MmaLeagueIds = ["ufc"] as const;

export type MmaLeagueId = typeof MmaLeagueId.Type;
export const MmaLeagueId = Schema.Literals(MmaLeagueIds);

const MmaLeague = Schema.Struct({ id: MmaLeagueId });

const P4pRank = Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 15 }));

export type MmaFighterSubject = typeof MmaFighterSubject.Type;
export const MmaFighterSubject = Schema.TaggedStruct("mma_fighter", {
  league: MmaLeague,
  display: Schema.NonEmptyString,
  profileUrl: Schema.optionalKey(Schema.NonEmptyString),
  p4p: P4pRank.pipe(
    Schema.NullOr,
    Schema.withDecodingDefaultKey(Effect.succeed(null)),
  ),
});

export type MmaTrackingSubject = typeof MmaTrackingSubject.Type;
export const MmaTrackingSubject = Schema.TaggedStruct("mma_tracking", {
  league: MmaLeague,
  display: Schema.NonEmptyString,
  scope: Schema.Literals(["numbered", "all"]),
});
