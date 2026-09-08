import * as PgClient from "@effect/sql-pg/PgClient";
import { describe, expect, it } from "@effect/vitest";
import * as Drizzle from "drizzle-orm/effect-postgres";
import { DateTime, Effect, Layer, Stream } from "effect";
import { Reactivity } from "effect/unstable/reactivity";
import type { Connection } from "effect/unstable/sql/SqlConnection";
import {
  ConnectionError,
  SqlError,
  UniqueViolation,
} from "effect/unstable/sql/SqlError";
import { vi } from "vitest";

import { relations } from "../../../lib/database/definitions/relations.js";
import { Database } from "../../../lib/database/service.js";
import { Id } from "../../../lib/id/service.js";
import { EmailAddress } from "../schema.js";
import { Users, UsersLayer } from "../service.js";

const email = EmailAddress.make("user@example.com");
const timezone = DateTime.zoneMakeNamedUnsafe("America/New_York");
const id = "00000000-0000-4000-8000-000000000001";
const now = new Date("2026-01-01T00:00:00Z");

// Keep the real Effect SQL and Drizzle layers to exercise their error wrapping
// and row decoding. The driver boundary is fake: this is not a persistence test.
const makeFixture = () => {
  const execute = vi.fn<Connection["executeValues"]>(() =>
    Effect.succeed([[id, email, timezone.id, id, null, false, now, now]]),
  );
  const connection: Connection = {
    executeValues: execute,
    executeValuesUnprepared: execute,
    execute: () => Effect.die("Unexpected object query"),
    executeRaw: () => Effect.die("Unexpected raw query"),
    executeUnprepared: () => Effect.die("Unexpected unprepared query"),
    executeStream: () => Stream.die("Unexpected stream"),
  };
  const database = Layer.effect(
    Database,
    Effect.gen(function* () {
      const client = yield* PgClient.makeWith({
        acquirer: Effect.succeed(connection),
        transactionAcquirer: Effect.succeed(connection),
        listenAcquirer: Effect.die("Unexpected LISTEN"),
        config: {},
      });
      return yield* Drizzle.makeWithDefaults({ relations }).pipe(
        Effect.provideService(PgClient.PgClient, client),
      );
    }).pipe(Effect.provide(Reactivity.layer)),
  );
  const layer = UsersLayer.pipe(
    Layer.provide([
      database,
      Layer.mock(Id, {
        makeFromBrandedSchema: (schema) => Effect.succeed(schema.make(id)),
      }),
    ]),
  );
  const create = Effect.gen(function* () {
    const users = yield* Users;
    return yield* users.create(email, timezone);
  }).pipe(Effect.provide(layer));
  return { execute, create };
};

describe("Users.create", () => {
  it.effect(
    "inserts one unverified user with null name and decodes the returned row",
    () => {
      const f = makeFixture();
      return Effect.gen(function* () {
        const user = yield* f.create;
        expect(user).toMatchObject({
          id,
          email,
          timezone,
          name: null,
          emailVerified: false,
          unsubscribeToken: id,
        });
        expect(f.execute).toHaveBeenCalledOnce();
        const [sql, params] = f.execute.mock.calls[0] ?? [];
        expect(sql).toMatch(/^insert into "users"/);
        expect(sql).not.toContain("on conflict");
        expect(params).toEqual([id, email, timezone.id, id, null, false]);
      });
    },
  );

  it.effect("maps only the email unique violation to UserAlreadyExists", () => {
    const f = makeFixture();
    f.execute.mockReturnValue(
      Effect.fail(
        new SqlError({
          reason: new UniqueViolation({
            constraint: "users_email_idx",
            cause: new Error("duplicate"),
          }),
        }),
      ),
    );
    return Effect.gen(function* () {
      const error = yield* f.create.pipe(Effect.flip);
      expect(error._tag).toBe("UserAlreadyExists");
      expect(f.execute).toHaveBeenCalledOnce();
    });
  });

  it.effect(
    "keeps unrelated unique violations and connection failures as write errors",
    () =>
      Effect.gen(function* () {
        for (const reason of [
          new UniqueViolation({
            constraint: "users_pkey",
            cause: new Error("duplicate ID"),
          }),
          new UniqueViolation({
            constraint: "users_unsubscribe_token_idx",
            cause: new Error("duplicate token"),
          }),
          new ConnectionError({ cause: new Error("offline") }),
        ]) {
          const f = makeFixture();
          f.execute.mockReturnValue(Effect.fail(new SqlError({ reason })));
          const error = yield* f.create.pipe(Effect.flip);
          expect(error).toMatchObject({
            _tag: "DatabaseWriteError",
            operation: "Users.create",
          });
        }
      }),
  );

  it.effect("fails when the insert returns no user", () => {
    const f = makeFixture();
    f.execute.mockReturnValue(Effect.succeed([]));
    return Effect.gen(function* () {
      const error = yield* f.create.pipe(Effect.flip);
      expect(error).toMatchObject({
        _tag: "DatabaseWriteError",
        operation: "Users.create",
      });
    });
  });
});
