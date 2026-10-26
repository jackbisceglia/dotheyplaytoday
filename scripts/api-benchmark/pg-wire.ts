import * as Actual from "../../packages/core/node_modules/@effect/sql-pg/dist/PgClient.js";
import { makeTestPgClient } from "../../packages/core/src/lib/database/__tests__/fixtures.ts";
import { Effect, Stream } from "effect";
import { Pool } from "./pg.ts";
export * from "../../packages/core/node_modules/@effect/sql-pg/dist/PgClient.js";
export const layer = () =>
  Actual.layerFrom(
    Effect.gen(function* () {
      const pool = yield* Effect.acquireRelease(
        Effect.sync(() => new Pool()),
        (pool) => Effect.promise(() => pool.end()),
      );
      const query = (sql, params) =>
        Effect.promise(
          async () => (await pool.query({ text: sql }, params)).rows,
        );
      return yield* makeTestPgClient({
        execute: query,
        executeValues: query,
        executeValuesUnprepared: query,
        executeUnprepared: query,
        executeRaw: query,
        executeStream: () => Stream.die("Unexpected benchmark stream"),
      });
    }),
  );
