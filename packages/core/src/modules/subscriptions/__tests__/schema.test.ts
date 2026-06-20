import { describe, expect, it } from "@effect/vitest";
import { eq } from "drizzle-orm";
import { Effect, Schema } from "effect";

import { Database } from "../../../lib/database/service.js";
import { createTables, layerTest } from "../../../lib/database/__tests__/setup.js";
import { Subject, SubjectInsert, subjectsTable } from "../../subjects/schema.js";
import { User, UserInsert, usersTable } from "../../users/schema.js";
import {
  Subscription,
  SubscriptionInsert,
  subscriptionsTable,
} from "../schema.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;

const userInput = {
  id: "00000000-0000-4000-8000-000000000101",
  email: "test@example.com",
  timezone: "America/New_York",
  unsubscribeToken: "00000000-0000-4000-8000-000000000201",
};

const subjectInput = {
  id: "00000000-0000-4000-8000-000000000301",
  _tag: "sports_team",
  details: {
    _tag: "sports_team",
    leagueId: "nba",
    location: "Boston",
    name: "Celtics",
    display: "Boston Celtics",
    abbreviation: "BOS",
    slug: "boston-celtics",
  },
};

const subscriptionInput = {
  id: "00000000-0000-4000-8000-000000000401",
  userId: userInput.id,
  subjectId: subjectInput.id,
  schedule: {
    _tag: "fixed_local_time",
    sendAtSecondsLocal: 9 * 60 * 60,
  },
  lastSentAt: "2026-05-24T13:00:00.000Z",
};

const seedParents = Effect.gen(function* () {
  const database = yield* Database;

  yield* database
    .insert(usersTable)
    .values(encode(UserInsert)(decode(User)(userInput)));
  yield* database
    .insert(subjectsTable)
    .values(encode(SubjectInsert)(decode(Subject)(subjectInput)));
});

describe("Subscription model", () => {
  it("rejects malformed subscription-owned fields and schedules", () => {
    expect(() =>
      decode(Subscription)({ ...subscriptionInput, id: "not-uuid" }),
    ).toThrow();
    expect(() =>
      decode(Subscription)({
        ...subscriptionInput,
        schedule: { _tag: "relative", timeOffsetSeconds: -1800 },
      }),
    ).toThrow();
    expect(() =>
      decode(Subscription)({
        ...subscriptionInput,
        schedule: {
          _tag: "fixed_local_time",
          sendAtSecondsLocal: 9 * 60 * 60 + 1,
        },
      }),
    ).toThrow();
    expect(() =>
      decode(Subscription)({
        ...subscriptionInput,
        schedule: {
          _tag: "fixed_local_time",
          sendAtSecondsLocal: 24 * 60 * 60,
        },
      }),
    ).toThrow();
    expect(() =>
      decode(Subscription)({ ...subscriptionInput, lastSentAt: "not-a-date" }),
    ).toThrow();
  });

  it("encodes and decodes the subscription row boundary", () => {
    const subscription = decode(Subscription)(subscriptionInput);
    const insert = encode(SubscriptionInsert)(subscription);
    const selected = decode(Subscription)(insert);

    expect(insert).toEqual(subscriptionInput);
    expect(selected.id).toBe(subscription.id);
    expect(selected.schedule).toEqual(subscription.schedule);
    expect(encode(Subscription)(selected)).toEqual(subscriptionInput);
  });

  it.effect("roundtrips through SQLite using the database layer", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedParents;

      const database = yield* Database;
      const insert = encode(SubscriptionInsert)(
        decode(Subscription)(subscriptionInput),
      );

      yield* database.insert(subscriptionsTable).values(insert);

      const rows = yield* database.select().from(subscriptionsTable);
      const decodedRows = decode(Schema.Array(Subscription))(rows);
      const selectedRows = yield* database
        .select()
        .from(subscriptionsTable)
        .where(eq(subscriptionsTable.id, insert.id))
        .limit(1);
      const row = selectedRows[0];
      const decodedRow = decode(Subscription)(row);

      expect(decodedRows).toHaveLength(1);
      expect(encode(Subscription)(decodedRow)).toEqual(subscriptionInput);
    }).pipe(Effect.provide(layerTest)),
  );
});
