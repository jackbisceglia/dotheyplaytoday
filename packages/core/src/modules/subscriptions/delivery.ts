import { DateTime, Duration } from "effect";

import { localDateFromUtc, type LocalDate } from "../../lib/datetime.js";
import type { Event } from "../events/schema.js";
import type { User } from "../users/schema.js";
import type { Subscription } from "./schema.js";

export namespace Delivery {
  export const constants = {
    tolerance: {
      earlyMs: Duration.toMillis("1 minute"),
      lateMs: Duration.toMillis("5 minutes"),
    },
  };

  export const getScheduledSend = ({
    sendAtSecondsLocal,
    timezone,
    now,
  }: {
    sendAtSecondsLocal: number;
    timezone: User["timezone"];
    now: DateTime.Utc;
  }) => {
    const zonedNow = DateTime.setZone(now, timezone);
    const timeParts = Duration.parts(Duration.seconds(sendAtSecondsLocal));

    return DateTime.setParts(zonedNow, {
      ...timeParts,
      millis: 0,
    });
  };

  export const isDue = ({
    subscription,
    user,
    now,
  }: {
    subscription: Subscription;
    user: User;
    now: DateTime.Utc;
  }) => {
    if (subscription.schedule.type === "relative") {
      return false;
    }

    const sendAtUtc = DateTime.toUtc(
      getScheduledSend({
        sendAtSecondsLocal: subscription.schedule.sendAtSecondsLocal,
        timezone: user.timezone,
        now,
      }),
    );
    const driftMs =
      DateTime.toEpochMillis(now) - DateTime.toEpochMillis(sendAtUtc);

    return (
      driftMs >= -constants.tolerance.earlyMs &&
      driftMs <= constants.tolerance.lateMs
    );
  };

  export const getEventsForLocalDate = (
    events: readonly Event[],
    timezone: User["timezone"],
    target: LocalDate,
  ) =>
    events.filter(
      (event) => localDateFromUtc(event.startUtc, timezone) === target,
    );
}
