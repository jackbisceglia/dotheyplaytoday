import { SqlClient } from "effect/unstable/sql/SqlClient";
import { eq } from "drizzle-orm";
import {
  Array,
  Context,
  DateTime,
  Effect,
  HashSet,
  Layer,
  Option,
  Schema,
} from "effect";

import {
  DatabaseReadError,
  DatabaseWriteError,
  mapToReadError,
  mapToWriteError,
  toWriteError,
} from "../../lib/database/errors.js";
import { Database } from "../../lib/database/service.js";
import { Id } from "../../lib/domain/id.js";
import { Subject, SubjectId } from "../subjects/schema.js";
import { User } from "../users/schema.js";
import { InvalidSubjectSelection, SubjectCapacityReached } from "./errors.js";
import {
  Subscription,
  SubscriptionId,
  SubscriptionInsert,
  subscriptionsTable,
} from "./schema.js";
import { SubscriptionPolicy } from "./policy.js";

export type NotificationRecipient = typeof NotificationRecipient.Type;
export const NotificationRecipient = Schema.Struct({
  user: User,
  subscription: Schema.Struct({
    ...Subscription.fields,
    subject: Subject,
  }),
});

export class Subscriptions extends Context.Service<
  Subscriptions,
  {
    readonly list: () => Effect.Effect<
      readonly Subscription[],
      DatabaseReadError | Schema.SchemaError
    >;

    readonly listNotificationRecipients: () => Effect.Effect<
      readonly NotificationRecipient[],
      DatabaseReadError | Schema.SchemaError
    >;

    readonly replaceForUser: (input: {
      readonly user: User;
      readonly subjectIds: readonly SubjectId[];
      readonly schedule: Subscription["schedule"];
    }) => Effect.Effect<
      void,
      | InvalidSubjectSelection
      | SubjectCapacityReached
      | DatabaseReadError
      | DatabaseWriteError
      | Schema.SchemaError
    >;

    readonly markSent: (input: {
      readonly subscriptionId: SubscriptionId;
      readonly sentAt: DateTime.Utc;
    }) => Effect.Effect<void, DatabaseWriteError | Schema.SchemaError>;
  }
>()("@dtpt/core/Subscriptions") {}

const decodeSubscriptions = Schema.decodeUnknownEffect(
  Schema.Array(Subscription),
);
const decodeNotificationRecipients = Schema.decodeUnknownEffect(
  Schema.Array(NotificationRecipient),
);
const encodeSubscription = Schema.encodeEffect(SubscriptionInsert);
const encodeLastSentAt = Schema.encodeEffect(Schema.DateTimeUtcFromString);

export const SubscriptionsLayer = Layer.effect(
  Subscriptions,
  Effect.gen(function* () {
    const database = yield* Database;
    const sql = yield* SqlClient;
    const SubjectPolicy = SubscriptionPolicy.subject;

    const assertSubjectsExist = Effect.fn(function* (
      subjectIds: readonly SubjectId[],
    ) {
      if (Array.isReadonlyArrayEmpty(subjectIds)) return;

      const rows = yield* database.query.subjectsTable
        .findMany({
          where: { id: { in: Array.fromIterable(subjectIds) } },
          orderBy: { id: "asc" },
        })
        .pipe(
          mapToReadError("Subscriptions.replaceForUser.subjects", {
            subjectCount: subjectIds.length,
          }),
        );

      const foundIds = HashSet.fromIterable(rows.map((row) => row.id));
      const invalidIds = subjectIds.filter(
        (subjectId) => !HashSet.has(foundIds, subjectId),
      );

      if (Array.isReadonlyArrayEmpty(invalidIds)) return;

      return yield* new InvalidSubjectSelection({ invalidIds });
    });

    const list: Subscriptions["Service"]["list"] = Effect.fn(
      "Subscriptions.list",
    )(function* () {
      const rows = yield* database.query.subscriptionsTable
        .findMany({
          orderBy: { id: "asc" },
        })
        .pipe(mapToReadError("Subscriptions.list"));

      const subscriptions = yield* decodeSubscriptions(rows);

      return subscriptions;
    });

    const listNotificationRecipients: Subscriptions["Service"]["listNotificationRecipients"] =
      Effect.fn("Subscriptions.listNotificationRecipients")(function* () {
        const rows = yield* database.query.subscriptionsTable
          .findMany({
            with: {
              user: true,
              subject: true,
            },
            orderBy: { id: "asc" },
          })
          .pipe(mapToReadError("Subscriptions.listNotificationRecipients"));

        const shaped = rows.map(({ user, subject, ...subscription }) => ({
          user,
          subscription: {
            ...subscription,
            subject,
          },
        }));

        const notificationRecipients =
          yield* decodeNotificationRecipients(shaped);

        return notificationRecipients;
      });

    const replaceForUser: Subscriptions["Service"]["replaceForUser"] =
      Effect.fn("Subscriptions.replaceForUser")(function* (input) {
        const subjectIds = Array.dedupe(input.subjectIds);

        yield* SubjectPolicy.ensureAllowance(input.user, subjectIds.length);
        yield* assertSubjectsExist(subjectIds);

        const insertableSubscriptions = yield* Effect.forEach(
          subjectIds,
          (subjectId) =>
            Effect.gen(function* () {
              const id = yield* Id.createFromBrandedSchema(SubscriptionId);

              return yield* encodeSubscription({
                id,
                userId: input.user.id,
                subjectId,
                schedule: input.schedule,
                lastSentAt: null,
              });
            }),
        );

        yield* sql
          .withTransaction(
            Effect.gen(function* () {
              yield* database
                .delete(subscriptionsTable)
                .where(eq(subscriptionsTable.userId, input.user.id));

              if (Array.isReadonlyArrayEmpty(insertableSubscriptions)) return;

              yield* database
                .insert(subscriptionsTable)
                .values(insertableSubscriptions);
            }),
          )
          .pipe(
            Effect.catchTag(
              "SqlError",
              toWriteError("Subscriptions.replaceForUser", {
                userId: input.user.id,
                subscriptionCount: insertableSubscriptions.length,
              }),
            ),
          );
      });

    const markSent: Subscriptions["Service"]["markSent"] = Effect.fn(
      "Subscriptions.markSent",
    )(function* (input) {
      const lastSentAt = yield* encodeLastSentAt(input.sentAt);
      const rows = yield* database
        .update(subscriptionsTable)
        .set({ lastSentAt })
        .where(eq(subscriptionsTable.id, input.subscriptionId))
        .returning({ id: subscriptionsTable.id })
        .pipe(
          mapToWriteError("Subscriptions.markSent", {
            subscriptionId: input.subscriptionId,
          }),
        );

      const row = Array.head(rows);

      if (Option.isNone(row)) {
        return yield* new DatabaseWriteError({
          operation: "Subscriptions.markSent",
          metadata: { subscriptionId: input.subscriptionId },
        });
      }
    });

    return Subscriptions.of({
      list,
      listNotificationRecipients,
      replaceForUser,
      markSent,
    });
  }),
);
