import * as SqliteClient from "@effect/sql-sqlite-node/SqliteClient";
import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import { Context, Effect, Layer } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";

import { DatabaseConfig } from "./config.js";
import { relations } from "./relations.js";
import * as schema from "./schema.js";
import * as Drizzle from "./drizzle/sqlite.js";

export type Database = SqliteRemoteDatabase<typeof schema, typeof relations>;
export const Database = Context.Service<Database>("@dtpt/core-v2/Database");

export const DatabaseClientLayer = Layer.effect(
  Database,
  Effect.gen(function* () {
    const sql = yield* SqlClient;

    yield* sql`PRAGMA foreign_keys = ON`;

    return (yield* Drizzle.make({ schema, relations })) as Database;
  }),
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
