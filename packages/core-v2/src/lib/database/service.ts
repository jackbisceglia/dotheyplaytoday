import * as SqliteClient from "@effect/sql-sqlite-node/SqliteClient";
import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import { Context, Effect, Layer } from "effect";
import { Path } from "effect/Path";
import { SqlClient } from "effect/unstable/sql/SqlClient";

import { DatabaseConfig } from "./config.js";
import { relations } from "./relations.js";
import * as schema from "./schema.js";
import * as Drizzle from "./drizzle/sqlite.js";

const REPOSITORY_ROOT_URL = new URL("../../../../../", import.meta.url);

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

const resolveDatabaseUrl = Effect.fn(function* (databaseUrl: string) {
  if (
    databaseUrl === ":memory:" ||
    databaseUrl.startsWith("file:") ||
    databaseUrl.startsWith("libsql:") ||
    databaseUrl.startsWith("http://") ||
    databaseUrl.startsWith("https://")
  ) {
    return databaseUrl;
  }

  const path = yield* Path;

  if (path.isAbsolute(databaseUrl)) {
    return databaseUrl;
  }

  const repositoryRoot = yield* path.fromFileUrl(REPOSITORY_ROOT_URL);

  return path.join(repositoryRoot, databaseUrl);
});

export const DatabaseLayer = Layer.unwrap(
  Effect.gen(function* () {
    const config = yield* DatabaseConfig;
    const databaseUrl = yield* resolveDatabaseUrl(config.url);

    return createDatabaseLayer(databaseUrl);
  }),
);
