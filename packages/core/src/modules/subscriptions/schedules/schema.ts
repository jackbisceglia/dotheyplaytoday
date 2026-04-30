import { Schema as S } from "effect";

export type FixedSchedule = S.Schema.Type<typeof FixedSchedule>;
export const FixedSchedule = S.TaggedStruct("fixed", {
  sendAtSecondsLocal: S.Int.pipe(S.between(0, 86399), S.multipleOf(300)),
});

export type RelativeSchedule = S.Schema.Type<typeof RelativeSchedule>;
export const RelativeSchedule = S.TaggedStruct("relative", {
  timeOffsetSeconds: S.Int.pipe(S.lessThanOrEqualTo(0)),
});

export type Schedule = S.Schema.Type<typeof Schedule>;
export const Schedule = S.Union(FixedSchedule, RelativeSchedule);
