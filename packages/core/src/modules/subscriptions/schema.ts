import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { index, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { Schema } from "effect";

import { sqliteTable } from "../../lib/database/drizzle/index.js";
import type {
  Check,
  TableSchemasMatch,
} from "../../lib/database/utils.js";
import { Id } from "../../lib/id/service.js";
import { TaggedUnion } from "../../lib/effect/index.js";
import { SubjectId, subjectsTable } from "../subjects/schema.js";
import { UserId, usersTable } from "../users/schema.js";
import { FixedSchedule as FixedScheduleSchema } from "./schedules/fixed.schema.js";

export { FixedSchedule } from "./schedules/fixed.schema.js";

export type SubscriptionSchemasMatchTable = Check<
  TableSchemasMatch<
    typeof subscriptionsTable,
    typeof Subscription,
    typeof SubscriptionInsert
  >
>;

export type SubscriptionId = typeof SubscriptionId.Type;
export const SubscriptionId = Id.SchemaBranded("SubscriptionId");

export type Schedule = typeof Schedule.Type;
export const Schedule = TaggedUnion([FixedScheduleSchema]);

const selectOverrides = {
  id: SubscriptionId,
  userId: UserId,
  subjectId: SubjectId,
  schedule: Schedule,
  lastSentAt: Schema.NullOr(Schema.DateTimeUtcFromString),
};

const insertOverrides = {
  ...selectOverrides,
  lastSentAt: Schema.optional(Schema.NullOr(Schema.DateTimeUtcFromString)),
};

export const subscriptionsTable = sqliteTable(
  "subscriptions",
  {
    id: text().primaryKey(),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    subjectId: text()
      .notNull()
      .references(() => subjectsTable.id, { onDelete: "cascade" }),
    schedule: text({ mode: "json" })
      .notNull()
      .$type<Schema.Codec.Encoded<typeof Schedule>>(),
    lastSentAt: text(),
  },
  (table) => [
    index("subscriptions_user_id_idx").on(table.userId),
    index("subscriptions_subject_id_idx").on(table.subjectId),
    uniqueIndex("subscriptions_user_subject_idx").on(
      table.userId,
      table.subjectId,
    ),
  ],
);

export type Subscription = typeof Subscription.Type;
export const Subscription = createSelectSchema(
  subscriptionsTable,
  selectOverrides,
);

export type SubscriptionInsert = typeof SubscriptionInsert.Type;
export const SubscriptionInsert = createInsertSchema(
  subscriptionsTable,
  insertOverrides,
);
