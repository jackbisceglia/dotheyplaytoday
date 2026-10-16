import { Email } from "@dtpt/core/modules/email/service";
import { Events } from "@dtpt/core/modules/events/service";
import {
  Subscriptions,
  type NotificationRecipient,
} from "@dtpt/core/modules/subscriptions/service";
import { renderWeeklyDigest } from "@dtpt/core/modules/weekly-digest/email";
import { WeeklyDigest } from "@dtpt/core/modules/weekly-digest/schema";
import { weeklyDigestWindow } from "@dtpt/core/modules/weekly-digest/time";
import { Array, DateTime, Effect } from "effect";

import { NotifyOptions } from "../notify/index.js";

export const WeeklyDigestOptions = NotifyOptions;
export type WeeklyDigestOptions = NotifyOptions;

const renderCurrentDigest = Effect.fn("WeeklyDigestJob.renderCurrentDigest")(
  function* (
    group: Array.NonEmptyReadonlyArray<NotificationRecipient>,
    window: ReturnType<typeof weeklyDigestWindow>,
  ) {
    const events = yield* Events;
    const teams = yield* Effect.forEach(group, (recipient) =>
      Effect.gen(function* () {
        const subject = recipient.subscription.subject;
        return {
          subject,
          events: yield* events.listBySubject(subject.id, {
            range: { from: window.from, to: window.to },
          }),
        };
      }),
    );
    return yield* renderWeeklyDigest(
      WeeklyDigest.make({
        user: group[0].user,
        from: window.from,
        to: window.to,
        teams,
      }),
    );
  },
);

export const weeklyDigest = Effect.fn("WeeklyDigestJob")(function* (
  opts: WeeklyDigestOptions,
) {
  const subscriptions = yield* Subscriptions;
  const now = opts.now ?? (yield* DateTime.now);
  const recipients = yield* subscriptions.listNotificationRecipients();
  const selected = recipients.filter(
    (recipient) =>
      recipient.user.emailVerified &&
      (!opts.userEmail || recipient.user.email === opts.userEmail),
  );
  const groups = Array.groupBy(selected, (recipient) => recipient.user.id);

  yield* Effect.forEach(
    Object.values(groups),
    Effect.fn("WeeklyDigestJob.user")(
      function* (group) {
        const user = group[0].user;
        const window = weeklyDigestWindow(now, user.timezone);
        const identity = { userId: user.id, weekStart: window.weekStart };
        const rendered = yield* renderCurrentDigest(group, window);
        if (opts.dryRun) {
          yield* Effect.logInfo("weekly digest: dry-run", {
            ...identity,
            rendered,
          });
          return;
        }

        const email = yield* Email;
        yield* email.send(
          {
            recipient: user.email,
            idempotencyKey: `weekly-digest:${user.id}:${window.weekStart}`,
          },
          rendered,
        );
        yield* Effect.logInfo("weekly digest: sent", identity);
      },
      Effect.catchTags({
        WeeklyDigestRenderError: (error) =>
          Effect.logError("weekly digest: invalid game", error),
        EmailRequestError: (error) =>
          Effect.logError("weekly digest: delivery failed", error),
        EmailResponseError: (error) =>
          Effect.logError("weekly digest: delivery rejected", error),
      }),
      (effect, group) =>
        effect.pipe(Effect.annotateLogs({ userId: group[0].user.id })),
    ),
  );
});
