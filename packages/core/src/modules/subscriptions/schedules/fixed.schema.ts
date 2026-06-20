import { Duration, Schema } from "effect";

export type FixedSchedule = typeof FixedSchedule.Type;
export const FixedSchedule = Schema.TaggedStruct("fixed_local_time", {
  sendAtSecondsLocal: Schema.Int.check(
    Schema.isBetween({
      minimum: 0,
      maximum: Duration.toSeconds("24 hours") - 1,
    }),
    Schema.isMultipleOf(Duration.toSeconds("15 minutes")),
  ),
});
