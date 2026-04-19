import { eq } from "drizzle-orm";
import { DateTime, Effect, ParseResult, Schema } from "effect";

import { Event } from "../events/schema.js";
import { Subscription, subscriptionsTable } from "../subscriptions/schema.js";
import { eventsTable, Topic, topicsTable } from "../topics/schema.js";
import { User, usersTable } from "../users/schema.js";
import { Database } from "./service.js";

class DatabaseRecordNotFound extends Schema.TaggedError<DatabaseRecordNotFound>()(
  "DatabaseRecordNotFound",
  {
    entity: Schema.String,
    id: Schema.String,
  },
) {}

class DatabaseQueryError extends Schema.TaggedError<DatabaseQueryError>()(
  "DatabaseQueryError",
  {
    operation: Schema.String,
    message: Schema.String,
  },
) {}

class DatabaseDecodeError extends Schema.TaggedError<DatabaseDecodeError>()(
  "DatabaseDecodeError",
  {
    operation: Schema.String,
    message: Schema.String,
    issues: Schema.Array(Schema.ArrayFormatterIssue),
  },
) {}

class DatabaseInvariantError extends Schema.TaggedError<DatabaseInvariantError>()(
  "DatabaseInvariantError",
  {
    operation: Schema.String,
    message: Schema.String,
  },
) {}

const formatParseError = (error: ParseResult.ParseError) => ({
  message: ParseResult.TreeFormatter.formatErrorSync(error),
  issues: ParseResult.ArrayFormatter.formatErrorSync(error),
});

const decodeOrFail = Effect.fn("DatabaseOld.decodeOrFail")(function* <A, I>(
  operation: string,
  schema: Schema.Schema<A, I>,
  value: unknown,
) {
  return yield* Schema.decodeUnknown(schema)(value).pipe(
    Effect.mapError((error) => {
      const formatted = formatParseError(error);
      return DatabaseDecodeError.make({
        operation,
        message: formatted.message,
        issues: formatted.issues,
      });
    }),
  );
});

const toSubscriptionRow = (subscription: Subscription) => {
  if (subscription.schedule.type === "fixed") {
    return {
      id: subscription.id,
      userId: subscription.userId,
      topicId: subscription.topicId,
      scheduleType: "fixed" as const,
      sendAtSecondsLocal: subscription.schedule.sendAtSecondsLocal,
      timeOffsetSeconds: null,
      enabled: subscription.enabled ? 1 : 0,
      lastSentAt: subscription.lastSentAt
        ? DateTime.formatIso(subscription.lastSentAt)
        : null,
    };
  }

  return {
    id: subscription.id,
    userId: subscription.userId,
    topicId: subscription.topicId,
    scheduleType: "relative" as const,
    sendAtSecondsLocal: null,
    timeOffsetSeconds: subscription.schedule.timeOffsetSeconds,
    enabled: subscription.enabled ? 1 : 0,
    lastSentAt: subscription.lastSentAt
      ? DateTime.formatIso(subscription.lastSentAt)
      : null,
  };
};

const fromSubscriptionRow = Effect.fn("DatabaseOld.fromSubscriptionRow")(
  function* (row: typeof subscriptionsTable.$inferSelect) {
    if (row.scheduleType === "fixed") {
      if (row.sendAtSecondsLocal === null) {
        return yield* DatabaseInvariantError.make({
          operation: "DatabaseOld.fromSubscriptionRow",
          message: `fixed schedule missing sendAtSecondsLocal subscriptionId=${row.id}`,
        });
      }

      return yield* decodeOrFail(
        "DatabaseOld.fromSubscriptionRow.fixed",
        Subscription,
        {
          id: row.id,
          userId: row.userId,
          topicId: row.topicId,
          schedule: {
            type: "fixed",
            sendAtSecondsLocal: row.sendAtSecondsLocal,
          },
          enabled: row.enabled === 1,
          lastSentAt: row.lastSentAt,
        },
      );
    }

    if (row.timeOffsetSeconds === null) {
      return yield* DatabaseInvariantError.make({
        operation: "DatabaseOld.fromSubscriptionRow",
        message: `relative schedule missing timeOffsetSeconds subscriptionId=${row.id}`,
      });
    }

    return yield* decodeOrFail(
      "DatabaseOld.fromSubscriptionRow.relative",
      Subscription,
      {
        id: row.id,
        userId: row.userId,
        topicId: row.topicId,
        schedule: {
          type: "relative",
          timeOffsetSeconds: row.timeOffsetSeconds,
        },
        enabled: row.enabled === 1,
        lastSentAt: row.lastSentAt,
      },
    );
  },
);

export class DatabaseOld extends Effect.Service<DatabaseOld>()(
  "@dtpt/DatabaseOld",
  {
    effect: Effect.gen(function* () {
      const db = yield* Database;

      const loadUsers = Effect.fn("DatabaseOld.loadUsers")(function* () {
        const rows = yield* db
          .select()
          .from(usersTable)
          .orderBy(usersTable.id)
          .pipe(
            Effect.mapError((error) =>
              DatabaseQueryError.make({
                operation: "DatabaseOld.loadUsers",
                message: String(error),
              }),
            ),
          );

        return yield* decodeOrFail(
          "DatabaseOld.loadUsers",
          Schema.Array(User),
          rows,
        );
      });

      const loadSubscriptions = Effect.fn("DatabaseOld.loadSubscriptions")(
        function* () {
          const rows = yield* db
            .select()
            .from(subscriptionsTable)
            .orderBy(subscriptionsTable.id)
            .pipe(
              Effect.mapError((error) =>
                DatabaseQueryError.make({
                  operation: "DatabaseOld.loadSubscriptions",
                  message: String(error),
                }),
              ),
            );

          return yield* Effect.forEach(rows, fromSubscriptionRow);
        },
      );

      const loadTopic = Effect.fn("DatabaseOld.loadTopic")(function* (
        topicId: string,
      ) {
        const topicRow = yield* db
          .select()
          .from(topicsTable)
          .where(eq(topicsTable.id, topicId))
          .limit(1)
          .pipe(
            Effect.mapError((error) =>
              DatabaseQueryError.make({
                operation: "DatabaseOld.loadTopic",
                message: String(error),
              }),
            ),
          );

        const topic = topicRow[0];
        if (!topic) {
          return yield* DatabaseRecordNotFound.make({
            entity: "topic",
            id: topicId,
          });
        }

        const eventRows = yield* db
          .select()
          .from(eventsTable)
          .where(eq(eventsTable.topicId, topic.id))
          .orderBy(eventsTable.id)
          .pipe(
            Effect.mapError((error) =>
              DatabaseQueryError.make({
                operation: "DatabaseOld.loadTopic.events",
                message: String(error),
              }),
            ),
          );

        const events = yield* Effect.forEach(eventRows, (row) =>
          decodeOrFail("DatabaseOld.loadTopic.event", Event, row.event),
        );

        return yield* decodeOrFail("DatabaseOld.loadTopic", Topic, {
          id: topic.id,
          events,
        });
      });

      const updateSubscription = Effect.fn("DatabaseOld.updateSubscription")(
        function* (subscription: Subscription) {
          const row = toSubscriptionRow(subscription);

          yield* db
            .insert(subscriptionsTable)
            .values(row)
            .onConflictDoUpdate({
              target: subscriptionsTable.id,
              set: row,
            })
            .pipe(
              Effect.mapError((error) =>
                DatabaseQueryError.make({
                  operation: "DatabaseOld.updateSubscription",
                  message: String(error),
                }),
              ),
            );
        },
      );

      return { loadUsers, loadSubscriptions, loadTopic, updateSubscription };
    }),
  },
) {}
