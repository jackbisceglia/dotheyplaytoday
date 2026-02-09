import { DateTime, Match } from "effect";

import type { Event, NonEmptyEvents } from "../events/schema";
import type { User } from "../users/schema";

type NotifierFormatOptions = {
  events: NonEmptyEvents;
  timezone: User["timezone"];
};

const formatEventStart = (startUtc: Event["startUtc"], tz: User["timezone"]) =>
  DateTime.format(DateTime.setZone(startUtc, tz), {
    locale: "en-US",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });

const formatEventSummary = (event: Event) =>
  Match.value(event).pipe(
    Match.tags({
      sports: (e) => `${e.teamName} vs. ${e.opponent}`,
    }),
    Match.exhaustive,
  );

export const formatEventSubject = (opts: NotifierFormatOptions) =>
  Match.value(opts.events).pipe(
    Match.when(
      (events) => events.length === 1,
      (events) =>
        `${formatEventSummary(events[0])}, ${formatEventStart(events[0].startUtc, opts.timezone)}`,
    ),
    Match.when(
      (events) => events.length > 1,
      (events) =>
        Match.value(events[0]).pipe(
          Match.tag(
            "sports",
            (e) =>
              `${e.teamName} play today, ${events.length.toString()} games`,
          ),
          Match.exhaustive,
        ),
    ),
    Match.orElseAbsurd,
  );

export const formatBody = (opts: NotifierFormatOptions) =>
  Match.value(opts.events[0]).pipe(
    Match.tag("sports", (event) => {
      return [
        `${event.teamName} play today.`,
        "",
        ...opts.events.map(
          (e) =>
            `- ${e.teamName} vs. ${e.opponent} at ${formatEventStart(e.startUtc, opts.timezone)}`,
        ),
      ].join("\n");
    }),
    Match.exhaustive,
  );
