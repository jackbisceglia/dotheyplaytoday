import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";

import { eventsTable } from "../../events/schema.js";
import { subscriptionsTable } from "../../subscriptions/schema.js";
import { topicsTable } from "../../topics/schema.js";
import { usersTable } from "../../users/schema.js";

const schema = {
  usersTable,
  topicsTable,
  eventsTable,
  subscriptionsTable,
};

export const Database = SqliteDrizzle.make<typeof schema>({ schema });

export const SqliteDrizzleLayer = SqliteDrizzle.layer;
