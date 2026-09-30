import { Api } from "@dtpt/core/contracts/api";
import { UserEvents } from "@dtpt/core/modules/users/events/service";
import { UserId } from "@dtpt/core/modules/users/schema";
import { Users } from "@dtpt/core/modules/users/service";
import { Effect } from "effect";
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
    const userEvents = yield* UserEvents;

    return handlers.handle(
      "list",
      Effect.fn("EventsHttpApi.list")(
        function* (ctx) {
          const session = yield* auth.getSession(ctx.request.headers);

          if (!session) return yield* new HttpApiError.Unauthorized({});

          const userId = yield* UserId.makeEffect(session.user.id);
          const user = yield* users.get(userId);

          return yield* userEvents.listForUser(user);
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
