import {
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
    const database = yield* Database;

    // TODO(database): restore atomic reset with an interactive PostgreSQL
    // transaction after the database cutover is stable.
    yield* database.delete(subscriptionsTable);
    yield* database.delete(usersTable);
    yield* database.delete(subjectEventsTable);
    yield* database.delete(participantsTable);
    yield* database.delete(eventsTable);
    yield* database.delete(subjectsTable);
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
