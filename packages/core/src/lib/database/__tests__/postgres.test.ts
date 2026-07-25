import { describe, expect, it } from "@effect/vitest";
import { Effect, Redacted } from "effect";
import { getTableConfig } from "drizzle-orm/pg-core";

import { createPostgresDatabaseLayer, Database } from "../service.js";
import { participantsTable } from "../../../modules/events/participants/schema.js";
import { eventsTable } from "../../../modules/events/schema.js";
import { subjectsTable } from "../../../modules/subjects/schema.js";
import { subscriptionsTable } from "../../../modules/subscriptions/schema.js";

describe("PostgreSQL database adapter", () => {
  it.effect("provides Drizzle without opening a module-scoped connection", () =>
    Effect.gen(function* () {
      const database = yield* Database;

      expect(typeof database.select).toBe("function");
      expect(typeof database.query.usersTable.findFirst).toBe("function");
      expect(typeof database.transaction).toBe("function");
    }).pipe(
      Effect.provide(
        createPostgresDatabaseLayer(
          Effect.succeed(
            Redacted.make(
              "postgresql://deferred:deferred@example.invalid:5432/deferred",
            ),
          ),
        ),
      ),
    ),
  );

  it("uses JSONB for structured fields and TEXT for ISO timestamps", () => {
    expect(subjectsTable.details.getSQLType()).toBe("jsonb");
    expect(eventsTable.details.getSQLType()).toBe("jsonb");
    expect(participantsTable.details.getSQLType()).toBe("jsonb");
    expect(subscriptionsTable.schedule.getSQLType()).toBe("jsonb");
    expect(eventsTable.startsAt.getSQLType()).toBe("text");
    expect(subscriptionsTable.lastSentAt.getSQLType()).toBe("text");
  });

  it("preserves PostgreSQL cascade foreign keys", () => {
    expect(getTableConfig(participantsTable).foreignKeys).toHaveLength(1);
    expect(getTableConfig(subscriptionsTable).foreignKeys).toHaveLength(2);
  });
});
