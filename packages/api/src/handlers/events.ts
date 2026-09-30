import { Api } from "@dtpt/core/contracts/api";
import { Events } from "@dtpt/core/modules/events/service";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { getUserSchedule } from "@dtpt/core/modules/events/schedule";
import { UserId } from "@dtpt/core/modules/users/schema";
import { Users } from "@dtpt/core/modules/users/service";
import { DateTime, Effect } from "effect";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { Auth } from "../auth/auth.js";
import { withNoStoreResponse } from "../lib/no-store.js";

const UnexpectedErrorTags = [
  "AuthRequestError",
  "DatabaseReadError",
  "SchemaError",
] as const;

export const EventsGroupLayer = HttpApiBuilder.group(
  Api,
  "events",
  Effect.fn("EventsHttpApi.group")(function* (handlers) {
    const auth = yield* Auth;
    const users = yield* Users;
    const events = yield* Events;
    const subscriptions = yield* Subscriptions;
    return handlers.handle(
      "list",
      Effect.fn("EventsHttpApi.list")(
        function* (ctx) {
          const session = yield* auth.getSession(ctx.request.headers);
          if (!session) return yield* new HttpApiError.Unauthorized({});
          const userId = yield* UserId.makeEffect(session.user.id);
          const user = yield* users.get(userId);
          const nowUtc = yield* DateTime.now;
          return yield* getUserSchedule(user, nowUtc).pipe(
            Effect.provideService(Events, events),
            Effect.provideService(Subscriptions, subscriptions),
          );
        },
        Effect.tapErrorTag(UnexpectedErrorTags, (error) =>
          Effect.logError("user events: unexpected failure", { error }),
        ),
        Effect.catchTag("UserNotFound", () =>
          Effect.fail(new HttpApiError.Unauthorized({})),
        ),
        Effect.catchTag(UnexpectedErrorTags, () =>
          Effect.fail(new HttpApiError.InternalServerError({})),
        ),
        withNoStoreResponse,
      ),
    );
  }),
);
