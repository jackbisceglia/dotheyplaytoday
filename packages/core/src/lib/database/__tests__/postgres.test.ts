import { describe, expect, it } from "@effect/vitest";
import { Effect, Redacted } from "effect";
import * as SqlError from "effect/unstable/sql/SqlError";

import { DatabaseTransactionError, mapTransactionError } from "../errors.js";
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

  it.effect("maps typed transaction failures to database errors", () =>
    Effect.gen(function* () {
      const cause = transactionSqlError();
      const error = yield* Effect.fail(cause).pipe(
        mapTransactionError("Test.transaction"),
        Effect.flip,
      );

      expect(error).toBeInstanceOf(DatabaseTransactionError);
      expect(error.cause).toBe(cause);
    }),
  );

  it.effect("maps Effect SQL commit defects to database errors", () =>
    Effect.gen(function* () {
      const cause = transactionSqlError();
      const error = yield* Effect.die(cause).pipe(
        mapTransactionError("Test.transaction"),
        Effect.flip,
      );

      expect(error).toBeInstanceOf(DatabaseTransactionError);
      expect(error.cause).toBe(cause);
    }),
  );
});

const transactionSqlError = () =>
  new SqlError.SqlError({
    reason: new SqlError.ConnectionError({
      cause: new Error("connection unavailable"),
      message: "transaction connection unavailable",
      operation: "acquireConnection",
    }),
  });
