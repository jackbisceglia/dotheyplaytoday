import {
  Events,
  type EventWithParticipants,
  Notification,
  type NotificationRecipient,
  Notifier,
  Subscription,
  Subscriptions,
  SubscriptionTiming,
  type User,
} from "@dtpt/core-v2";
import { Array, Data, DateTime, Effect, Option } from "effect";

type WorkflowStep = "send" | "mark-sent";

type NotifyContext = {
  readonly subscription: NotificationRecipient["subscription"]["id"];
  readonly user: NotificationRecipient["user"]["email"];
  readonly subject: NotificationRecipient["subscription"]["subject"]["id"];
};

class NotifySkipped extends Data.TaggedError("NotifyJobSkipped")<
  NotifyContext & { readonly reason: "not-due" | "already-sent" | "no-events" }
> {}

class NotifyFailed extends Data.TaggedError("NotifyJobFailed")<
  NotifyContext & { readonly step: WorkflowStep; readonly error: unknown }
> {}

const assertIsDueNow = Effect.fn("assertIsDueNow")(function* (
  subscription: Subscription,
  user: User,
  nowUtc: DateTime.Utc,
  context: NotifyContext,
) {
  const isDue = SubscriptionTiming.isDue({ nowUtc, subscription, user });

  if (!isDue) {
    return yield* new NotifySkipped({ ...context, reason: "not-due" });
  }
});

const assertNotSentToday = Effect.fn("assertNotSentToday")(function* (
  subscription: Subscription,
  user: User,
  nowUtc: DateTime.Utc,
  context: NotifyContext,
) {
  const wasSentToday = SubscriptionTiming.wasSentOnLocalDate({
    lastSentAt: subscription.lastSentAt,
    nowUtc,
    timezone: user.timezone,
  });

  if (wasSentToday) {
    return yield* new NotifySkipped({ reason: "already-sent", ...context });
  }
});

const requireHasEventsToday = Effect.fn("assertHasEventsToday")(function* (
  events: readonly EventWithParticipants[],
  context: NotifyContext,
) {
  const hasElements = Array.isReadonlyArrayNonEmpty(events);

  if (!hasElements) {
    return yield* new NotifySkipped({ reason: "no-events", ...context });
  }

  return events;
});

const notifyOneRecipient = Effect.fn("Notify.notifyOneRecipient")(
  function* (
    recipient: NotificationRecipient,
    now: DateTime.Utc,
    opts: { readonly dryRun: boolean; readonly force: boolean },
  ) {
    const subscriptions = yield* Subscriptions;
    const events = yield* Events;
    const notifier = yield* Notifier;

    const { subscription, user } = recipient;

    const ctx: NotifyContext = {
      subscription: subscription.id,
      user: user.email,
      subject: subscription.subject.id,
    };

    if (!opts.force) {
      yield* assertIsDueNow(subscription, user, now, ctx);
      yield* assertNotSentToday(subscription, user, now, ctx);
    }

    const range = SubscriptionTiming.localDayUtcRange({
      nowUtc: now,
      timezone: user.timezone,
    });

    const eventsToday = yield* events.listBySubject(subscription.subject.id, {
      range,
    });

    const eventsToInclude = yield* requireHasEventsToday(eventsToday, ctx);

    const toSendAt = SubscriptionTiming.computeScheduleSendAtUtc({
      nowUtc: now,
      schedule: subscription.schedule,
      timezone: user.timezone,
    });

    const notification = Notification.make({
      sendAt: toSendAt,
      user,
      subscription,
      subject: subscription.subject,
      events: eventsToInclude,
    });

    yield* notifier
      .deliver(notification)
      .pipe(
        Effect.mapError(
          (error) => new NotifyFailed({ ...ctx, error, step: "send" }),
        ),
      );

    if (!opts.dryRun) {
      yield* subscriptions
        .markSent({ subscriptionId: subscription.id, sentAt: now })
        .pipe(
          Effect.mapError(
            (error) => new NotifyFailed({ ...ctx, error, step: "mark-sent" }),
          ),
        );
    }
  },
  Effect.catchTags({
    NotifyJobSkipped: (e) =>
      Effect.logInfo("Skipping Recipient", {
        reason: e.reason,
        subscription: e.subscription,
        user: e.user,
        subject: e.subject,
      }),
    NotifyJobFailed: (e) =>
      Effect.logError(`Recipient failed on ${e.step} `, {
        subscription: e.subscription,
        user: e.user,
        subject: e.subject,
        error: e.error,
      }),
  }),
);

export type NotifyOptions = {
  readonly dryRun?: boolean;
  readonly force?: boolean;
  readonly userEmail?: User["email"];
  readonly now?: DateTime.Utc;
};

export const notify = Effect.fn("Notify")(function* (opts: NotifyOptions) {
  const subscriptions = yield* Subscriptions;

  const targetUser = Option.fromNullishOr(opts.userEmail);
  const now = opts.now ?? (yield* DateTime.now);

  const recipients = yield* subscriptions.listNotificationRecipients();
  const toProcess = targetUser.pipe(
    Option.match({
      onNone: () => recipients,
      onSome: (e) => Array.filter(recipients, (r) => r.user.email === e),
    }),
  );

  yield* Effect.logInfo("loaded", {
    recipients: recipients.length,
    selected: toProcess.length,
  });

  yield* Effect.forEach(toProcess, (recipient) =>
    notifyOneRecipient(recipient, now, {
      dryRun: opts.dryRun ?? false,
      force: opts.force ?? false,
    }),
  );
});
