// Deferred until the SQLite roundtrip is migrated to the remote PostgreSQL
// test strategy. The schema-only coverage remains in schema.test.ts.
import { describe, expect, it } from "@effect/vitest";
import { eq } from "drizzle-orm";
import { Effect, Schema } from "effect";

import { Database } from "../../../lib/database/service.js";
import {
  createTables,
  layerTest,
} from "../../../lib/database/__tests__/setup.sqlite.js";
import { User, UserInsert, usersTable } from "../schema.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;

const userInput = {
  id: "00000000-0000-4000-8000-000000000101",
  email: "test@example.com",
  timezone: "America/New_York",
  unsubscribeToken: "00000000-0000-4000-8000-000000000201",
};

describe("User persistence", () => {
  it.effect("roundtrips through SQLite using the database layer", () =>
    Effect.gen(function* () {
      yield* createTables;

      const database = yield* Database;
      const insert = encode(UserInsert)(decode(User)(userInput));

      yield* database.insert(usersTable).values(insert);

      const rows = yield* database.select().from(usersTable);
      const decodedRows = decode(Schema.Array(User))(rows);
      const selectedRows = yield* database
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, insert.id))
        .limit(1);
      const row = selectedRows[0];
      const decodedRow = decode(User)(row);
      const missingRows = yield* database
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, "00000000-0000-4000-8000-000000009999"))
        .limit(1);
      const missingRow = missingRows[0];

      expect(decodedRows).toHaveLength(1);
      expect(decodedRows[0]?.email).toBe(userInput.email);
      expect(decodedRows[0]?.unsubscribeToken).toBe(userInput.unsubscribeToken);
      expect(decodedRow.email).toBe(userInput.email);
      expect(decodedRow.unsubscribeToken).toBe(userInput.unsubscribeToken);
      expect(missingRow).toBeUndefined();
    }).pipe(Effect.provide(layerTest)),
  );
});
