import {
  createTablesIfMissing,
  Database,
  DatabaseWriteError,
  eventsTable,
  participantsTable,
  subjectEventsTable,
  subjectsTable,
  subscriptionsTable,
  usersTable,
} from "@dtpt/core-v2";
import { Effect } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";

export const reset = Effect.fn("DataSeed.reset")(function* () {
  yield* createTablesIfMissing();

  const database = yield* Database;
  const sql = yield* SqlClient;

  yield* sql
    .withTransaction(
      Effect.gen(function* () {
        yield* database.delete(subscriptionsTable);
        yield* database.delete(usersTable);
        yield* database.delete(subjectEventsTable);
        yield* database.delete(participantsTable);
        yield* database.delete(eventsTable);
        yield* database.delete(subjectsTable);
      }),
    )
    .pipe(
      Effect.catchTag("SqlError", (cause) =>
        Effect.fail(
          new DatabaseWriteError({
            operation: "DataSeed.reset",
            cause,
            metadata: { mode: "dev" },
          }),
        ),
      ),
    );
});
