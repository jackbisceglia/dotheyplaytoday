import { Api } from "@dtpt/core/contracts/api";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { UserId } from "@dtpt/core/modules/users/schema";
import { Users } from "@dtpt/core/modules/users/service";
import { Effect } from "effect";
import { HttpEffect, HttpServerResponse } from "effect/unstable/http";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { Auth } from "../auth/auth.js";

const UnexpectedErrorTags = [
  "AuthRequestError",
  "DatabaseReadError",
  "SchemaError",
] as const;

export const UserSubscriptionGroupLayer = HttpApiBuilder.group(
  Api,
  "userSubscription",
  Effect.fn("UserSubscriptionHttpApi.group")(function* (handlers) {
    const auth = yield* Auth;

    const users = yield* Users;
    const subscriptions = yield* Subscriptions;

    return handlers.handle(
      "list",
      Effect.fn("UserSubscriptionHttpApi.list")(
        function* (ctx) {
          const session = yield* auth.use((client) =>
            client.api.getSession({ headers: ctx.request.headers }),
          );

          if (!session) {
            return yield* new HttpApiError.Unauthorized({});
          }

          const userId = yield* UserId.makeEffect(session.user.id);

          const user = yield* users.get(userId);

          return yield* subscriptions.listForUser(user.id);
        },
        Effect.tapErrorTag(UnexpectedErrorTags, (error) =>
          Effect.logError("user subscription: unexpected failure", { error }),
        ),
        Effect.catchTags({
          UserNotFound: () => Effect.fail(new HttpApiError.Unauthorized({})),
          AuthRequestError: () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
          DatabaseReadError: () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
          SchemaError: () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
        }),
        HttpEffect.withPreResponseHandler((_, response) =>
          Effect.succeed(
            HttpServerResponse.setHeader(response, "cache-control", "no-store"),
          ),
        ),
      ),
    );
  }),
);
