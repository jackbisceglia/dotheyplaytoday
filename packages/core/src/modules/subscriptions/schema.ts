import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { Schema as S } from "effect";

import { Schedule } from "./schedules/schema.js";
import { Topic, TopicId, topicsTable } from "../topics/schema.js";
import { User, UserId, usersTable } from "../users/schema.js";
export {
  FixedSchedule,
  RelativeSchedule,
  Schedule,
} from "./schedules/schema.js";

export const subscriptionsTable = sqliteTable("subscriptions", {
  id: text("id").primaryKey().$type<SubscriptionId>(),
  userId: text("user_id")
    .notNull()
    .$type<UserId>()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  topicId: text("topic_id")
    .notNull()
    .$type<TopicId>()
    .references(() => topicsTable.id, { onDelete: "cascade" }),
  schedule: text("schedule_json", { mode: "json" }).notNull().$type<Schedule>(),
  enabled: integer("enabled", { mode: "boolean" }).notNull(),
  lastSentAt: integer("last_sent_at", { mode: "timestamp" }),
});

export type SubscriptionId = typeof SubscriptionId.Type;
export const SubscriptionId = S.UUID.pipe(S.brand("SubscriptionId"));

const rowRefinements = {
  id: SubscriptionId,
  userId: User.fields.id,
  topicId: Topic.fields.id,
  schedule: Schedule,
  lastSentAt: S.NullOr(S.DateTimeUtcFromDate),
};

export type Subscription = S.Schema.Type<typeof Subscription>;
export const Subscription = createSelectSchema(
  subscriptionsTable,
  rowRefinements,
);

export type SubscriptionInsert = S.Schema.Type<typeof SubscriptionInsert>;
export const SubscriptionInsert = createInsertSchema(
  subscriptionsTable,
  rowRefinements,
);
