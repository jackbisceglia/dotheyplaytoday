import {
  boolean,
  index,
  integer,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { postgresTable } from "../../lib/database/drizzle/index.js";
import { usersTable } from "../users/schema.js";

// App-owned Stripe snapshots and checkout attempts. Team subscriptions are separate.
export const billingSubscriptionsTable = postgresTable(
  "billing_subscriptions",
  {
    id: text().primaryKey(),
    plan: text().notNull(),
    userId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),
    stripeCustomerId: text(),
    stripeSubscriptionId: text(),
    status: text().default("incomplete").notNull(),
    periodStart: timestamp({ withTimezone: true, mode: "date" }),
    periodEnd: timestamp({ withTimezone: true, mode: "date" }),
    cancelAtPeriodEnd: boolean().default(false),
    priceId: text(),
    checkoutSessionId: text(),
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    revision: integer().default(0).notNull(),
  },
  (table) => [
    index("billing_subscriptions_user_id_idx").on(table.userId),
    uniqueIndex("billing_subscriptions_stripe_subscription_id_idx").on(
      table.stripeSubscriptionId,
    ),
    uniqueIndex("billing_subscriptions_pending_checkout_idx")
      .on(table.userId)
      .where(
        sql`${table.status} = 'incomplete' AND ${table.stripeSubscriptionId} IS NULL`,
      ),
  ],
);
