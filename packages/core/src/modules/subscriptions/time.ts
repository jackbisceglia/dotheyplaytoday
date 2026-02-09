import { DateTime, Duration } from "effect";

import type { User } from "../users/schema";
import type { Subscription } from "./schema";

export type LocalDate = ReturnType<typeof DateTime.formatIsoDate>;

type GetScheduledSendOptions = {
  sendAtSecondsLocal: number;
  tz: User["timezone"];
  now: DateTime.Utc;
};

type IsDueOptions = {
  subscription: Subscription;
  user: User;
  now: DateTime.Utc;
};

type IsAlreadySentTodayOptions = {
  lastSentAt: Subscription["lastSentAt"];
  tz: User["timezone"];
  now: DateTime.Utc;
};

const constants = {
  dueToleranceMs: Duration.toMillis("60000 millis"),
};

export const localDateFromUtc = (utc: DateTime.Utc, tz: User["timezone"]) =>
  DateTime.formatIsoDate(DateTime.setZone(utc, tz));

export const getScheduledSend = (opts: GetScheduledSendOptions) => {
  const zonedNow = DateTime.setZone(opts.now, opts.tz);
  const timeParts = Duration.parts(Duration.seconds(opts.sendAtSecondsLocal));

  return DateTime.setParts(zonedNow, {
    ...timeParts,
    millis: 0,
  });
};

export const isDue = (opts: IsDueOptions) => {
  if (opts.subscription.schedule.type === "relative") return false;

  const sendAtUtc = DateTime.toUtc(
    getScheduledSend({
      sendAtSecondsLocal: opts.subscription.schedule.sendAtSecondsLocal,
      tz: opts.user.timezone,
      now: opts.now,
    }),
  );

  return Duration.lessThanOrEqualTo(
    DateTime.distanceDuration(opts.now, sendAtUtc),
    constants.dueToleranceMs,
  );
};

export const isAlreadySentToday = (opts: IsAlreadySentTodayOptions) => {
  if (!opts.lastSentAt) return false;

  const [sentLocal, nowLocal] = [opts.lastSentAt, opts.now].map((dt) =>
    localDateFromUtc(dt, opts.tz),
  );

  return sentLocal === nowLocal;
};
