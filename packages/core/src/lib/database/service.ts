import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import { Context, Effect } from "effect";

import { relations } from "./relations.js";
import * as schema from "./schema.js";
import * as Drizzle from "./drizzle/sqlite.js";

export type Database = SqliteRemoteDatabase<typeof schema, typeof relations>;
export const Database = Context.Service<Database>("@dtpt/core/Database");

/** Creates the typed Drizzle database value shared by runtime-specific layers. */
export const makeDatabaseClientLayer = Effect.fn(function* () {
  return (yield* Drizzle.make({ schema, relations })) as Database;
});
