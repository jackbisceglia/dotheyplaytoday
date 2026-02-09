import { DateTime, Effect, Match, Option } from "effect";

import { Database } from "../database/service";
import type { User } from "../users/schema";
import type { Subscription } from "./schema";
import type { LocalDate } from "./time";
import { localDateFromUtc } from "./time";

type CheckOptions = {
  user: User;
  subscription: Subscription;
  targetDate: LocalDate;
};

export class Subscriptions extends Effect.Service<Subscriptions>()(
  "@dtpt/Subscriptions",
  {
    effect: Effect.gen(function* () {
      const database = yield* Database;

      const check = Effect.fn("Subscriptions.check")(function* (
        opts: CheckOptions,
      ) {
        const sortByStartUtc = (a: DateTime.Utc, b: DateTime.Utc) =>
          DateTime.toEpochMillis(a) - DateTime.toEpochMillis(b);

        const topic = yield* database.loadTopic(opts.subscription.topicId);

        const matches = topic.events.filter(
          (event) =>
            localDateFromUtc(event.startUtc, opts.user.timezone) ===
            opts.targetDate,
        );

        return Match.value(matches.length).pipe(
          Match.when(0, () => Option.none()),
          Match.orElse(() =>
            Option.some(
              matches.sort((a, b) => sortByStartUtc(a.startUtc, b.startUtc)),
            ),
          ),
        );
      });

      return { check };
    }),
  },
) {}
