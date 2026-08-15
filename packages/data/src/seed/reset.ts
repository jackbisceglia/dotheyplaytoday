import {
  Database,
  DatabaseWriteError,
  eventsTable,
  participantsTable,
  subjectEventsTable,
  subjectsTable,
  subscriptionsTable,
  usersTable,
  withTransaction,
} from "@dtpt/core";
import { Effect } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";

export const reset = Effect.fn("DataSeed.reset")(
  function* () {
    const database = yield* Database;
    const sql = yield* SqlClient;

    const transaction = withTransaction(sql);

    yield* transaction(
      "DataSeed.reset",
      { mode: "dev" },
      Effect.gen(function* () {
        yield* database.delete(subscriptionsTable);
        yield* database.delete(usersTable);
        yield* database.delete(subjectEventsTable);
        yield* database.delete(participantsTable);
        yield* database.delete(eventsTable);
        yield* database.delete(subjectsTable);
      }),
    );
  },
  Effect.catchTag("EffectDrizzleQueryError", (cause) =>
    Effect.fail(
      new DatabaseWriteError({
        operation: "DataSeed.reset",
        cause,
        metadata: { mode: "dev" },
      }),
    ),
  ),
);
