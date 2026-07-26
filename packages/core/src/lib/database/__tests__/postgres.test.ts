import { describe, expect, it } from "@effect/vitest";
import { Effect, Redacted } from "effect";

import { createDatabaseLayer, Database } from "../service.js";

describe("PostgreSQL database adapter", () => {
  it.effect("provides Drizzle without opening a module-scoped connection", () =>
    Effect.gen(function* () {
      const database = yield* Database;

      expect(typeof database.select).toBe("function");
      expect(typeof database.query.usersTable.findFirst).toBe("function");
      expect(typeof database.transaction).toBe("function");
    }).pipe(
      Effect.provide(
        createDatabaseLayer(
          Effect.succeed(
            Redacted.make(
              "postgresql://deferred:deferred@example.invalid:5432/deferred",
            ),
          ),
        ),
      ),
    ),
  );
});
