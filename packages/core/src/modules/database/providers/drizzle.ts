import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";
import { Effect } from "effect";
import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";

import * as schema from "../schemas.js";
import { relations } from "../relations.js";

// NOTE: currently the type inferred by SqliteDrizzle.make doesn't include relations, so .query doesn't work
// we manually construct so we can type cast the yielded value
type ManuallyConstructedDrizzleDatabaseType = SqliteRemoteDatabase<
  typeof schema,
  typeof relations
>;

export const Database = SqliteDrizzle.make({ schema, relations }).pipe(
  Effect.map((database) => database as ManuallyConstructedDrizzleDatabaseType),
);

export const SqliteDrizzleLayer = SqliteDrizzle.layer;
