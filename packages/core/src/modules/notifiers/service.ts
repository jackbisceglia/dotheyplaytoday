import { DateTime, Effect } from "effect";

import type { Event, NonEmptyEvents } from "../events/schema";
import { formatBody, formatEventSubject } from "./format";
import { Notifier as NotifierProvider } from "./providers/service";
import type { User } from "../users/schema";

export class Notifier extends Effect.Service<Notifier>()("@dtpt/Notifier", {
  effect: Effect.gen(function* () {
    const provider = yield* NotifierProvider;

    const send = Effect.fn("Notifier.send")(function* (
      user: User,
      events: NonEmptyEvents,
    ) {
      const sortedEvents = events.toSorted(
        (a: Event, b: Event) =>
          DateTime.toEpochMillis(a.startUtc) -
          DateTime.toEpochMillis(b.startUtc),
      ) as unknown as NonEmptyEvents;

      yield* provider.send({
        channel: "email",
        to: user.email,
        title: formatEventSubject({
          events: sortedEvents,
          timezone: user.timezone,
        }),
        body: formatBody({ events: sortedEvents, timezone: user.timezone }),
      });
    });

    return { send };
  }),
}) {}
