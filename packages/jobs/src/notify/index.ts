import { Command, HelpDoc, Options, ValidationError } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import {
  createDatabaseLayer,
  DatabaseLayer as DatabaseLayerDefault,
} from "@dtpt/core/modules/database/service";
import { DatabaseOld } from "@dtpt/core/modules/database/service-old";
import type {
  NotifierRequestError,
  NotifierResponseError,
} from "@dtpt/core/modules/notifier/errors";
import { Notifier } from "@dtpt/core/modules/notifier";
import { NotifierLayerEmail } from "@dtpt/core/modules/notifier/email/index";
import { EmailProviderLayerResend } from "@dtpt/core/modules/notifier/email/resend/index";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { Subscription } from "@dtpt/core/modules/subscriptions/schema";
import { localDateFromUtc } from "@dtpt/core/modules/subscriptions/time";
import { EmailAddress, User } from "@dtpt/core/modules/users/schema";
import {
  Array,
  Config,
  DateTime,
  Effect,
  Layer,
  Match,
  Number,
  Option,
  Order,
  Schema,
} from "effect";

import { DotEnvConfigProvider } from "../lib/env.js";

export type NotifyOptions = {
  dryRun: boolean;
  ignoreAlreadySent?: boolean;
  ignoreSubscriptionTiming?: boolean;
  devUserEmail?: string;
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

const getNotifierLayer = (dryRun: boolean) => {
  const NotifierLive = () =>
    NotifierLayerEmail.pipe(Layer.provide(EmailProviderLayerResend.layer));

  const NotifierDryRun = () =>
    Layer.succeed(Notifier, Notifier.of({ send: () => Effect.void }));

  return dryRun ? NotifierDryRun() : NotifierLive();
};

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
  const database = yield* DatabaseOld;
  const subscriptions = yield* Subscriptions;
  const notifier = yield* Notifier;
  const now = opts.now ?? (yield* DateTime.now);
  const ignoreAlreadySent = opts.ignoreAlreadySent ?? false;
  const ignoreSubscriptionTiming = opts.ignoreSubscriptionTiming ?? false;
  const devUserEmail = Option.fromNullable(opts.devUserEmail).pipe(
    Option.map((email) => email.trim().toLowerCase()),
    Option.filter((email) => email.length > 0),
  );

  yield* Effect.logInfo(
    `notify: start dryRun=${String(opts.dryRun)} ignoreAlreadySent=${String(ignoreAlreadySent)} ignoreSubscriptionTiming=${String(ignoreSubscriptionTiming)} now=${DateTime.formatIso(now)}`,
  );

  const [allUsers, allSubscriptions] = yield* Effect.all([
    database.loadUsers(),
    database.loadSubscriptions(),
  ]);

  const usersById = new Map(allUsers.map((user) => [user.id, user]));

  let subscriptionsToProcess = allSubscriptions;
  if (Option.isSome(devUserEmail)) {
    subscriptionsToProcess = allSubscriptions.filter((subscription) => {
      const user = usersById.get(subscription.userId);
      return user?.email.toLowerCase() === devUserEmail.value;
    });
  }

  yield* Effect.logInfo(
    `notify: loaded users=${allUsers.length.toString()} subscriptions=${allSubscriptions.length.toString()}`,
  );

  yield* Effect.forEach(
    subscriptionsToProcess,
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

        if (subscription.schedule._tag === "relative") {
          return yield* new NotifyRelativeUnimplemented({
            subscriptionId,
            topicId: subscription.topicId,
          });
        }

        const isDue = subscriptions.isDue({ subscription, user, now });
        if (!isDue && !ignoreSubscriptionTiming) {
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

        const sortedEvents = Array.sort(
          events,
          Order.mapInput(Number.Order, (event: (typeof events)[number]) =>
            DateTime.toEpochMillis(event.startUtc),
          ),
        );

        const headline = `${sortedEvents[0].teamName} ${sortedEvents[0].site === "home" ? "vs." : "@"} ${sortedEvents[0].opponent}`;

        if (opts.dryRun) {
          return yield* new NotifyDryRun({
            subscriptionId,
            topicId: subscription.topicId,
            headline,
            target,
            eventCount: sortedEvents.length,
          });
        }

        yield* notifier.send(user, sortedEvents).pipe(
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
          eventCount: sortedEvents.length,
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
    `notify: done processed=${subscriptionsToProcess.length.toString()}`,
  );
});

const devUserEnvError = ValidationError.invalidValue(
  HelpDoc.p(
    "--use-dev-user env requires USER_EMAIL to be set to a valid email",
  ),
);

const DevEnvUserConfig = Config.string("USER_EMAIL").pipe(
  Effect.mapError(() => devUserEnvError),
  Effect.flatMap((email) =>
    Schema.decodeUnknown(EmailAddress)(email).pipe(
      Effect.mapError(() => devUserEnvError),
    ),
  ),
);

const useDevUserOption = Options.text("use-dev-user").pipe(
  Options.withSchema(Schema.Union(EmailAddress, Schema.Literal("env"))),
  Options.optional,
  Options.mapEffect((value) =>
    Option.match(value, {
      onNone: () => Effect.succeed(Option.none<string>()),
      onSome: (input) =>
        Match.value(input).pipe(
          Match.when("env", () =>
            DevEnvUserConfig.pipe(Effect.map((email) => Option.some(email))),
          ),
          Match.orElse((email) => Effect.succeed(Option.some(email))),
        ),
    }),
  ),
  Options.withDescription(
    "Limit notifications to one user (email or 'env' to use USER_EMAIL)",
  ),
);

const NotifyCommand = Command.make(
  "notify",
  {
    dryRun: Options.boolean("dry-run"),
    ignoreAlreadySent: Options.boolean("ignore-already-sent"),
    ignoreSubscriptionTiming: Options.boolean("ignore-subscription-timing"),
    dbUrl: Options.text("db-url").pipe(
      Options.optional,
      Options.withDescription(
        "Override sqlite database file path or URL for this run",
      ),
    ),
    useDevUser: useDevUserOption,
  },
  (opts) =>
    Effect.gen(function* () {
      const dbUrl = Option.getOrUndefined(opts.dbUrl);
      const nodeEnv = process.env.NODE_ENV;
      const railwayEnv = process.env.RAILWAY_ENVIRONMENT_NAME;
      const env = railwayEnv === "" ? nodeEnv : (railwayEnv ?? nodeEnv);

      const DatabaseLayer = dbUrl
        ? createDatabaseLayer(dbUrl)
        : DatabaseLayerDefault;

      const notifyOptions: NotifyOptions = {
        dryRun: opts.dryRun,
        ignoreAlreadySent: opts.ignoreAlreadySent,
        ignoreSubscriptionTiming: opts.ignoreSubscriptionTiming,
        ...(Option.isSome(opts.useDevUser)
          ? { devUserEmail: opts.useDevUser.value }
          : {}),
      };

      const ProgramLayer = Layer.mergeAll(
        getNotifierLayer(opts.dryRun),
        DatabaseOld.Default,
        Subscriptions.Default,
      ).pipe(
        Layer.provideMerge(DatabaseLayer),
        Layer.provideMerge(NodeContext.layer),
      );

      yield* Effect.logInfo(
        `notify: sqlite selection NODE_ENV=${nodeEnv ?? "undefined"} RAILWAY_ENVIRONMENT_NAME=${railwayEnv ?? "undefined"} env=${env ?? "undefined"} dbUrl=${dbUrl ?? "none"}`,
      );

      return yield* notify(notifyOptions).pipe(Effect.provide(ProgramLayer));
    }),
);

const Notify = Command.run(NotifyCommand, {
  name: "jobs:notify",
  version: "0.0.0",
});

function main() {
  Notify(process.argv).pipe(
    Effect.provide(
      DotEnvConfigProvider.pipe(Layer.provideMerge(NodeContext.layer)),
    ),
    NodeRuntime.runMain,
  );
}

if (import.meta.main) {
  main();
}

export default main;
