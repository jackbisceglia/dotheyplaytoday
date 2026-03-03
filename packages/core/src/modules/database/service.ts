import { KeyValueStore } from "@effect/platform";
import type * as PlatformError from "@effect/platform/Error";
import { Effect, Either, Match, Option, ParseResult, Schema } from "effect";

import { Subscription } from "../subscriptions/schema.js";
import { Topic } from "../topics/schema.js";
import { User } from "../users/schema.js";

const FsErrorPath = Schema.String;
const FsErrorMessage = Schema.String;

const fsErrorPayload = { path: FsErrorPath, message: FsErrorMessage };
const validationErrorPayload = {
  ...fsErrorPayload,
  issues: Schema.Array(Schema.ArrayFormatterIssue),
};

class DataFileNotFound extends Schema.TaggedError<DataFileNotFound>()(
  "DataFileNotFound",
  { path: FsErrorPath },
) {}

class DataReadError extends Schema.TaggedError<DataReadError>()(
  "DataReadError",
  fsErrorPayload,
) {}

class DataValidationError extends Schema.TaggedError<DataValidationError>()(
  "DataValidationError",
  validationErrorPayload,
) {}

class DataWriteError extends Schema.TaggedError<DataWriteError>()(
  "DataWriteError",
  fsErrorPayload,
) {}

const formatParseError = (error: ParseResult.ParseError) => ({
  message: ParseResult.TreeFormatter.formatErrorSync(error),
  issues: ParseResult.ArrayFormatter.formatErrorSync(error),
});

const makeValidationError = (key: string, error: ParseResult.ParseError) => {
  const parsed = formatParseError(error);

  return DataValidationError.make({
    path: key,
    message: parsed.message,
    issues: parsed.issues,
  });
};

type WithDecodeOptions<A, I> = {
  key: string;
  schema: Schema.Schema<A, I>;
  run: () => Effect.Effect<Option.Option<string>, PlatformError.PlatformError>;
};

export class Database extends Effect.Service<Database>()("@dtpt/Database", {
  effect: Effect.gen(function* () {
    const kv = yield* KeyValueStore.KeyValueStore;
    const keys = {
      users: "users",
      subscriptions: "subscriptions",
      topic: (topicId: string) => `topics/${topicId}`,
    };

    const withDecode = Effect.fn("Database.withDecode")(function* <A, I>(
      opts: WithDecodeOptions<A, I>,
    ) {
      const content = yield* opts
        .run()
        .pipe(
          Effect.mapError((error) =>
            DataReadError.make({ path: opts.key, message: error.message }),
          ),
        );

      if (Option.isNone(content)) {
        return yield* DataFileNotFound.make({ path: opts.key });
      }

      const fromJson = Schema.parseJson(opts.schema);

      return yield* Schema.decodeUnknown(fromJson)(content.value).pipe(
        Effect.mapError((error) => makeValidationError(opts.key, error)),
      );
    });

    const loadUsers = () =>
      withDecode({
        key: keys.users,
        schema: Schema.Array(User),
        run: () => kv.get(keys.users),
      });

    const loadSubscriptions = () =>
      withDecode({
        key: keys.subscriptions,
        schema: Schema.Array(Subscription),
        run: () => kv.get(keys.subscriptions),
      });

    const Events = Topic.pick("events");

    const loadTopic = Effect.fn("Database.loadTopic")(function* (
      topicId: string,
    ) {
      const key = keys.topic(topicId);
      const json = yield* withDecode({
        key,
        schema: Events,
        run: () => kv.get(key),
      });

      return { id: topicId, events: json.events };
    });

    const updateSubscription = Effect.fn("Database.updateSubscription")(
      function* (subscription: Subscription) {
        const Subscriptions = Schema.Array(Subscription);
        const fromJson = Schema.parseJson(Subscriptions);
        const decodeUnknownEither = Schema.decodeUnknownEither(fromJson);
        const encodeUnknownEither = Schema.encodeUnknownEither(fromJson);
        let validationError: DataValidationError | undefined;

        const updated = yield* kv
          .modify(keys.subscriptions, (encodedSubscriptions) => {
            const decoded = decodeUnknownEither(encodedSubscriptions);

            if (Either.isLeft(decoded)) {
              validationError = makeValidationError(
                keys.subscriptions,
                decoded.left,
              );
              return encodedSubscriptions;
            }

            const subscriptions = decoded.right;
            const index = subscriptions.findIndex(
              (e) => e.id === subscription.id,
            );

            const nextSubscriptions = Match.value(index).pipe(
              Match.when(-1, () => [...subscriptions, subscription]),
              Match.orElse((index) =>
                subscriptions.map((e, eIndex) => {
                  if (eIndex === index) return subscription;

                  return e;
                }),
              ),
            );

            const encoded = encodeUnknownEither(nextSubscriptions);

            if (Either.isLeft(encoded)) {
              validationError = makeValidationError(
                keys.subscriptions,
                encoded.left,
              );
              return encodedSubscriptions;
            }

            return encoded.right;
          })
          .pipe(
            Effect.mapError((error) =>
              DataWriteError.make({
                path: keys.subscriptions,
                message: error.message,
              }),
            ),
          );

        if (validationError) {
          return yield* validationError;
        }

        if (Option.isNone(updated)) {
          return yield* DataFileNotFound.make({ path: keys.subscriptions });
        }
      },
    );

    return { loadUsers, loadSubscriptions, loadTopic, updateSubscription };
  }),
}) {}
