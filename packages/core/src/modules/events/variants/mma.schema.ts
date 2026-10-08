import { DateTime, Schema } from "effect";

import { SubjectId } from "../../subjects/schema.js";

export type MmaBout = typeof MmaBout.Type;
export const MmaBout = Schema.Struct({
  placement: Schema.Literals(["early", "prelims", "main"]),
  fighters: Schema.Array(
    Schema.Struct({
      subjectId: SubjectId,
      title: Schema.NonEmptyString,
    }),
  ).check(Schema.isLengthBetween(1, 2)),
});

export type MmaVenue = typeof MmaVenue.Type;
export const MmaVenue = Schema.Struct({
  title: Schema.NonEmptyString,
  location: Schema.NonEmptyString,
});

export type MmaEvent = typeof MmaEvent.Type;
export const MmaEvent = Schema.TaggedStruct("mma_card", {
  leagueId: Schema.Literal("ufc"),
  title: Schema.NonEmptyString,
  kind: Schema.Literals(["numbered", "fight_night"]),
  venue: MmaVenue,
  timings: Schema.Struct({
    early: Schema.DateTimeUtcFromString,
    prelims: Schema.DateTimeUtcFromString,
    main: Schema.DateTimeUtcFromString,
  }).check(
    Schema.makeFilter(function hasOrderedTimings(timings) {
      return (
        (DateTime.isLessThanOrEqualTo(timings.early, timings.prelims) &&
          DateTime.isLessThanOrEqualTo(timings.prelims, timings.main)) ||
        "Broadcast timings must be ordered early, prelims, main"
      );
    }),
  ),
  bouts: Schema.Array(MmaBout),
});
