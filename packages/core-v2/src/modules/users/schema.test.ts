import { describe, expect, it } from "@effect/vitest";
import { Effect, Schema } from "effect";

import { createTables, layerTest } from "../../lib/database/test-setup.js";
import { Database } from "../../lib/database/service.js";
import {
  User,
  UserInsert,
  usersTable,
} from "./schema.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;

const userInput = {
  id: "00000000-0000-4000-8000-000000000101",
  email: "test@example.com",
  timezone: "America/New_York",
  unsubscribeToken: "00000000-0000-4000-8000-000000000201",
};

describe("v2 User model", () => {
  it("rejects malformed user-owned fields", () => {
    expect(() => decode(User)({ ...userInput, email: "not-email" })).toThrow();
    expect(() =>
      decode(User)({ ...userInput, unsubscribeToken: "short" }),
    ).toThrow();
  });

  it("encodes and decodes the user row boundary", () => {
    const user = decode(User)(userInput);
    const insert = encode(UserInsert)(user);
    const selected = decode(User)(insert);

    expect(insert).toEqual(userInput);
    expect(selected.email).toBe(user.email);
    expect(selected.unsubscribeToken).toBe(user.unsubscribeToken);
  });

  it.effect("roundtrips through SQLite using the database layer", () =>
    Effect.gen(function* () {
      yield* createTables;

      const database = yield* Database;
      const insert = encode(UserInsert)(decode(User)(userInput));

      yield* database.insert(usersTable).values(insert);

      const rows = yield* database.select().from(usersTable);
      const decodedRows = decode(Schema.Array(User))(rows);

      expect(decodedRows).toHaveLength(1);
      expect(decodedRows[0]?.email).toBe(userInput.email);
      expect(decodedRows[0]?.unsubscribeToken).toBe(
        userInput.unsubscribeToken,
      );
    }).pipe(Effect.provide(layerTest)),
  );
});
