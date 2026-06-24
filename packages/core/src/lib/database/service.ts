import { D1Client } from "@effect/sql-d1";
import * as SqliteClient from "@effect/sql-sqlite-node/SqliteClient";
import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import { Context, Effect, Layer } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";

import { DatabaseConnection } from "./config.js";
import { relations } from "./relations.js";
import * as schema from "./schema.js";
import * as Drizzle from "./drizzle/sqlite.js";

export type Database = SqliteRemoteDatabase<typeof schema, typeof relations>;
export const Database = Context.Service<Database>("@dtpt/core/Database");

export const DatabaseClientLayer = Layer.effect(
  Database,
  Effect.gen(function* () {
    const sql = yield* SqlClient;

    yield* sql`PRAGMA foreign_keys = ON`;

    return (yield* Drizzle.make({ schema, relations })) as Database;
  }),
);

export const createDatabaseLayer = (connection: string) => {
  const SqliteClientLayer = SqliteClient.layer({ filename: connection });

  return Layer.provideMerge(DatabaseClientLayer, SqliteClientLayer);
};

export const createD1DatabaseLayer = (
  db: D1Client.D1ClientConfig["db"],
  config?: Omit<D1Client.D1ClientConfig, "db">,
) => Layer.provideMerge(DatabaseClientLayer, D1Client.layer({ db, ...config }));

export const DatabaseLayer = Layer.unwrap(
  Effect.gen(function* () {
    const connection = yield* DatabaseConnection;

    return createDatabaseLayer(connection);
  }),
);
