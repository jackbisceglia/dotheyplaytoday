import { DateTime, Schema } from "effect";

import { MmaLeagueId } from "../../subjects/variants/mma.schema.js";

export type MmaVenue = typeof MmaVenue.Type;
export const MmaVenue = Schema.Struct({
  title: Schema.NonEmptyString,
  location: Schema.NonEmptyString,
});

const hasOrderedTimings = Schema.makeFilter(
  (timings: { readonly prelims: DateTime.Utc; readonly main: DateTime.Utc }) =>
    DateTime.isLessThanOrEqualTo(timings.prelims, timings.main) ||
    "Broadcast timings must be ordered prelims, main",
);

export type MmaEvent = typeof MmaEvent.Type;
export const MmaEvent = Schema.TaggedStruct("mma_card", {
  leagueId: MmaLeagueId,
  title: Schema.NonEmptyString,
  category: Schema.Literals(["numbered", "fight_night"]),
  venue: MmaVenue,
  timings: Schema.Struct({
    prelims: Schema.DateTimeUtcFromString,
    main: Schema.DateTimeUtcFromString,
  }).check(hasOrderedTimings),
});
