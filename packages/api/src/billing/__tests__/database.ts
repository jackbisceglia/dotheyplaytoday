import { makeTestPgClient } from "@dtpt/core/lib/database/__tests__/fixtures";
import type { PGlite } from "@electric-sql/pglite";
import * as PgClient from "@effect/sql-pg/PgClient";
import * as Drizzle from "drizzle-orm/effect-postgres";
import { Effect, Layer, Stream } from "effect";
import { Reactivity } from "effect/unstable/reactivity";
import type { Connection } from "effect/unstable/sql/SqlConnection";
import { SqlError, UnknownError } from "effect/unstable/sql/SqlError";
import { relations } from "@dtpt/core/lib/database/definitions/relations";
import { Database } from "@dtpt/core/lib/database/service";

export const makeDatabaseLayer = (database: PGlite) => {
  const query = (sql: string, params: readonly unknown[]) =>
    Effect.tryPromise({
      try: () => database.query<Record<string, unknown>>(sql, [...params]),
      catch: (cause) => new SqlError({ reason: new UnknownError({ cause }) }),
    });
  const execute: Connection["execute"] = (sql, params, transform) =>
    query(sql, params).pipe(
      Effect.map((result) =>
        transform ? transform(result.rows) : result.rows,
      ),
    );
  const values: Connection["executeValues"] = (sql, params) =>
    query(sql, params).pipe(
      Effect.map((result) =>
        result.rows.map((row) => result.fields.map((field) => row[field.name])),
      ),
    );
  const connection: Connection = {
    execute,
    executeUnprepared: execute,
    executeValues: values,
    executeValuesUnprepared: values,
    executeRaw: query,
    executeStream: () => Stream.die("No streams in this test"),
  };
  const databaseLayer = Layer.effect(
    Database,
    Effect.gen(function* () {
      const client = yield* makeTestPgClient(connection);
      return yield* Drizzle.makeWithDefaults({ relations }).pipe(
        Effect.provideService(PgClient.PgClient, client),
      );
    }).pipe(Effect.provide(Reactivity.layer)),
  );
  return databaseLayer;
};
