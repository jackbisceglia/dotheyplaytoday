import * as PgClient from "@effect/sql-pg/PgClient";
import { Effect } from "effect";
import * as SqlClient from "effect/unstable/sql/SqlClient";
import type { Connection } from "effect/unstable/sql/SqlConnection";

// Exercise real SQL compilation and transactions with a controlled driver.
export const makeTestPgClient = (connection: Connection) =>
  Effect.gen(function* () {
    const sql = yield* SqlClient.make({
      acquirer: Effect.succeed(connection),
      transactionAcquirer: Effect.succeed(connection),
      compiler: PgClient.makeCompiler(),
      spanAttributes: [],
    });
    return PgClient.PgClient.of(
      Object.assign(sql, {
        [PgClient.TypeId]: PgClient.TypeId,
        config: {},
        json: () => {
          throw new Error("Unexpected JSON helper");
        },
        listen: () => Effect.die("Unexpected LISTEN"),
        notify: () => Effect.die("Unexpected NOTIFY"),
      }),
    );
  });
