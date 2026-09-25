import { and, eq, notInArray } from "drizzle-orm";
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
  DatabaseTransactionError,
  DatabaseWriteError,
  mapToReadError,
  mapToTransactionError,
  mapToWriteError,
  toWriteError,
} from "../../lib/database/errors.js";
import { Database } from "../../lib/database/service.js";
import { Id } from "../../lib/id/service.js";
import { Subject, SubjectId } from "../subjects/schema.js";
import { User, usersTable } from "../users/schema.js";
import { InvalidSubjectSelection, SubjectCapacityReached } from "./errors.js";
import {
  Subscription,
  SubscriptionId,
  SubscriptionInsert,
  SubscriptionWithSubject,
  subscriptionsTable,
} from "./schema.js";
import { SubscriptionPolicy } from "./policy.js";

export type NotificationRecipient = typeof NotificationRecipient.Type;
export const NotificationRecipient = Schema.Struct({
  user: User,
  subscription: SubscriptionWithSubject,
});

export class Subscriptions extends Context.Service<
  Subscriptions,
  {
    readonly list: () => Effect.Effect<
      readonly Subscription[],
      DatabaseReadError | Schema.SchemaError
    >;

    readonly listForUser: (
      userId: User["id"],
    ) => Effect.Effect<
      readonly SubscriptionWithSubject[],
      DatabaseReadError | Schema.SchemaError
    >;

    readonly listNotificationRecipients: () => Effect.Effect<
      readonly NotificationRecipient[],
      DatabaseReadError | Schema.SchemaError
    >;

    readonly replaceForUser: (input: {
      readonly user: User;
      readonly subjectIds: Array.NonEmptyReadonlyArray<SubjectId>;
      readonly schedule: Subscription["schedule"];
    }) => Effect.Effect<
      readonly Subject[],
      | InvalidSubjectSelection
      | SubjectCapacityReached
      | DatabaseReadError
      | DatabaseTransactionError
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
const decodeSubscriptionsWithSubject = Schema.decodeUnknownEffect(
  Schema.Array(SubscriptionWithSubject),
);
const decodeSubjects = Schema.decodeUnknownEffect(Schema.Array(Subject));
const decodeNotificationRecipients = Schema.decodeUnknownEffect(
  Schema.Array(NotificationRecipient),
);
const encodeSubscription = Schema.encodeEffect(SubscriptionInsert);
const encodeLastSentAt = Schema.encodeEffect(Schema.DateTimeUtcFromString);

export const SubscriptionsLayer = Layer.effect(
  Subscriptions,
  Effect.gen(function* () {
    const database = yield* Database;
    const id = yield* Id;
    const SubjectPolicy = SubscriptionPolicy.subject;

    const assertSubjectsExist = Effect.fn(function* (
      subjectIds: Array.NonEmptyReadonlyArray<SubjectId>,
    ) {
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

      if (Array.isReadonlyArrayEmpty(invalidIds)) {
        return yield* decodeSubjects(rows);
      }

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

    const listForUser: Subscriptions["Service"]["listForUser"] = Effect.fn(
      "Subscriptions.listForUser",
    )(function* (userId) {
      const rows = yield* database.query.subscriptionsTable
        .findMany({
          where: { userId },
          with: { subject: true },
          orderBy: { id: "asc" },
        })
        .pipe(mapToReadError("Subscriptions.listForUser", { userId }));

      return yield* decodeSubscriptionsWithSubject(rows);
    });

    const listNotificationRecipients: Subscriptions["Service"]["listNotificationRecipients"] =
      Effect.fn("Subscriptions.listNotificationRecipients")(function* () {
        const rows = yield* database.query.subscriptionsTable
          .findMany({
            where: { user: { emailVerified: true } },
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

        const insertableSubscriptions = yield* Effect.forEach(
          subjectIds,
          (subjectId) =>
            Effect.gen(function* () {
              const subscriptionId =
                yield* id.makeFromBrandedSchema(SubscriptionId);

              return yield* encodeSubscription({
                id: subscriptionId,
                userId: input.user.id,
                subjectId,
                schedule: input.schedule,
                lastSentAt: null,
              });
            }),
        );

        const metadata = {
          userId: input.user.id,
          subscriptionCount: insertableSubscriptions.length,
        };

        return yield* database
          .transaction(() =>
            Effect.gen(function* () {
              // Lock the user so concurrent edits cannot merge their team lists,
              // including when the user has no subscriptions yet.
              yield* database
                .select({ id: usersTable.id })
                .from(usersTable)
                .where(eq(usersTable.id, input.user.id))
                .for("update")
                .pipe(
                  mapToReadError("Subscriptions.replaceForUser.lock", metadata),
                );

              const subjects = yield* assertSubjectsExist(subjectIds);

              // Remove dropped teams; retained rows keep their ID and last send.
              yield* database
                .delete(subscriptionsTable)
                .where(
                  and(
                    eq(subscriptionsTable.userId, input.user.id),
                    notInArray(subscriptionsTable.subjectId, subjectIds),
                  ),
                )
                .pipe(
                  Effect.catchTag(
                    "EffectDrizzleQueryError",
                    toWriteError("Subscriptions.replaceForUser", metadata),
                  ),
                );

              yield* database
                .insert(subscriptionsTable)
                .values(insertableSubscriptions)
                .onConflictDoUpdate({
                  target: [
                    subscriptionsTable.userId,
                    subscriptionsTable.subjectId,
                  ],
                  // Retained teams keep their identity and last successful send.
                  set: { schedule: input.schedule },
                })
                .pipe(
                  Effect.catchTag(
                    "EffectDrizzleQueryError",
                    toWriteError("Subscriptions.replaceForUser", metadata),
                  ),
                );

              return subjects;
            }),
          )
          .pipe(
            mapToTransactionError("Subscriptions.replaceForUser", metadata),
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
      listForUser,
      listNotificationRecipients,
      replaceForUser,
      markSent,
    });
  }),
);
