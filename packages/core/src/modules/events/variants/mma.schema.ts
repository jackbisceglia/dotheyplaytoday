import { Schema } from "effect";

import { SubjectId } from "../../subjects/schema.js";

export const MmaDate = Schema.String.check(
  Schema.makeFilter((value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return (
      !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
    );
  }),
);

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
  date: Schema.NullOr(MmaDate),
  venue: Schema.NullOr(Schema.NonEmptyString),
  earlyPrelimsAt: Schema.NullOr(Schema.DateTimeUtcFromString),
  prelimsAt: Schema.NullOr(Schema.DateTimeUtcFromString),
  mainCardAt: Schema.NullOr(Schema.DateTimeUtcFromString),
  bouts: Schema.Array(MmaBout),
});
