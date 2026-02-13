import { Array, DateTime, Effect } from "effect";

import type { NonEmptyEvents } from "../events/schema";
import { formatBody, formatEventSubject } from "./format";
import { NotifierContext } from "./providers/service";
import type { User } from "../users/schema";

export class Notifier extends Effect.Service<Notifier>()("@dtpt/Notifier", {
  effect: Effect.gen(function* () {
    const provider = yield* NotifierContext;

    const send = Effect.fn("Notifier.send")(function* (
      user: User,
      events: NonEmptyEvents,
    ) {
      const sortedEvents = events.toSorted(
        (a, b) =>
          DateTime.toEpochMillis(a.startUtc) -
          DateTime.toEpochMillis(b.startUtc),
      );

      if (!Array.isNonEmptyArray(sortedEvents)) {
        return yield* Effect.dieMessage(
          "Expected non-empty events after sorting",
        );
      }

      return yield* provider.send({
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
