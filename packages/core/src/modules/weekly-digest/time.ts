import { DateTime } from "effect";

import type { User } from "../users/schema.js";

const batchTimezone = DateTime.zoneMakeNamedUnsafe("America/New_York");

/** Cloudflare supplies the scheduled instant, so late execution keeps the same batch. */
export const isWeeklyDigestBatchTime = (now: DateTime.Utc) => {
  const parts = DateTime.toParts(DateTime.setZone(now, batchTimezone));
  return parts.weekDay === 1 && parts.hour === 9 && parts.minute === 0;
};

/** All recipients cover the batch's Monday–Sunday dates, at their local midnights. */
export const weeklyDigestWindow = (
  now: DateTime.Utc,
  timezone: User["timezone"],
) => {
  const monday = DateTime.startOf(
    DateTime.setZone(now, batchTimezone),
    "week",
    {
      weekStartsOn: 1,
    },
  );
  const fromLocal = DateTime.makeZonedUnsafe(DateTime.toParts(monday), {
    timeZone: timezone,
    adjustForTimeZone: true,
  });
  return {
    from: DateTime.toUtc(fromLocal),
    to: DateTime.toUtc(DateTime.add(fromLocal, { days: 7 })),
    weekStart: DateTime.formatIsoDate(monday),
  };
};
