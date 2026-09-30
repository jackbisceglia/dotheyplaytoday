import { DateTime, Effect } from "effect";

import { Subscriptions } from "../subscriptions/service.js";
import { SubscriptionTiming } from "../subscriptions/time.js";
import type { User } from "../users/schema.js";
import { Events } from "./service.js";
import type { SubscribedEvent } from "./read-models.js";

// One snapshot of the user's local calendar: today plus the next six days.
export const getUserSchedule = Effect.fn("Events.getUserSchedule")(function* (
  user: User,
  nowUtc: DateTime.Utc,
) {
  const subscriptions = yield* Subscriptions;
  const events = yield* Events;
  const range = SubscriptionTiming.localDayUtcRange({
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
        .pipe(Effect.map((games) => ({ subjectId: pick.subjectId, games }))),
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
