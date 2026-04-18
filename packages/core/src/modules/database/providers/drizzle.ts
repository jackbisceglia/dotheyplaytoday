import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";

import { subscriptionsTable } from "../../subscriptions/schema.js";
import { eventsTable, topicsTable } from "../../topics/schema.js";
import { usersTable } from "../../users/schema.js";

const schema = {
  usersTable,
  topicsTable,
  eventsTable,
  subscriptionsTable,
};

export const Database = SqliteDrizzle.make<typeof schema>({ schema });

export const SqliteDrizzleLayer = SqliteDrizzle.layer;
