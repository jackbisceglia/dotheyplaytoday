import { drizzle } from "drizzle-orm/pg-proxy";
import type { Effect } from "effect";

type RunPromise = <A, E>(effect: Effect.Effect<A, E>) => Promise<A>;
type SqlClient = {
  readonly unsafe: (
    sql: string,
    params?: readonly unknown[],
  ) => {
    readonly raw: Effect.Effect<unknown, unknown>;
    readonly values: Effect.Effect<readonly (readonly unknown[])[], unknown>;
  };
};

/**
 * Gives Better Auth a Promise-based Drizzle facade over the existing Effect
 * PostgreSQL client. This creates no additional client, pool, or lifecycle.
 */
export const makeAuthDatabase = (
  client: SqlClient,
  runPromise: RunPromise,
) =>
  drizzle(async (sql, params, method) => {
    const statement = client.unsafe(sql, params);

    if (method === "all") {
      const rows = await runPromise(statement.values);

      return { rows: rows.map((row) => Array.from(row)) };
    }

    return { rows: [await runPromise(statement.raw)] };
  });
