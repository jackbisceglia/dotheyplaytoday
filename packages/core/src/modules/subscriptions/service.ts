import { DateTime, Effect } from "effect";

import { Database } from "../database/service.js";
import type { User } from "../users/schema.js";
import type { Subscription } from "./schema.js";
import type { LocalDate } from "./time.js";
import {
  isAlreadySentToday as _isAlreadySentToday,
  isDue as _isDue,
  localDateFromUtc,
} from "./time.js";

type GetDueEventsOptions = {
  user: User;
  subscription: Subscription;
  target: LocalDate;
};

export class Subscriptions extends Effect.Service<Subscriptions>()(
  "@dtpt/Subscriptions",
  {
    dependencies: [Database.Default],
    effect: Effect.gen(function* () {
      const database = yield* Database;

      const getDueEvents = Effect.fn("getDueEvents")(function* (
        opts: GetDueEventsOptions,
      ) {
        const topic = yield* database.loadTopic(opts.subscription.topicId);

        const matches = topic.events.filter(
          (event) =>
            localDateFromUtc(event.startUtc, opts.user.timezone) ===
            opts.target,
        );

        const sorted = matches.toSorted(
          (a, b) =>
            DateTime.toEpochMillis(a.startUtc) -
            DateTime.toEpochMillis(b.startUtc),
        );

        return sorted;
      });

      return {
        isDue: _isDue,
        isAlreadySentToday: _isAlreadySentToday,
        getDueEvents,
      };
    }),
  },
) {}
