import { eq } from "drizzle-orm";
import { Effect, ParseResult, Schema } from "effect";

import { Subscription, subscriptionsTable } from "../subscriptions/schema.js";
import { AllEvents, Event, eventsTable } from "../events/schema.js";
import { Topic, topicsTable } from "../topics/schema.js";
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

const encodeOrFail = Effect.fn("DatabaseOld.encodeOrFail")(function* <A, I>(
  operation: string,
  schema: Schema.Schema<A, I>,
  value: A,
) {
  return yield* Schema.encode(schema)(value).pipe(
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

const encodeSubscription = Effect.fn("DatabaseOld.encodeSubscription")(
  function* (subscription: Subscription) {
    return yield* encodeOrFail(
      "DatabaseOld.encodeSubscription",
      Subscription,
      subscription,
    );
  },
);

export type TopicWithEvents = Schema.Schema.Type<typeof TopicWithEvents>;
export const TopicWithEvents = Schema.Struct({
  ...Topic.fields,
  events: Schema.Array(AllEvents),
});

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

          return yield* decodeOrFail(
            "DatabaseOld.loadSubscriptions",
            Schema.Array(Subscription),
            rows,
          );
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

        const decodedTopic = yield* decodeOrFail(
          "DatabaseOld.loadTopic.topic",
          Topic,
          topic,
        );

        const decodedEventRows = yield* decodeOrFail(
          "DatabaseOld.loadTopic.eventRows",
          Schema.Array(Event),
          eventRows,
        );

        return yield* decodeOrFail("DatabaseOld.loadTopic", TopicWithEvents, {
          id: decodedTopic.id,
          _tag: decodedTopic._tag,
          title: decodedTopic.title,
          events: decodedEventRows.map((row) => row.data),
        });
      });

      const updateSubscription = Effect.fn("DatabaseOld.updateSubscription")(
        function* (subscription: Subscription) {
          const row = yield* encodeSubscription(subscription);

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
