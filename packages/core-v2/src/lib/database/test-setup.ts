import { SqlClient } from "effect/unstable/sql/SqlClient";
import { Effect } from "effect";

import { createDatabaseLayer } from "./service.js";

export const layerTest = createDatabaseLayer(":memory:");

export const createTables = Effect.gen(function* () {
  const sql = yield* SqlClient;

  yield* sql`
    CREATE TABLE users (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL,
      timezone TEXT NOT NULL,
      unsubscribe_token TEXT NOT NULL
    )
  `;

  yield* sql`
    CREATE UNIQUE INDEX users_email_idx
    ON users (email)
  `;

  yield* sql`
    CREATE UNIQUE INDEX users_unsubscribe_token_idx
    ON users (unsubscribe_token)
  `;
});
