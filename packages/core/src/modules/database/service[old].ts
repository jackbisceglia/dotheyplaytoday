import { KeyValueStore } from "@effect/platform";
import type * as PlatformError from "@effect/platform/Error";
import { Effect, Either, Match, Option, Schema } from "effect";

import {
  DataFileNotFound,
  DataReadError,
  DataValidationError,
  DataWriteError,
  makeDataValidationError,
} from "./service.js";

import { Subscription } from "../subscriptions/schema.js";
import { Topic } from "../topics/schema.js";
import { User } from "../users/schema.js";

type WithDecodeOptions<A, I> = {
  key: string;
  schema: Schema.Schema<A, I>;
  run: () => Effect.Effect<Option.Option<string>, PlatformError.PlatformError>;
};

export class DatabaseOld extends Effect.Service<DatabaseOld>()(
  "@dtpt/DatabaseOld",
  {
    effect: Effect.gen(function* () {
      const kv = yield* KeyValueStore.KeyValueStore;
      const keys = {
        users: "users",
        subscriptions: "subscriptions",
        topic: (topicId: string) => `topics/${topicId}`,
      };

      const withDecode = Effect.fn("DatabaseOld.withDecode")(function* <A, I>(
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
          Effect.mapError((error) => makeDataValidationError(opts.key, error)),
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

      const loadTopic = Effect.fn("DatabaseOld.loadTopic")(function* (
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

      const updateSubscription = Effect.fn("DatabaseOld.updateSubscription")(
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
                validationError = makeDataValidationError(
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
                validationError = makeDataValidationError(
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
  },
) {}
