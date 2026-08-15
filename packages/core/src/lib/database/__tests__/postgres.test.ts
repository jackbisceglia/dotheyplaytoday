import { describe, expect, it } from "@effect/vitest";
import { Cause, Effect, Exit, Redacted } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";
import * as SqlError from "effect/unstable/sql/SqlError";

import {
  DatabaseTransactionError,
  mapTransactionError,
  withTransaction,
} from "../errors.js";
import { createDatabaseLayer, Database } from "../service.js";

describe("PostgreSQL database adapter", () => {
  it.effect("provides Drizzle without opening a module-scoped connection", () =>
    Effect.gen(function* () {
      const database = yield* Database;
      const sql = yield* SqlClient;

      expect(typeof database.select).toBe("function");
      expect(typeof database.query.usersTable.findFirst).toBe("function");
      expect(typeof database.transaction).toBe("function");
      expect(typeof sql.withTransaction).toBe("function");
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

  it.effect("runs and maps transactions through the provided SqlClient", () =>
    Effect.gen(function* () {
      const sql = yield* SqlClient;
      const transaction = withTransaction(sql);

      const error = yield* transaction("Test.transaction", Effect.void).pipe(
        Effect.flip,
      );

      expect(error).toBeInstanceOf(DatabaseTransactionError);
      expect(error.operation).toBe("Test.transaction");
    }).pipe(
      Effect.provide(
        createDatabaseLayer(
          Effect.succeed(
            Redacted.make("postgresql://test:test@127.0.0.1:1/test"),
          ),
        ),
      ),
    ),
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

  it.effect("preserves non-SQL typed transaction failures", () =>
    Effect.gen(function* () {
      const cause = new Error("application failure");
      const error = yield* Effect.fail(cause).pipe(
        mapTransactionError("Test.transaction"),
        Effect.flip,
      );

      expect(error).toBe(cause);
    }),
  );

  it.effect("preserves non-SQL transaction defects", () =>
    Effect.gen(function* () {
      const cause = new Error("application defect");
      const exit = yield* Effect.die(cause).pipe(
        mapTransactionError("Test.transaction"),
        Effect.exit,
      );

      expect(Exit.isFailure(exit)).toBe(true);
      if (Exit.isFailure(exit)) {
        expect(Cause.squash(exit.cause)).toBe(cause);
      }
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
