import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import { Context, Layer } from "effect";

import { relations } from "./relations.js";
import * as schema from "./schema.js";
import * as Drizzle from "./drizzle/sqlite.js";

export type Database = SqliteRemoteDatabase<typeof schema, typeof relations>;
export const Database = Context.Service<Database>("@dtpt/core/Database");

export const DatabaseLayer = Layer.effect(
  Database,
  Drizzle.make({ schema, relations }),
);
