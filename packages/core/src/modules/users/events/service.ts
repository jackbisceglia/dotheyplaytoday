import { Context, DateTime, Effect, Layer, Schema } from "effect";

import type { DatabaseReadError } from "../../../lib/database/errors.js";
import { Events } from "../../events/service.js";
import type { EventWithParticipants } from "../../events/service.js";
import type { SubjectId } from "../../subjects/schema.js";
import { Subscriptions } from "../../subscriptions/service.js";
import { SubscriptionTiming } from "../../subscriptions/time.js";
import type { User } from "../schema.js";

type SubscribedEvent = EventWithParticipants & {
  readonly subjectIds: readonly [SubjectId, ...SubjectId[]];
};

export class UserEvents extends Context.Service<
  UserEvents,
  {
    readonly listForUser: (user: User) => Effect.Effect<
      {
        readonly today: string;
        readonly timezone: User["timezone"];
        readonly events: readonly SubscribedEvent[];
      },
      DatabaseReadError | Schema.SchemaError
    >;
  }
>()("@dtpt/core/UserEvents") {}

export const UserEventsLayer = Layer.effect(
  UserEvents,
  Effect.gen(function* () {
    const subscriptions = yield* Subscriptions;
    const events = yield* Events;

    const listForUser: UserEvents["Service"]["listForUser"] = Effect.fn(
      "UserEvents.listForUser",
    )(function* (user) {
      const nowUtc = yield* DateTime.now;
      const range = SubscriptionTiming.localUtcRange({
        nowUtc,
        timezone: user.timezone,
        days: 7,
      });

      const picks = yield* subscriptions.listForUser(user.id);
      const batches = yield* Effect.forEach(
        picks,
        (pick) =>
          events
            .listBySubject(pick.subjectId, { range })
            .pipe(
              Effect.map((games) => ({ subjectId: pick.subjectId, games })),
            ),
        { concurrency: 4 },
      );

      const combined = new Map<SubscribedEvent["id"], SubscribedEvent>();
      for (const { subjectId, games } of batches) {
        for (const game of games) {
          const previous = combined.get(game.id);
          combined.set(game.id, {
            ...game,
            subjectIds: previous
              ? previous.subjectIds.includes(subjectId)
                ? previous.subjectIds
                : [...previous.subjectIds, subjectId]
              : [subjectId],
          });
        }
      }

      return {
        today: SubscriptionTiming.formatLocalDate(nowUtc, user.timezone),
        timezone: user.timezone,
        events: [...combined.values()].sort(
          (a, b) =>
            DateTime.toEpochMillis(a.startsAt) -
              DateTime.toEpochMillis(b.startsAt) || a.id.localeCompare(b.id),
        ),
      };
    });

    return UserEvents.of({ listForUser });
  }),
);
