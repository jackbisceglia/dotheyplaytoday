import { DateTime, Effect } from "effect";
import { toTimeZone, type TimezoneId } from "../../lib/effect";

export type NotificationTemplate = {
  subject: string;
  body: string;
};

export type BuildTemplateParams = {
  teamName: string;
  userTimeZone: TimezoneId;
  datetime: DateTime.Utc;
  opponent: string;
};

const formatGameTime = (date: DateTime.Utc, timezone: TimezoneId): string => {
  const zone = toTimeZone(timezone);

  const zonedDate = DateTime.setZone(date, zone);

  return DateTime.format(zonedDate, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export class Notify extends Effect.Service<Notify>()("Notify", {
  effect: Effect.gen(function* () {
    yield* Effect.void;

    return {
      buildTemplate: Effect.fn("notify.buildTemplate")(function* (
        params: BuildTemplateParams,
      ) {
        yield* Effect.void;
        // TODO: Build notification template
        // This base template will be consumed by various clients
        // (email, WhatsApp, Signal, etc.) that transform it to their format
        return {
          subject: `${params.teamName} play today!`,
          body: `Game against ${params.opponent} at ${formatGameTime(
            params.datetime,
            params.userTimeZone,
          )}`,
        } satisfies NotificationTemplate;
      }),
    };
  }),
}) {}
