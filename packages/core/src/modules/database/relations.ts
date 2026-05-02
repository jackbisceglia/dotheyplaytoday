import { defineRelations } from "drizzle-orm";

import * as schema from "./schemas.js";

export const relations = defineRelations(
  schema,
  ({ eventsTable, many, one, subscriptionsTable, topicsTable, usersTable }) => ({
    usersTable: {
      subscriptions: many.subscriptionsTable({
        from: usersTable.id,
        to: subscriptionsTable.userId,
      }),
    },
    topicsTable: {
      events: many.eventsTable({
        from: topicsTable.id,
        to: eventsTable.topicId,
      }),
    },
    subscriptionsTable: {
      user: one.usersTable({
        from: subscriptionsTable.userId,
        to: usersTable.id,
      }),
      topic: one.topicsTable({
        from: subscriptionsTable.topicId,
        to: topicsTable.id,
      }),
    },
  }),
);
