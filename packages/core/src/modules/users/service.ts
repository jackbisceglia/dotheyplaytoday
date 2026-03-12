import { Effect, Option, Schema } from "effect";
import { randomUUID } from "node:crypto";

import { DatabaseNew } from "../database-new/service.js";
import { User } from "./schema.js";

const UsersCollection = Schema.Array(User);
const decodeUserId = Schema.decodeUnknownSync(User.fields.id);

type UpsertOptions = {
  email: User["email"];
  timezone: User["timezone"];
};

export class Users extends Effect.Service<Users>()("@dtpt/Users", {
  dependencies: [DatabaseNew.Default],
  effect: Effect.gen(function* () {
    const database = yield* DatabaseNew;

    const loadUsers = Effect.fn("Users.loadUsers")(function* () {
      return yield* database
        .getWithSchema({
          query: database.queries.users,
          schema: UsersCollection,
        })
        .pipe(
          Effect.catchTag("DataFileNotFound", () =>
            Effect.succeed([] as User[]),
          ),
        );
    });

    const getByEmail = Effect.fn("Users.getByEmail")(function* (
      email: User["email"],
    ) {
      const users = yield* loadUsers();

      return Option.fromNullable(users.find((user) => user.email === email));
    });

    const upsert = Effect.fn("Users.upsert")(function* (opts: UpsertOptions) {
      const users = yield* loadUsers();
      const existing = users.find((user) => user.email === opts.email);

      const user = User.make({
        id: existing?.id ?? decodeUserId(randomUUID()),
        email: opts.email,
        timezone: opts.timezone,
      });

      const nextUsers =
        existing === undefined
          ? [...users, user]
          : users.map((existingUser) =>
              existingUser.id === existing.id ? user : existingUser,
            );

      yield* database.setWithSchema({
        query: database.queries.users,
        schema: UsersCollection,
        value: nextUsers,
      });

      return user;
    });

    return { getByEmail, upsert };
  }),
}) {}
