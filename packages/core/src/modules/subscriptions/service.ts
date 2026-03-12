import { Array, Effect, Schema } from "effect";
import { randomUUID } from "node:crypto";

import { DatabaseNew } from "../database-new/service.js";
import { Topic } from "../topics/schema.js";
import { isTopicCountAllowedByTier, topicCapByTier } from "./policy.js";
import type { Subscription } from "./schema.js";
import { Subscription as SubscriptionSchema } from "./schema.js";

type ReplaceForUserOptions = {
  userId: Subscription["userId"];
  topicIds: readonly Subscription["topicId"][];
  schedule: Extract<Subscription["schedule"], { type: "fixed" }>;
};

class SubscriptionTopicNotFound extends Schema.TaggedError<SubscriptionTopicNotFound>()(
  "SubscriptionTopicNotFound",
  { topicId: Schema.String },
) {}

class SubscriptionTopicLimitExceeded extends Schema.TaggedError<SubscriptionTopicLimitExceeded>()(
  "SubscriptionTopicLimitExceeded",
  { limit: Schema.Int, count: Schema.Int },
) {}

const SubscriptionsCollection = Schema.Array(SubscriptionSchema);
const TopicEvents = Topic.pick("events");

export class Subscriptions extends Effect.Service<Subscriptions>()(
  "@dtpt/Subscriptions",
  {
    dependencies: [DatabaseNew.Default],
    effect: Effect.gen(function* () {
      const database = yield* DatabaseNew;

      const loadSubscriptions = Effect.fn("Subscriptions.loadSubscriptions")(
        function* () {
          return yield* database
            .getWithSchema({
              query: database.queries.subscriptions,
              schema: SubscriptionsCollection,
            })
            .pipe(
              Effect.catchTag("DataFileNotFound", () =>
                Effect.succeed([] as Subscription[]),
              ),
            );
        },
      );

      const persistSubscriptions = Effect.fn(
        "Subscriptions.persistSubscriptions",
      )(function* (subscriptions: readonly Subscription[]) {
        yield* database.setWithSchema({
          query: database.queries.subscriptions,
          schema: SubscriptionsCollection,
          value: [...subscriptions],
        });
      });

      const getAllByUserId = Effect.fn("Subscriptions.getAllByUserId")(
        function* (userId: Subscription["userId"]) {
          const subscriptions = yield* loadSubscriptions();

          return subscriptions.filter((s) => s.userId === userId);
        },
      );

      const removeAllByUserId = Effect.fn("Subscriptions.removeAllByUserId")(
        function* (userId: Subscription["userId"]) {
          const subscriptions = yield* loadSubscriptions();

          yield* persistSubscriptions(
            subscriptions.filter((s) => s.userId !== userId),
          );
        },
      );

      const replaceForUser = Effect.fn("Subscriptions.replaceForUser")(
        function* (opts: ReplaceForUserOptions) {
          const topicIds = Array.dedupe(opts.topicIds);

          if (!isTopicCountAllowedByTier("free", topicIds.length)) {
            return yield* SubscriptionTopicLimitExceeded.make({
              limit: topicCapByTier.free,
              count: topicIds.length,
            });
          }

          const subscriptions = yield* loadSubscriptions();
          const nextUserSubscriptions = yield* Effect.forEach(
            topicIds,
            (topicId) =>
              database
                .getWithSchema({
                  query: database.queries.topic(topicId),
                  schema: TopicEvents,
                })
                .pipe(
                  Effect.catchTag("DataFileNotFound", () =>
                    SubscriptionTopicNotFound.make({ topicId }),
                  ),
                  Effect.map(() => {
                    const retained = subscriptions.find(
                      (s) => s.userId === opts.userId && s.topicId === topicId,
                    );

                    return retained === undefined
                      ? SubscriptionSchema.make({
                          id: Schema.decodeUnknownSync(
                            SubscriptionSchema.fields.id,
                          )(randomUUID()),
                          userId: opts.userId,
                          topicId,
                          schedule: opts.schedule,
                          enabled: true,
                          lastSentAt: null,
                        })
                      : SubscriptionSchema.make({
                          ...retained,
                          schedule: opts.schedule,
                          enabled: true,
                        });
                  }),
                ),
            { concurrency: "unbounded" },
          );
          const nextSubscriptions = [
            ...subscriptions.filter((s) => s.userId !== opts.userId),
            ...nextUserSubscriptions,
          ];

          yield* persistSubscriptions(nextSubscriptions);

          return nextUserSubscriptions;
        },
      );

      return {
        getAllByUserId,
        replaceForUser,
        removeAllByUserId,
      };
    }),
  },
) {}
