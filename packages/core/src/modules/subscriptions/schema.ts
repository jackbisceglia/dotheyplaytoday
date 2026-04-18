import { sql } from "drizzle-orm";
import { check, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Schema } from "effect";

import { Topic, topicsTable } from "../topics/schema.js";
import { User, usersTable } from "../users/schema.js";

export type FixedSchedule = Schema.Schema.Type<typeof FixedSchedule>;
export const FixedSchedule = Schema.Struct({
  type: Schema.Literal("fixed"),
  sendAtSecondsLocal: Schema.Int.pipe(
    Schema.between(0, 86399),
    Schema.multipleOf(300),
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

export const subscriptionsTable = sqliteTable(
  "subscriptions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    topicId: text("topic_id")
      .notNull()
      .references(() => topicsTable.id, { onDelete: "cascade" }),
    scheduleType: text("schedule_type", {
      enum: ["fixed", "relative"],
    }).notNull(),
    sendAtSecondsLocal: integer("send_at_seconds_local"),
    timeOffsetSeconds: integer("time_offset_seconds"),
    enabled: integer("enabled").notNull(),
    lastSentAt: text("last_sent_at"),
  },
  (table) => {
    const fixedScheduleCheck = sql`(${table.scheduleType} = 'fixed' AND ${table.sendAtSecondsLocal} IS NOT NULL AND ${table.timeOffsetSeconds} IS NULL)`;
    const relativeScheduleCheck = sql`(${table.scheduleType} = 'relative' AND ${table.timeOffsetSeconds} IS NOT NULL AND ${table.sendAtSecondsLocal} IS NULL)`;

    return [
      check(
        "subscriptions_schedule_shape_check",
        sql`(${fixedScheduleCheck} OR ${relativeScheduleCheck})`,
      ),
    ];
  },
);
