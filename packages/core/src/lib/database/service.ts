import { D1Client } from "@effect/sql-d1";
import * as SqliteNodeClient from "@effect/sql-sqlite-node/SqliteClient";
import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import { Context, Effect, Layer } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";

import { DatabaseConnection } from "./config.js";
import { relations } from "./relations.js";
import * as schema from "./schema.js";
import * as Drizzle from "./drizzle/sqlite.js";

export type Database = SqliteRemoteDatabase<typeof schema, typeof relations>;
export const Database = Context.Service<Database>("@dtpt/core/Database");

/** Creates the typed Drizzle database value shared by runtime-specific layers. */
const makeDatabaseClientLayer = Effect.fn(function* () {
  return (yield* Drizzle.make({ schema, relations })) as Database;
});

/**
 * Creates the Node SQLite database layer for local, test, and server runtimes.
 * Foreign-key enforcement is enabled on the Node SQLite connection before the
 * Drizzle database service is provided.
 */
export const createNodeDatabaseLayer = (connection: string) => {
  const SqliteClientLayer = SqliteNodeClient.layer({ filename: connection });

  const DatabaseClientLayer = Layer.effect(
    Database,
    Effect.gen(function* () {
      const sql = yield* SqlClient;

      yield* sql`PRAGMA foreign_keys = ON`;

      return yield* makeDatabaseClientLayer();
    }),
  );

  return Layer.provideMerge(DatabaseClientLayer, SqliteClientLayer);
};

/**
 * Creates a Cloudflare D1-backed database layer from a Worker D1 binding.
 */
export const createD1DatabaseLayer = (
  db: D1Client.D1ClientConfig["db"],
  config?: Omit<D1Client.D1ClientConfig, "db">,
) => {
  const D1ClientLayer = D1Client.layer({ db, ...config });
  const DatabaseClientLayer = Layer.effect(Database, makeDatabaseClientLayer());

  return Layer.provideMerge(DatabaseClientLayer, D1ClientLayer);
};

/**
 * Default configured Node SQLite database layer.
 */
export const DatabaseLayer = Layer.unwrap(
  Effect.gen(function* () {
    const connection = yield* DatabaseConnection;

    return createNodeDatabaseLayer(connection);
  }),
);
