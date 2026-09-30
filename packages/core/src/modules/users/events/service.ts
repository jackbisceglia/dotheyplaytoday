import { Context, DateTime, Effect, Layer, Schema } from "effect";

import type { DatabaseReadError } from "../../../lib/database/errors.js";
import { Events } from "../../events/service.js";
import { Subscriptions } from "../../subscriptions/service.js";
import { SubscriptionTiming } from "../../subscriptions/time.js";
import type { UserId } from "../schema.js";
import { Users, type UserNotFound } from "../service.js";
import type { SubscriptionWithEvents } from "./schema.js";

export class UserEvents extends Context.Service<
  UserEvents,
  {
    readonly listForUser: (
      userId: UserId,
    ) => Effect.Effect<
      readonly SubscriptionWithEvents[],
      UserNotFound | DatabaseReadError | Schema.SchemaError
    >;
  }
>()("@dtpt/core/UserEvents") {}

export const UserEventsLayer = Layer.effect(
  UserEvents,
  Effect.gen(function* () {
    const users = yield* Users;
    const subscriptions = yield* Subscriptions;
    const events = yield* Events;

    const listForUser = Effect.fn("UserEvents.listForUser")(function* (
      userId: UserId,
    ) {
      const user = yield* users.get(userId);
      const nowUtc = yield* DateTime.now;
      const range = SubscriptionTiming.localUtcRange({
        nowUtc,
        timezone: user.timezone,
        days: 7,
      });
      const picks = yield* subscriptions.listForUser(userId);
      return yield* Effect.forEach(
        picks,
        Effect.fn(function* (pick) {
          return {
            ...pick,
            events: yield* events.listBySubject(pick.subjectId, { range }),
          };
        }),
        { concurrency: 4 },
      );
    });

    return UserEvents.of({ listForUser });
  }),
);
