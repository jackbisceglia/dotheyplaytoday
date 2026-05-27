import { DateTime, Duration } from "effect";

import type { User } from "../users/schema.js";
import type { Schedule, Subscription } from "./schema.js";

type Range<T> = {
  readonly from: T;
  readonly to: T;
};

const CONSTRAINTS = {
  due: {
    msLow: Duration.toMillis("1 minute"),
    msHigh: Duration.toMillis("5 minutes"),
  },
};

/**
 * Formats the calendar date that a UTC instant lands on in a user's timezone.
 * Use this for local-day comparisons, not as user-facing display copy.
 */
const formatLocalDate = (
  utc: DateTime.Utc,
  tz: User["timezone"],
) => DateTime.formatIsoDate(DateTime.setZone(utc, tz));

/**
 * Returns the UTC range for the local day containing `nowUtc`.
 * The range starts at the local day's midnight and ends at the next local
 * midnight. Use `from` as the inclusive lower bound and `to` as the exclusive
 * upper bound for event queries.
 */
const localDayUtcRange = (input: {
  readonly nowUtc: DateTime.Utc;
  readonly timezone: User["timezone"];
}): Range<DateTime.Utc> => {
  const zonedNow = DateTime.setZone(input.nowUtc, input.timezone);
  const fromLocal = DateTime.setParts(zonedNow, {
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const toLocal = DateTime.add(fromLocal, { days: 1 });

  return {
    from: DateTime.toUtc(fromLocal),
    to: DateTime.toUtc(toLocal),
  };
};

/**
 * Returns the UTC instant when a fixed-local subscription should send on the
 * local day containing `nowUtc`.
 */
const computeScheduleSendAtUtc = (input: {
  readonly schedule: Schedule;
  readonly timezone: User["timezone"];
  readonly nowUtc: DateTime.Utc;
}) => {
  const localDayStart = DateTime.setParts(
    DateTime.setZone(input.nowUtc, input.timezone),
    {
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    },
  );
  const sendAtLocal = DateTime.add(localDayStart, {
    seconds: input.schedule.sendAtSecondsLocal,
  });

  return DateTime.toUtc(sendAtLocal);
};

/**
 * Checks whether `nowUtc` is inside the accepted send window for a subscription.
 */
const isDue = (input: {
  readonly subscription: Subscription;
  readonly user: User;
  readonly nowUtc: DateTime.Utc;
}) => {
  const zonedNow = DateTime.setZone(input.nowUtc, input.user.timezone);
  // Send time is anchored from `now`, so early/late drift windows must check
  // the previous/current/next local days when they cross midnight.
  const candidates = [-1, 0, 1].map((days) =>
    computeScheduleSendAtUtc({
      schedule: input.subscription.schedule,
      timezone: input.user.timezone,
      nowUtc: DateTime.toUtc(DateTime.add(zonedNow, { days })),
    }),
  );

  return candidates.some((candidateUtc) => {
    const driftMs =
      DateTime.toEpochMillis(input.nowUtc) - DateTime.toEpochMillis(candidateUtc);

    return (
      driftMs >= -CONSTRAINTS.due.msLow && driftMs <= CONSTRAINTS.due.msHigh
    );
  });
};

/**
 * Checks whether the subscription was already sent on the same user-local date.
 */
const wasSentOnLocalDate = (input: {
  readonly lastSentAt: Subscription["lastSentAt"];
  readonly timezone: User["timezone"];
  readonly nowUtc: DateTime.Utc;
}) => {
  if (input.lastSentAt === null) return false;

  return (
    formatLocalDate(input.lastSentAt, input.timezone) ===
    formatLocalDate(input.nowUtc, input.timezone)
  );
};

export const SubscriptionTiming = {
  computeScheduleSendAtUtc,
  formatLocalDate,
  isDue,
  localDayUtcRange,
  wasSentOnLocalDate,
};
