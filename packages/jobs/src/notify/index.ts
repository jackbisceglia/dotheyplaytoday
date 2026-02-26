import { pathToFileURL } from "node:url";

import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Database } from "@dtpt/core/modules/database/service";
import type {
  NotifierRequestError,
  NotifierResponseError,
} from "@dtpt/core/modules/notifier/providers/service";
import { Notifier } from "@dtpt/core/modules/notifier/service";
import { ResendProvider } from "@dtpt/core/modules/notifier/providers/resend/service";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { Subscription } from "@dtpt/core/modules/subscriptions/schema";
import { localDateFromUtc } from "@dtpt/core/modules/subscriptions/time";
import { User } from "@dtpt/core/modules/users/schema";
import { Array, DateTime, Effect, Layer, Schema } from "effect";

import { createConfigProviderFromDotEnv } from "@dtpt/core/lib/effect/config";

export type NotifyOptions = {
  dryRun: boolean;
  ignoreAlreadySent?: boolean;
  now?: DateTime.Utc;
};

class NotifyUserNotFound extends Schema.TaggedError<NotifyUserNotFound>()(
  "NotifyUserNotFound",
  {
    subscriptionId: Subscription.fields.id,
    topicId: Subscription.fields.topicId,
    userId: User.fields.id,
  },
) {}

class NotifySubscriptionDisabled extends Schema.TaggedError<NotifySubscriptionDisabled>()(
  "NotifySubscriptionDisabled",
  {
    subscriptionId: Subscription.fields.id,
    topicId: Subscription.fields.topicId,
  },
) {}

class NotifyRelativeUnimplemented extends Schema.TaggedError<NotifyRelativeUnimplemented>()(
  "NotifyRelativeUnimplemented",
  {
    subscriptionId: Subscription.fields.id,
    topicId: Subscription.fields.topicId,
  },
) {}

class NotifySubscriptionAlreadySent extends Schema.TaggedError<NotifySubscriptionAlreadySent>()(
  "NotifySubscriptionAlreadySent",
  {
    subscriptionId: Subscription.fields.id,
    topicId: Subscription.fields.topicId,
  },
) {}

class NotifySubscriptionNotDue extends Schema.TaggedError<NotifySubscriptionNotDue>()(
  "NotifySubscriptionNotDue",
  {
    subscriptionId: Subscription.fields.id,
    topicId: Subscription.fields.topicId,
  },
) {}

class NotifyDryRun extends Schema.TaggedError<NotifyDryRun>()("NotifyDryRun", {
  subscriptionId: Subscription.fields.id,
  topicId: Subscription.fields.topicId,
  headline: Schema.String,
  target: Schema.String,
  eventCount: Schema.Number,
}) {}

class NotifyNoEvents extends Schema.TaggedError<NotifyNoEvents>()(
  "NotifyNoEvents",
  {
    subscriptionId: Subscription.fields.id,
    topicId: Subscription.fields.topicId,
    target: Schema.String,
  },
) {}

const logs = {
  features: {
    relativeUnimplemented: (error: NotifyRelativeUnimplemented) =>
      `notify: skip relative subscription=${error.subscriptionId} topic=${error.topicId}`,
    dryRun: (error: NotifyDryRun) =>
      `notify: dry-run would send subscription=${error.subscriptionId} topic=${error.topicId} target=${error.target} events=${error.eventCount.toString()} headline="${error.headline}"`,
  },
  subscription: {
    disabled: (error: NotifySubscriptionDisabled) =>
      `notify: skip disabled subscription=${error.subscriptionId} topic=${error.topicId}`,
    notDue: (error: NotifySubscriptionNotDue) =>
      `notify: skip not due subscription=${error.subscriptionId} topic=${error.topicId}`,
    alreadySent: (error: NotifySubscriptionAlreadySent) =>
      `notify: skip already sent today subscription=${error.subscriptionId} topic=${error.topicId}`,
    noEvents: (error: NotifyNoEvents) =>
      `notify: skip no events subscription=${error.subscriptionId} topic=${error.topicId} target=${error.target}`,
  },
  notifier: {
    requestError: (error: NotifierRequestError) =>
      `notify: send failed channel=${error.channel} error=${error.message}`,
    responseError: (error: NotifierResponseError) =>
      `notify: send failed channel=${error.channel} error=${error.message} code=${error.code} status=${String(error.statusCode)}`,
  },
  user: {
    notFound: (error: NotifyUserNotFound) =>
      `notify: user ${error.userId} not found for subscription=${error.subscriptionId} topic=${error.topicId}`,
  },
};

export const notify = Effect.fn("notify")(function* (opts: NotifyOptions) {
  const database = yield* Database;
  const subscriptions = yield* Subscriptions;
  const notifier = yield* Notifier;
  const now = opts.now ?? (yield* DateTime.now);
  const ignoreAlreadySent = opts.ignoreAlreadySent ?? false;

  yield* Effect.logInfo(
    `notify: start dryRun=${String(opts.dryRun)} ignoreAlreadySent=${String(ignoreAlreadySent)} now=${DateTime.formatIso(now)}`,
  );

  const [allUsers, allSubscriptions] = yield* Effect.all([
    database.loadUsers(),
    database.loadSubscriptions(),
  ]);

  const usersById = new Map(allUsers.map((user) => [user.id, user]));

  yield* Effect.logInfo(
    `notify: loaded users=${allUsers.length.toString()} subscriptions=${allSubscriptions.length.toString()}`,
  );

  yield* Effect.forEach(
    allSubscriptions,
    Effect.fn(
      function* (subscription) {
        const subscriptionId = subscription.id;
        const user = usersById.get(subscription.userId);

        if (!user) {
          return yield* new NotifyUserNotFound({
            subscriptionId,
            topicId: subscription.topicId,
            userId: subscription.userId,
          });
        }

        if (!subscription.enabled) {
          return yield* new NotifySubscriptionDisabled({
            subscriptionId,
            topicId: subscription.topicId,
          });
        }

        if (subscription.schedule.type === "relative") {
          return yield* new NotifyRelativeUnimplemented({
            subscriptionId,
            topicId: subscription.topicId,
          });
        }

        const isDue = subscriptions.isDue({ subscription, user, now });
        if (!isDue) {
          return yield* new NotifySubscriptionNotDue({
            subscriptionId,
            topicId: subscription.topicId,
          });
        }

        const isAlreadySentToday = subscriptions.isAlreadySentToday({
          lastSentAt: subscription.lastSentAt,
          tz: user.timezone,
          now,
        });
        if (isAlreadySentToday && !ignoreAlreadySent) {
          return yield* new NotifySubscriptionAlreadySent({
            subscriptionId,
            topicId: subscription.topicId,
          });
        }

        const target = localDateFromUtc(now, user.timezone);
        const events = yield* subscriptions.getDueEvents({
          user,
          subscription,
          target,
        });

        if (!Array.isNonEmptyArray(events)) {
          return yield* new NotifyNoEvents({
            subscriptionId,
            topicId: subscription.topicId,
            target,
          });
        }

        const headline = `${events[0].teamName} ${events[0].site === "home" ? "vs." : "@"} ${events[0].opponent}`;

        if (opts.dryRun) {
          return yield* new NotifyDryRun({
            subscriptionId,
            topicId: subscription.topicId,
            headline,
            target,
            eventCount: events.length,
          });
        }

        yield* notifier.send(user, events).pipe(
          Effect.zipRight(
            database.updateSubscription({
              ...subscription,
              lastSentAt: now,
            }),
          ),
        );

        return {
          subscriptionId,
          topicId: subscription.topicId,
          user,
          eventCount: events.length,
          headline,
        };
      },
      Effect.tap((data) =>
        Effect.logInfo(
          `notify: sent subscription=${data.subscriptionId} topic=${data.topicId} user=${data.user.email} events=${data.eventCount.toString()} headline="${data.headline}"`,
        ),
      ),
      Effect.catchTags({
        NotifyUserNotFound: (error) =>
          Effect.logWarning(logs.user.notFound(error)),
        NotifySubscriptionDisabled: (error) =>
          Effect.logInfo(logs.subscription.disabled(error)),
        NotifyRelativeUnimplemented: (error) =>
          Effect.logInfo(logs.features.relativeUnimplemented(error)),
        NotifySubscriptionNotDue: (error) =>
          Effect.logInfo(logs.subscription.notDue(error)),
        NotifySubscriptionAlreadySent: (error) =>
          Effect.logInfo(logs.subscription.alreadySent(error)),
        NotifyDryRun: (error) => Effect.logInfo(logs.features.dryRun(error)),
        NotifyNoEvents: (error) =>
          Effect.logInfo(logs.subscription.noEvents(error)),
        NotifierRequestError: (error) =>
          Effect.logError(logs.notifier.requestError(error)),
        NotifierResponseError: (error) =>
          Effect.logError(logs.notifier.responseError(error)),
      }),
    ),
    { discard: true },
  );

  yield* Effect.logInfo(
    `notify: done processed=${allSubscriptions.length.toString()}`,
  );
});

export const runNotifyJob = notify;

const getNotifierLayer = (dryRun: boolean) => {
  const NotifierLive = Notifier.Default.pipe(
    Layer.provide(ResendProvider.Default),
  );

  const NotifierDryRun = Layer.succeed(
    Notifier,
    Notifier.make({ send: () => Effect.void }),
  );

  return dryRun ? NotifierDryRun : NotifierLive;
};

const DotEnvConfigProvider = createConfigProviderFromDotEnv("../../.env");

function main() {
  const opts = process.argv.slice(2);
  const dryRun = opts.includes("--dry-run");
  const ignoreAlreadySent = opts.includes("--ignore-already-sent");

  const ProgramLayer = Layer.mergeAll(
    getNotifierLayer(dryRun),
    Database.Default,
    Subscriptions.Default,
  ).pipe(
    Layer.provide(DotEnvConfigProvider),
    Layer.provideMerge(NodeContext.layer),
  );

  NodeRuntime.runMain(
    notify({ dryRun, ignoreAlreadySent }).pipe(Effect.provide(ProgramLayer)),
  );
}

export default main;

const isMain =
  typeof process.argv[1] === "string" &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  main();
}
