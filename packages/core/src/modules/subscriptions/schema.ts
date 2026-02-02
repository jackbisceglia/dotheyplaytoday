import { Schema } from "effect";

import { Topic } from "../topics/schema";
import { User } from "../users/schema";

export type FixedSchedule = Schema.Schema.Type<typeof FixedSchedule>;
export const FixedSchedule = Schema.Struct({
  type: Schema.Literal("fixed"),
  sendAtSecondsLocal: Schema.Int.pipe(
    Schema.between(0, 86399),
    Schema.multipleOf(900),
  ),
});

export type RelativeSchedule = Schema.Schema.Type<typeof RelativeSchedule>;
export const RelativeSchedule = Schema.Struct({
  type: Schema.Literal("relative"),
  timeOffsetSeconds: Schema.Int.pipe(Schema.lessThanOrEqualTo(0)),
});

export type Schedule = Schema.Schema.Type<typeof Schedule>;
export const Schedule = Schema.Union(FixedSchedule, RelativeSchedule);

export type Subscription = Schema.Schema.Type<typeof Subscription>;
export const Subscription = Schema.Struct({
  id: Schema.UUID.pipe(Schema.brand("SubscriptionId")),
  userId: User.fields.id,
  topicId: Topic.fields.id,
  schedule: Schedule,
  enabled: Schema.Boolean,
  lastSentAt: Schema.NullOr(Schema.DateTimeUtc),
});
