import {
  Database,
  DatabaseWriteError,
  mapTransactionError,
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

    yield* database
      .transaction(() =>
        Effect.gen(function* () {
          yield* database.delete(subscriptionsTable);
          yield* database.delete(usersTable);
          yield* database.delete(subjectEventsTable);
          yield* database.delete(participantsTable);
          yield* database.delete(eventsTable);
          yield* database.delete(subjectsTable);
        }),
      )
      .pipe(mapTransactionError("DataSeed.reset", { mode: "dev" }));
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
