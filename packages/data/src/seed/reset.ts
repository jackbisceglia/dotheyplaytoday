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
} from "@dtpt/core";
import { Effect } from "effect";

export const reset = Effect.fn("DataSeed.reset")(
  function* () {
    yield* createTablesIfMissing();

    const database = yield* Database;

    // TODO(database): restore atomic reset with D1 batch support.
    yield* database.delete(subscriptionsTable);
    yield* database.delete(usersTable);
    yield* database.delete(subjectEventsTable);
    yield* database.delete(participantsTable);
    yield* database.delete(eventsTable);
    yield* database.delete(subjectsTable);
  },
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
