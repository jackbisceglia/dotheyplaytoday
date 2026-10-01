import {
  createInsertSchema,
  createSelectSchema,
} from "drizzle-orm/effect-schema";
import { jsonb, primaryKey, text } from "drizzle-orm/pg-core";
import { Schema } from "effect";

import { postgresTable } from "../../lib/database/drizzle/index.js";
import type { Check, TableSchemasMatch } from "../../lib/database/utils.js";
import type { EmailRendered } from "../email/render.js";
import { UserId, usersTable } from "../users/schema.js";

const Rendered = Schema.Struct({
  subject: Schema.String,
  metadata: Schema.optional(Schema.Struct({ unsubscribe: Schema.String })),
  body: Schema.Struct({ text: Schema.String, html: Schema.String }),
});

export const weeklyDigestDeliveriesTable = postgresTable(
  "weekly_digest_deliveries",
  {
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    weekStart: text().notNull(),
    rendered: jsonb().$type<EmailRendered>().notNull(),
    sentAt: text(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.weekStart] })],
);

const overrides = {
  userId: UserId,
  rendered: Rendered,
  sentAt: Schema.NullOr(Schema.DateTimeUtcFromString),
};
export const WeeklyDigestDelivery = createSelectSchema(
  weeklyDigestDeliveriesTable,
  overrides,
);
export type WeeklyDigestDelivery = typeof WeeklyDigestDelivery.Type;
export const WeeklyDigestDeliveryInsert = createInsertSchema(
  weeklyDigestDeliveriesTable,
  { ...overrides, sentAt: Schema.optional(overrides.sentAt) },
);
export type WeeklyDigestDeliverySchemasMatchTable = Check<
  TableSchemasMatch<
    typeof weeklyDigestDeliveriesTable,
    typeof WeeklyDigestDelivery,
    typeof WeeklyDigestDeliveryInsert
  >
>;
