import { DateTime } from "effect";

import type { User } from "../users/schema.js";

/** Calendar arithmetic keeps both bounds at local midnight across DST. */
export const weeklyDigestWindow = (
  now: DateTime.Utc,
  timezone: User["timezone"],
) => {
  const fromLocal = DateTime.startOf(DateTime.setZone(now, timezone), "week", {
    weekStartsOn: 1,
  });
  const sendAt = DateTime.setParts(fromLocal, { hour: 9 });
  const nowMs = DateTime.toEpochMillis(now);
  const sendAtMs = DateTime.toEpochMillis(sendAt);

  return {
    from: DateTime.toUtc(fromLocal),
    to: DateTime.toUtc(DateTime.add(fromLocal, { days: 7 })),
    weekStart: DateTime.formatIsoDate(fromLocal),
    sendAt: DateTime.toUtc(sendAt),
    // The quarter-hour cron gets four attempts, including fractional-offset zones.
    isDue: nowMs >= sendAtMs && nowMs < sendAtMs + 60 * 60 * 1_000,
  };
};
