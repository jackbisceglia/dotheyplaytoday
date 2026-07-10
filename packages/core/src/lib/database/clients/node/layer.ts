import * as SqliteNodeClient from "@effect/sql-sqlite-node/SqliteClient";
import { Effect, Layer } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";

import { DatabaseConnection } from "../../config.js";
import { Database, makeDatabaseClientLayer } from "../../service.js";

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
 * Default configured Node SQLite database layer.
 */
export const DatabaseLayer = Layer.unwrap(
  Effect.gen(function* () {
    const connection = yield* DatabaseConnection;

    return createNodeDatabaseLayer(connection);
  }),
);
