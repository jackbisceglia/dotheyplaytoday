import { Effect } from "effect";

import { DatabaseReadError } from "../database/errors.js";
import { Database } from "../database/service.js";

export class Users extends Effect.Service<Users>()("@dtpt/Users", {
  effect: Effect.gen(function* () {
    const database = yield* Database;

    const getAll = Effect.fn("Users.getAll")(function* () {
      return yield* database.query.usersTable.findMany().pipe(
        Effect.mapError(() =>
          DatabaseReadError.make({
            operation: "Users.getAll",
            message: "Failed to read users",
          }),
        ),
      );
    });

    return { getAll };
  }),
}) {}
