import { DateTime, Schema } from "effect";

export type MmaVenue = typeof MmaVenue.Type;
export const MmaVenue = Schema.Struct({
  title: Schema.NonEmptyString,
  location: Schema.NonEmptyString,
});

const hasOrderedTimings = Schema.makeFilter(
  (timings: {
    readonly early: DateTime.Utc;
    readonly prelims: DateTime.Utc;
    readonly main: DateTime.Utc;
  }) =>
    (DateTime.isLessThanOrEqualTo(timings.early, timings.prelims) &&
      DateTime.isLessThanOrEqualTo(timings.prelims, timings.main)) ||
    "Broadcast timings must be ordered early, prelims, main",
);

export type MmaEvent = typeof MmaEvent.Type;
export const MmaEvent = Schema.TaggedStruct("mma_card", {
  leagueId: Schema.Literal("ufc"),
  title: Schema.NonEmptyString,
  category: Schema.Literals(["numbered", "fight_night"]),
  venue: MmaVenue,
  timings: Schema.Struct({
    early: Schema.DateTimeUtcFromString,
    prelims: Schema.DateTimeUtcFromString,
    main: Schema.DateTimeUtcFromString,
  }).check(hasOrderedTimings),
});
