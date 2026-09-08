import { eq } from "drizzle-orm";
import { Array, Cause, Context, Effect, Layer, Option, Schema } from "effect";
import { isSqlError } from "effect/unstable/sql/SqlError";

import {
  DatabaseDeleteError,
  DatabaseReadError,
  DatabaseWriteError,
  mapToReadError,
} from "../../lib/database/errors.js";
import { Database } from "../../lib/database/service.js";
import { Id } from "../../lib/id/service.js";
import { User, UserInsert, usersTable } from "./schema.js";

export class UserAlreadyExists extends Schema.TaggedErrorClass<UserAlreadyExists>()(
  "UserAlreadyExists",
  {},
) {}

export class UserNotFound extends Schema.TaggedErrorClass<UserNotFound>()(
  "UserNotFound",
  {
    key: Schema.Literals(["id", "email", "unsubscribeToken"]),
    value: Schema.String,
  },
) {}

export class Users extends Context.Service<
  Users,
  {
    readonly get: (
      userId: User["id"],
    ) => Effect.Effect<
      User,
      UserNotFound | DatabaseReadError | Schema.SchemaError
    >;
    readonly getByEmail: (
      email: User["email"],
    ) => Effect.Effect<
      User,
      UserNotFound | DatabaseReadError | Schema.SchemaError
    >;
    readonly getByUnsubscribeToken: (
      token: User["unsubscribeToken"],
    ) => Effect.Effect<
      User,
      UserNotFound | DatabaseReadError | Schema.SchemaError
    >;
    readonly listByIds: (
      userIds: readonly User["id"][],
    ) => Effect.Effect<readonly User[], DatabaseReadError | Schema.SchemaError>;
    readonly create: (
      email: User["email"],
      timezone: User["timezone"],
    ) => Effect.Effect<
      User,
      UserAlreadyExists | DatabaseWriteError | Schema.SchemaError
    >;
    readonly remove: (
      userId: User["id"],
    ) => Effect.Effect<void, DatabaseDeleteError>;
  }
>()("@dtpt/core/Users") {}

const decodeUser = Schema.decodeUnknownEffect(User);
const decodeUsers = Schema.decodeUnknownEffect(Schema.Array(User));
const encodeUser = Schema.encodeEffect(UserInsert);

export const UsersLayer = Layer.effect(
  Users,
  Effect.gen(function* () {
    const database = yield* Database;
    const id = yield* Id;

    const get: Users["Service"]["get"] = Effect.fn("Users.get")(function* (
      userId: User["id"],
    ) {
      const row = yield* database.query.usersTable
        .findFirst({
          where: { id: userId },
        })
        .pipe(mapToReadError("Users.get", { userId }));

      if (!row) {
        return yield* new UserNotFound({ key: "id", value: userId });
      }

      const user = yield* decodeUser(row);

      return user;
    });

    const getByEmail: Users["Service"]["getByEmail"] = Effect.fn(
      "Users.getByEmail",
    )(function* (email: User["email"]) {
      const row = yield* database.query.usersTable
        .findFirst({
          where: { email },
        })
        .pipe(mapToReadError("Users.getByEmail", { lookup: "email" }));

      if (!row) {
        return yield* new UserNotFound({ key: "email", value: email });
      }

      const user = yield* decodeUser(row);

      return user;
    });

    const getByUnsubscribeToken: Users["Service"]["getByUnsubscribeToken"] =
      Effect.fn("Users.getByUnsubscribeToken")(function* (
        token: User["unsubscribeToken"],
      ) {
        const row = yield* database.query.usersTable
          .findFirst({
            where: { unsubscribeToken: token },
          })
          .pipe(
            mapToReadError("Users.getByUnsubscribeToken", {
              lookup: "unsubscribeToken",
            }),
          );

        if (!row) {
          return yield* new UserNotFound({
            key: "unsubscribeToken",
            value: token,
          });
        }

        const user = yield* decodeUser(row);

        return user;
      });

    const listByIds: Users["Service"]["listByIds"] = Effect.fn(
      "Users.listByIds",
    )(function* (userIds: readonly User["id"][]) {
      if (Array.isReadonlyArrayEmpty(userIds)) {
        return [];
      }

      const rows = yield* database.query.usersTable
        .findMany({
          where: { id: { in: Array.fromIterable(userIds) } },
          orderBy: { id: "asc" },
        })
        .pipe(mapToReadError("Users.listByIds", { userIds }));

      const users = yield* decodeUsers(rows);

      return users;
    });

    const create: Users["Service"]["create"] = Effect.fn("Users.create")(
      function* (email: User["email"], timezone: User["timezone"]) {
        const candidateId = yield* id.makeFromBrandedSchema(User.fields.id);
        const insertable = yield* encodeUser({
          id: candidateId,
          unsubscribeToken: yield* id.makeFromBrandedSchema(
            User.fields.unsubscribeToken,
          ),
          email,
          timezone,
          emailVerified: false,
          name: null,
        });

        const rows = yield* database
          .insert(usersTable)
          .values(insertable)
          .returning()
          .pipe(
            Effect.mapError((error) => {
              if (Cause.isCause(error.cause)) {
                const failure = Option.getOrUndefined(
                  Cause.findErrorOption(error.cause),
                );
                if (
                  isSqlError(failure) &&
                  failure.reason._tag === "UniqueViolation" &&
                  failure.reason.constraint === "users_email_idx"
                ) {
                  return new UserAlreadyExists({});
                }
              }

              return new DatabaseWriteError({
                operation: "Users.create",
                cause: error,
              });
            }),
          );

        const row = Array.head(rows);

        if (Option.isNone(row)) {
          return yield* new DatabaseWriteError({ operation: "Users.create" });
        }

        return yield* decodeUser(row.value);
      },
    );

    const remove: Users["Service"]["remove"] = Effect.fn("Users.remove")(
      function* (userId: User["id"]) {
        yield* database
          .delete(usersTable)
          .where(eq(usersTable.id, userId))
          .pipe(
            Effect.mapError(
              (cause) =>
                new DatabaseDeleteError({
                  operation: "Users.remove",
                  cause,
                  metadata: { userId },
                }),
            ),
          );
      },
    );

    return Users.of({
      get,
      getByEmail,
      getByUnsubscribeToken,
      listByIds,
      create,
      remove,
    });
  }),
);
