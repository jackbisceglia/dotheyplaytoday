import * as SqliteClient from "@effect/sql-sqlite-node/SqliteClient";
import { Effect, Layer } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";

import { DatabaseConnection } from "./config.js";
import { DatabaseLayer as DrizzleDatabaseLayer } from "./service.js";

const SqliteForeignKeysLayer = Layer.effectDiscard(
  Effect.gen(function* () {
    const sql = yield* SqlClient;

    yield* sql`PRAGMA foreign_keys = ON`;
  }),
);

export const createNodeDatabaseLayer = (connection: string) => {
  const SqliteClientLayer = SqliteClient.layer({ filename: connection });
  const DatabaseSqliteLayer = Layer.mergeAll(
    DrizzleDatabaseLayer,
    SqliteForeignKeysLayer,
  );

  return Layer.provideMerge(DatabaseSqliteLayer, SqliteClientLayer);
};

export const createDatabaseLayer = createNodeDatabaseLayer;

export const DatabaseLayer = Layer.unwrap(
  Effect.gen(function* () {
    const connection = yield* DatabaseConnection;

    return createNodeDatabaseLayer(connection);
  }),
);
