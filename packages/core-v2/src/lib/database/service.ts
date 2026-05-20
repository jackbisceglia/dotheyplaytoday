import * as SqliteClient from "@effect/sql-sqlite-node/SqliteClient";
import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import { Context, Effect, Layer } from "effect";

import { DatabaseConfig } from "./config.js";
import { relations } from "./relations.js";
import * as schema from "./schema.js";
import * as Drizzle from "./sqlite-drizzle.js";

export type Database = SqliteRemoteDatabase<typeof schema, typeof relations>;
export const Database = Context.Service<Database>("@dtpt/core-v2/Database");

export const DatabaseClientLayer = Layer.effect(
  Database,
  Drizzle.make({ schema, relations }).pipe(Effect.map((db) => db as Database)),
);

export const createDatabaseLayer = (path: string) => {
  const SqliteClientLayer = SqliteClient.layer({ filename: path });

  return Layer.provideMerge(DatabaseClientLayer, SqliteClientLayer);
};

export const DatabaseLayer = Layer.unwrap(
  Effect.gen(function* () {
    const config = yield* DatabaseConfig;

    return createDatabaseLayer(config.url);
  }),
);
