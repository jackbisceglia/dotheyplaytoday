import { SqliteClient } from "@effect/sql-sqlite-node";
import { Effect, Layer } from "effect";

import { DatabaseUrl } from "./config.js";
import { Database, SqliteDrizzleLayer } from "./providers/drizzle.js";

const createSqliteClientLayer = Effect.fn(function* (path?: string) {
  const url = yield* DatabaseUrl;

  return SqliteClient.layer({ filename: path ?? url });
});

export const createDatabaseLayer = Effect.fnUntraced(function* (path?: string) {
  const sqliteClientLayer = yield* createSqliteClientLayer(path);

  return Layer.provideMerge(SqliteDrizzleLayer, sqliteClientLayer);
}, Layer.unwrapEffect);

export const DatabaseLayer = createDatabaseLayer();

export { Database };
