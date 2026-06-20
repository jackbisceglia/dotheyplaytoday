import { describe, expect, it } from "@effect/vitest";
import { eq } from "drizzle-orm";
import { Effect, Layer, Schema } from "effect";

import {
  DatabaseReadError,
  DatabaseWriteError,
} from "../../../lib/database/errors.js";
import { Database } from "../../../lib/database/service.js";
import { createTables, layerTest } from "../../../lib/database/__tests__/setup.js";
import {
  Subject,
  SubjectId,
  SubjectInsert,
  subjectsTable,
} from "../../subjects/schema.js";
import { User, UserId, UserInsert, usersTable } from "../../users/schema.js";
import {
  InvalidSubjectSelection,
  SubjectCapacityReached,
} from "../errors.js";
import {
  Subscription,
  SubscriptionId,
  SubscriptionInsert,
  subscriptionsTable,
} from "../schema.js";
import { Subscriptions, SubscriptionsLayer } from "../service.js";

const decode = Schema.decodeUnknownSync;
const encode = Schema.encodeSync;
const utc = decode(Schema.DateTimeUtcFromString);

const layerSubscriptionsTest = SubscriptionsLayer.pipe(
  Layer.provideMerge(layerTest),
);

const userInput = {
  id: "00000000-0000-4000-8000-000000000101",
  email: "test@example.com",
  timezone: "America/New_York",
  unsubscribeToken: "00000000-0000-4000-8000-000000000201",
};

const secondUserInput = {
  id: "00000000-0000-4000-8000-000000000102",
  email: "second@example.com",
  timezone: "America/Chicago",
  unsubscribeToken: "00000000-0000-4000-8000-000000000202",
};

const makeSubjectInput = (input: {
  readonly id: string;
  readonly name: string;
  readonly abbreviation: string;
}) => ({
  id: input.id,
  _tag: "sports_team",
  details: {
    _tag: "sports_team",
    leagueId: "nba",
    location: input.name,
    name: input.name,
    display: input.name,
    abbreviation: input.abbreviation,
    slug: input.name.toLowerCase().replaceAll(" ", "-"),
  },
});

const subjectInput = makeSubjectInput({
  id: "00000000-0000-4000-8000-000000000301",
  name: "Boston Celtics",
  abbreviation: "BOS",
});

const secondSubjectInput = makeSubjectInput({
  id: "00000000-0000-4000-8000-000000000302",
  name: "New York Knicks",
  abbreviation: "NYK",
});

const thirdSubjectInput = makeSubjectInput({
  id: "00000000-0000-4000-8000-000000000303",
  name: "Los Angeles Lakers",
  abbreviation: "LAL",
});

const userId = UserId.make(userInput.id);
const secondUserId = UserId.make(secondUserInput.id);
const user = decode(User)(userInput);
const subjectId = SubjectId.make(subjectInput.id);
const secondSubjectId = SubjectId.make(secondSubjectInput.id);
const thirdSubjectId = SubjectId.make(thirdSubjectInput.id);
const missingSubjectId = SubjectId.make(
  "00000000-0000-4000-8000-000000009999",
);
const missingSubscriptionId = SubscriptionId.make(
  "00000000-0000-4000-8000-000000009998",
);

const schedule = {
  _tag: "fixed_local_time",
  sendAtSecondsLocal: 9 * 60 * 60,
} as const;

const laterSchedule = {
  _tag: "fixed_local_time",
  sendAtSecondsLocal: 10 * 60 * 60,
} as const;

const seedUsers = Effect.gen(function* () {
  const database = yield* Database;
  const inserts = [userInput, secondUserInput].map((user) =>
    encode(UserInsert)(decode(User)(user)),
  );

  yield* database.insert(usersTable).values(inserts);
});

const seedSubjects = Effect.gen(function* () {
  const database = yield* Database;
  const inserts = [subjectInput, secondSubjectInput, thirdSubjectInput].map(
    (subject) => encode(SubjectInsert)(decode(Subject)(subject)),
  );

  yield* database.insert(subjectsTable).values(inserts);
});

const insertSubscription = (input: {
  readonly id: string;
  readonly userId: string;
  readonly subjectId: string;
  readonly sendAtSecondsLocal?: number;
  readonly lastSentAt?: string | null;
}) =>
  Effect.gen(function* () {
    const database = yield* Database;
    const insert = encode(SubscriptionInsert)(
      decode(Subscription)({
        id: input.id,
        userId: input.userId,
        subjectId: input.subjectId,
        schedule: {
          _tag: "fixed_local_time",
          sendAtSecondsLocal: input.sendAtSecondsLocal ?? 9 * 60 * 60,
        },
        lastSentAt: input.lastSentAt ?? null,
      }),
    );

    yield* database.insert(subscriptionsTable).values(insert);
  });

const overCapacitySubjectIds = Array.from(
  { length: 3 },
  (_, index) =>
    SubjectId.make(
      `00000000-0000-4000-8000-${String(index + 1000).padStart(12, "0")}`,
    ),
);

describe("Subscriptions service", () => {
  it.effect("lists subscriptions and notification recipients deterministically", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedUsers;
      yield* seedSubjects;
      yield* insertSubscription({
        id: "00000000-0000-4000-8000-000000000402",
        userId: secondUserInput.id,
        subjectId: secondSubjectInput.id,
      });
      yield* insertSubscription({
        id: "00000000-0000-4000-8000-000000000401",
        userId: userInput.id,
        subjectId: subjectInput.id,
      });

      const subscriptions = yield* Subscriptions;
      const listed = yield* subscriptions.list();
      const recipients = yield* subscriptions.listNotificationRecipients();

      expect(listed.map((subscription) => subscription.id)).toEqual([
        "00000000-0000-4000-8000-000000000401",
        "00000000-0000-4000-8000-000000000402",
      ]);
      expect(recipients.map((recipient) => recipient.subscription.id)).toEqual([
        "00000000-0000-4000-8000-000000000401",
        "00000000-0000-4000-8000-000000000402",
      ]);
      expect(recipients[0]?.user.email).toBe("test@example.com");
      expect(recipients[0]?.subscription.subject.details.name).toBe(
        "Boston Celtics",
      );
    }).pipe(Effect.provide(layerSubscriptionsTest)),
  );

  it.effect(
    "replaces one user's subscriptions with deduped subjects and reset sent markers",
    () =>
      Effect.gen(function* () {
        yield* createTables;
        yield* seedUsers;
        yield* seedSubjects;
        yield* insertSubscription({
          id: "00000000-0000-4000-8000-000000000401",
          userId: userInput.id,
          subjectId: subjectInput.id,
          lastSentAt: "2026-05-24T13:00:00.000Z",
        });
        yield* insertSubscription({
          id: "00000000-0000-4000-8000-000000000402",
          userId: secondUserInput.id,
          subjectId: subjectInput.id,
          lastSentAt: "2026-05-24T13:00:00.000Z",
        });

        const subscriptions = yield* Subscriptions;
        const database = yield* Database;

        yield* subscriptions.replaceForUser({
          user,
          subjectIds: [secondSubjectId, secondSubjectId, thirdSubjectId],
          schedule: laterSchedule,
        });

        const rows = yield* database.query.subscriptionsTable.findMany({
          orderBy: { subjectId: "asc" },
        });
        const targetRows = rows.filter((row) => row.userId === userId);
        const otherUserRows = rows.filter((row) => row.userId === secondUserId);

        expect(targetRows.map((row) => row.subjectId)).toEqual([
          secondSubjectId,
          thirdSubjectId,
        ]);
        expect(targetRows.map((row) => row.schedule)).toEqual([
          laterSchedule,
          laterSchedule,
        ]);
        expect(targetRows.map((row) => row.lastSentAt)).toEqual([null, null]);
        expect(otherUserRows.map((row) => row.subjectId)).toEqual([subjectId]);
      }).pipe(Effect.provide(layerSubscriptionsTest)),
  );

  it.effect("clears a user's subscriptions when replacement is empty", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedUsers;
      yield* seedSubjects;
      yield* insertSubscription({
        id: "00000000-0000-4000-8000-000000000401",
        userId: userInput.id,
        subjectId: subjectInput.id,
      });

      const subscriptions = yield* Subscriptions;
      const database = yield* Database;

      yield* subscriptions.replaceForUser({
        user,
        subjectIds: [],
        schedule,
      });

      const rows = yield* database
        .select()
        .from(subscriptionsTable)
        .where(eq(subscriptionsTable.userId, userId));

      expect(rows).toHaveLength(0);
    }).pipe(Effect.provide(layerSubscriptionsTest)),
  );

  it.effect("rejects over-capacity replacement before deleting existing rows", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedUsers;
      yield* seedSubjects;
      yield* insertSubscription({
        id: "00000000-0000-4000-8000-000000000401",
        userId: userInput.id,
        subjectId: subjectInput.id,
      });

      const subscriptions = yield* Subscriptions;
      const database = yield* Database;
      const error = yield* subscriptions
        .replaceForUser({
          user,
          subjectIds: overCapacitySubjectIds,
          schedule,
        })
        .pipe(Effect.flip);
      const rows = yield* database.select().from(subscriptionsTable);

      expect(error).toBeInstanceOf(SubjectCapacityReached);
      if (!(error instanceof SubjectCapacityReached)) {
        return;
      }
      expect(error.limit).toBe(2);
      expect(error.received).toBe(3);
      expect(rows).toHaveLength(1);
    }).pipe(Effect.provide(layerSubscriptionsTest)),
  );

  it.effect(
    "rejects missing subject selections before deleting existing rows",
    () =>
      Effect.gen(function* () {
        yield* createTables;
        yield* seedUsers;
        yield* seedSubjects;
        yield* insertSubscription({
          id: "00000000-0000-4000-8000-000000000401",
          userId: userInput.id,
          subjectId: subjectInput.id,
        });

        const subscriptions = yield* Subscriptions;
        const database = yield* Database;
        const error = yield* subscriptions
          .replaceForUser({
            user,
            subjectIds: [missingSubjectId],
            schedule,
          })
          .pipe(Effect.flip);
        const rows = yield* database.select().from(subscriptionsTable);

        expect(error).toBeInstanceOf(InvalidSubjectSelection);
        if (!(error instanceof InvalidSubjectSelection)) {
          return;
        }
        expect(error.invalidIds).toEqual([missingSubjectId]);
        expect(rows).toHaveLength(1);
      }).pipe(Effect.provide(layerSubscriptionsTest)),
  );

  it.effect("marks subscriptions sent at a UTC instant", () =>
    Effect.gen(function* () {
      yield* createTables;
      yield* seedUsers;
      yield* seedSubjects;
      yield* insertSubscription({
        id: "00000000-0000-4000-8000-000000000401",
        userId: userInput.id,
        subjectId: subjectInput.id,
      });

      const subscriptions = yield* Subscriptions;
      const sentAt = utc("2026-05-24T13:00:00.000Z");

      yield* subscriptions.markSent({
        subscriptionId: SubscriptionId.make(
          "00000000-0000-4000-8000-000000000401",
        ),
        sentAt,
      });

      const [selected] = yield* subscriptions.list();

      expect(selected?.lastSentAt).toEqual(sentAt);
    }).pipe(Effect.provide(layerSubscriptionsTest)),
  );

  it.effect("fails markSent when the subscription is missing", () =>
    Effect.gen(function* () {
      yield* createTables;

      const subscriptions = yield* Subscriptions;
      const error = yield* subscriptions
        .markSent({
          subscriptionId: missingSubscriptionId,
          sentAt: utc("2026-05-24T13:00:00.000Z"),
        })
        .pipe(Effect.flip);

      expect(error).toBeInstanceOf(DatabaseWriteError);
      if (!(error instanceof DatabaseWriteError)) {
        return;
      }
      expect(error.operation).toBe("Subscriptions.markSent");
      expect(error.metadata).toEqual({ subscriptionId: missingSubscriptionId });
    }).pipe(Effect.provide(layerSubscriptionsTest)),
  );

  it.effect("maps subscription read failures with operation metadata", () =>
    Effect.gen(function* () {
      const subscriptions = yield* Subscriptions;
      const listError = yield* subscriptions.list().pipe(Effect.flip);
      const recipientsError = yield* subscriptions
        .listNotificationRecipients()
        .pipe(Effect.flip);

      expect(listError).toBeInstanceOf(DatabaseReadError);
      if (!(listError instanceof DatabaseReadError)) {
        return;
      }
      expect(listError.operation).toBe("Subscriptions.list");
      expect(recipientsError).toBeInstanceOf(DatabaseReadError);
      if (!(recipientsError instanceof DatabaseReadError)) {
        return;
      }
      expect(recipientsError.operation).toBe(
        "Subscriptions.listNotificationRecipients",
      );
    }).pipe(Effect.provide(layerSubscriptionsTest)),
  );
});
