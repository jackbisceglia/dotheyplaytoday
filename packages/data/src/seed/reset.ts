import { DatabaseWriteError } from "@dtpt/core/lib/database/errors";
import { createTablesIfMissing } from "@dtpt/core/lib/database/schema-setup";
import { Database } from "@dtpt/core/lib/database/service";
import { participantsTable } from "@dtpt/core/modules/events/participants/schema";
import { eventsTable } from "@dtpt/core/modules/events/schema";
import { subjectEventsTable } from "@dtpt/core/modules/subjects/feed/schema";
import { subjectsTable } from "@dtpt/core/modules/subjects/schema";
import { subscriptionsTable } from "@dtpt/core/modules/subscriptions/schema";
import { usersTable } from "@dtpt/core/modules/users/schema";
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
