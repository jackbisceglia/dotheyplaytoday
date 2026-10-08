import { Schema } from "effect";

import { SubjectId } from "../../subjects/schema.js";

export type MmaBout = typeof MmaBout.Type;
export const MmaBout = Schema.Struct({
  id: Schema.NonEmptyString,
  status: Schema.Literals(["scheduled", "cancelled"]),
  segment: Schema.Literals(["early_prelims", "prelims", "main", "unknown"]),
  fighters: Schema.Array(
    Schema.Struct({
      subjectId: SubjectId,
      title: Schema.NonEmptyString,
    }),
  ).check(Schema.isLengthBetween(1, 2)),
});

export type MmaCard = typeof MmaCard.Type;
export const MmaCard = Schema.TaggedStruct("mma_card", {
  leagueId: Schema.Literal("ufc"),
  title: Schema.NonEmptyString,
  sourceUrl: Schema.NonEmptyString,
  reviewedAt: Schema.DateTimeUtcFromString,
  kind: Schema.Literals(["numbered", "fight_night"]),
  venue: Schema.NullOr(Schema.NonEmptyString),
  timings: Schema.Struct({
    earlyPrelims: Schema.optionalKey(Schema.DateTimeUtcFromString),
    prelims: Schema.optionalKey(Schema.DateTimeUtcFromString),
    mainCard: Schema.DateTimeUtcFromString,
  }),
  bouts: Schema.Array(MmaBout),
});
