import { eq } from "drizzle-orm";
import { DateTime, Effect } from "effect";

import { DatabaseReadError, DatabaseWriteError } from "../database/errors.js";
import { subscriptionsTable } from "../database/schemas.js";
import { Database } from "../database/service.js";
import { Topics } from "../topics/service.js";
import type { User } from "../users/schema.js";
import { Subscription } from "./schema.js";
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
    dependencies: [Topics.Default],
    effect: Effect.gen(function* () {
      const database = yield* Database;
      const topics = yield* Topics;

      const getAll = Effect.fn("Subscriptions.getAll")(function* () {
        return yield* database.query.subscriptionsTable.findMany().pipe(
          Effect.map((rows) =>
            rows.map((row) => ({
              ...row,
              lastSentAt: row.lastSentAt
                ? DateTime.unsafeMake(row.lastSentAt)
                : null,
            })),
          ),
          Effect.mapError(() =>
            DatabaseReadError.make({
              operation: "Subscriptions.getAll",
              message: "Failed to read subscriptions",
            }),
          ),
        );
      });

      const update = Effect.fn("Subscriptions.update")(function* (
        subscription: Subscription,
      ) {
        const lastSentAt = subscription.lastSentAt
          ? DateTime.toDateUtc(subscription.lastSentAt)
          : null;

        yield* database
          .update(subscriptionsTable)
          .set({ ...subscription, lastSentAt })
          .where(eq(subscriptionsTable.id, subscription.id))
          .pipe(
            Effect.mapError(() =>
              DatabaseWriteError.make({
                operation: "Subscriptions.update",
                message: "Failed to update subscription",
              }),
            ),
          );
      });

      const getDueEvents = Effect.fn("getDueEvents")(function* (
        opts: GetDueEventsOptions,
      ) {
        const topicEvents = yield* topics.getAllEventsByTopicId(
          opts.subscription.topicId,
        );

        const matches = topicEvents.filter(
          (event) =>
            localDateFromUtc(event.data.startUtc, opts.user.timezone) ===
            opts.target,
        );

        const sorted = matches.toSorted(
          (a, b) =>
            DateTime.toEpochMillis(a.data.startUtc) -
            DateTime.toEpochMillis(b.data.startUtc),
        );

        return sorted.map((event) => ({ ...event.data, id: event.id }));
      });

      return {
        getAll,
        update,
        isDue: _isDue,
        isAlreadySentToday: _isAlreadySentToday,
        getDueEvents,
      };
    }),
  },
) {}
