import { describe, expect, it } from "@effect/vitest";
import { eq } from "drizzle-orm";
import { Effect, Layer, Schema } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";

import {
  DatabaseDeleteError,
  DatabaseReadError,
  DatabaseWriteError,
} from "../../../lib/database/errors.js";
import { Database } from "../../../lib/database/service.js";
import { createTables, layerTest } from "../../../lib/database/__tests__/setup.js";
import {
  EmailAddress,
  User,
  UserId,
  UserInsert,
  usersTable,
} from "../schema.js";
import { UserNotFound, Users, UsersLayer } from "../service.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;

const layerUsersTest = UsersLayer.pipe(Layer.provideMerge(layerTest));

const userInput = {
  id: "00000000-0000-4000-8000-000000000101",
  email: "test@example.com",
  timezone: "America/New_York",
  unsubscribeToken: "00000000-0000-4000-8000-000000000201",
};

const userId = UserId.make(userInput.id);
const email = EmailAddress.make(userInput.email);
const unsubscribeToken = decode(User)(userInput).unsubscribeToken;
const newYorkTimezone = decode(User)(userInput).timezone;
const chicagoTimezone = decode(User)({
  ...userInput,
  timezone: "America/Chicago",
}).timezone;

const seedUser = Effect.gen(function* () {
  const database = yield* Database;
  const insert = encode(UserInsert)(decode(User)(userInput));

  yield* database.insert(usersTable).values(insert);
});

describe("v2 Users service", () => {
  it.effect(
    "reads users by primary id, email, unsubscribe token, and ids",
    () =>
      Effect.gen(function* () {
        yield* createTables;
        yield* seedUser;

        const users = yield* Users;

        const byId = yield* users.get(userId);
        const byEmail = yield* users.getByEmail(email);
        const byToken = yield* users.getByUnsubscribeToken(
          byId.unsubscribeToken,
        );
        const byIds = yield* users.listByIds([userId]);
        const emptyByIds = yield* users.listByIds([]);

        expect(encode(User)(byId)).toEqual(userInput);
        expect(byEmail.id).toBe(byId.id);
        expect(byToken.id).toBe(byId.id);
        expect(byIds.map((user) => user.id)).toEqual([userId]);
        expect(emptyByIds).toEqual([]);
      }).pipe(Effect.provide(layerUsersTest)),
  );

  it.effect(
    "fails primary reads with UserNotFound when the row is missing",
    () =>
      Effect.gen(function* () {
        yield* createTables;

        const users = yield* Users;
        const error = yield* users.get(userId).pipe(Effect.flip);

        expect(error).toBeInstanceOf(UserNotFound);
        if (!(error instanceof UserNotFound)) {
          return;
        }
        expect(error.key).toBe("id");
        expect(error.value).toBe(userId);
      }).pipe(Effect.provide(layerUsersTest)),
  );

  it.effect("upserts signup users with generated ids", () =>
    Effect.gen(function* () {
      yield* createTables;

      const users = yield* Users;
      const user = yield* users.upsertForSignup(email, newYorkTimezone);
      const selected = yield* users.getByEmail(email);
      const encoded = encode(User)(user);

      expect(user.email).toBe(email);
      expect(selected.id).toBe(user.id);
      expect(encoded.email).toBe(userInput.email);
      expect(encoded.timezone).toBe(userInput.timezone);
      expect(() => UserId.make(encoded.id)).not.toThrow();
      expect(encoded.unsubscribeToken).not.toBe(userInput.unsubscribeToken);
    }).pipe(Effect.provide(layerUsersTest)),
  );

  it.effect(
    "preserves unsubscribe tokens and overwrites timezone on signup resubmission",
    () =>
      Effect.gen(function* () {
        yield* createTables;

        const users = yield* Users;
        const first = yield* users.upsertForSignup(email, newYorkTimezone);
        const second = yield* users.upsertForSignup(email, chicagoTimezone);
        const encoded = encode(User)(second);

        expect(second.id).toBe(first.id);
        expect(second.unsubscribeToken).toBe(first.unsubscribeToken);
        expect(encoded.timezone).toBe("America/Chicago");
      }).pipe(Effect.provide(layerUsersTest)),
  );

  it.effect("removes users by id", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedUser;

      const users = yield* Users;
      const database = yield* Database;

      yield* users.remove(userId);

      const rows = yield* database
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

      expect(rows).toHaveLength(0);
    }).pipe(Effect.provide(layerUsersTest)),
  );

  it.effect(
    "maps read failures with operation metadata at the query callsite",
    () =>
      Effect.gen(function* () {
        const users = yield* Users;
        const error = yield* users.get(userId).pipe(Effect.flip);
        const emailError = yield* users.getByEmail(email).pipe(Effect.flip);
        const tokenError = yield* users
          .getByUnsubscribeToken(unsubscribeToken)
          .pipe(Effect.flip);

        expect(error).toBeInstanceOf(DatabaseReadError);
        if (!(error instanceof DatabaseReadError)) {
          return;
        }
        expect(error.operation).toBe("Users.get");
        expect(error.metadata).toEqual({ userId });

        expect(emailError).toBeInstanceOf(DatabaseReadError);
        if (!(emailError instanceof DatabaseReadError)) {
          return;
        }
        expect(emailError.operation).toBe("Users.getByEmail");
        expect(emailError.metadata).toEqual({ lookup: "email" });

        expect(tokenError).toBeInstanceOf(DatabaseReadError);
        if (!(tokenError instanceof DatabaseReadError)) {
          return;
        }
        expect(tokenError.operation).toBe("Users.getByUnsubscribeToken");
        expect(tokenError.metadata).toEqual({ lookup: "unsubscribeToken" });
      }).pipe(Effect.provide(layerUsersTest)),
  );

  it.effect(
    "maps signup write failures with operation metadata at the query callsite",
    () =>
      Effect.gen(function* () {
        const users = yield* Users;
        const error = yield* users
          .upsertForSignup(email, newYorkTimezone)
          .pipe(Effect.flip);

        expect(error).toBeInstanceOf(DatabaseWriteError);
        if (!(error instanceof DatabaseWriteError)) {
          return;
        }
        expect(error.operation).toBe("Users.upsertForSignup");
        expect(error.metadata).toEqual({
          timezone: "America/New_York",
        });
      }).pipe(Effect.provide(layerUsersTest)),
  );

  it.effect(
    "maps delete failures with operation metadata at the query callsite",
    () =>
      Effect.gen(function* () {
        const users = yield* Users;
        const error = yield* users.remove(userId).pipe(Effect.flip);

        expect(error).toBeInstanceOf(DatabaseDeleteError);
        expect(error.operation).toBe("Users.remove");
        expect(error.metadata).toEqual({ userId });
      }).pipe(Effect.provide(layerUsersTest)),
  );

  it.effect("decodes rows before returning users", () =>
    Effect.gen(function* () {
      yield* createTables;

      const sql = yield* SqlClient;
      yield* sql`
        INSERT INTO users (id, email, timezone, unsubscribe_token)
        VALUES (
          '00000000-0000-4000-8000-000000000101',
          'not-email',
          'America/New_York',
          '00000000-0000-4000-8000-000000000201'
        )
      `;

      const users = yield* Users;
      const error = yield* users.get(userId).pipe(Effect.flip);

      expect(error._tag).toBe("SchemaError");
    }).pipe(Effect.provide(layerUsersTest)),
  );

  it.effect("validates signup inserts before writing", () =>
    Effect.gen(function* () {
      yield* createTables;

      const users = yield* Users;
      const database = yield* Database;
      const error = yield* users
        .upsertForSignup(email, "Not/AZone" as never)
        .pipe(Effect.flip);
      const rows = yield* database.select().from(usersTable);

      expect(error._tag).toBe("SchemaError");
      expect(rows).toHaveLength(0);
    }).pipe(Effect.provide(layerUsersTest)),
  );
});
