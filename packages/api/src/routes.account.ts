import { Api } from "@dtpt/core/contracts/api";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { UserId } from "@dtpt/core/modules/users/schema";
import { Users } from "@dtpt/core/modules/users/service";
import { Effect, Schema } from "effect";
import { HttpEffect, HttpServerResponse } from "effect/unstable/http";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { Auth } from "./auth/auth.js";

const UnexpectedErrorTags = [
  "AuthRequestError",
  "DatabaseReadError",
  "SchemaError",
] as const;

export const AccountGroupLayer = HttpApiBuilder.group(
  Api,
  "account",
  Effect.fn("AccountHttpApi.group")(function* (handlers) {
    const auth = yield* Auth;
    const users = yield* Users;
    const subscriptions = yield* Subscriptions;

    return handlers.handle(
      "get",
      Effect.fn("AccountHttpApi.get")(
        function* ({ request }) {
          const session = yield* auth.use((client) =>
            client.api.getSession({ headers: request.headers }),
          );

          if (!session) {
            return yield* new HttpApiError.Unauthorized({});
          }

          const userId = yield* Schema.decodeUnknownEffect(UserId)(
            session.user.id,
          );
          const user = yield* users.get(userId);
          const savedSubscriptions = yield* subscriptions.listForUser(user.id);

          return { user, subscriptions: savedSubscriptions };
        },
        Effect.tapErrorTag(UnexpectedErrorTags, (error) =>
          Effect.logError("account: unexpected failure", { error }),
        ),
        Effect.catchTag("UserNotFound", () =>
          Effect.fail(new HttpApiError.Unauthorized({})),
        ),
        Effect.catchTag(UnexpectedErrorTags, () =>
          Effect.fail(new HttpApiError.InternalServerError({})),
        ),
        HttpEffect.withPreResponseHandler((_, response) =>
          Effect.succeed(
            HttpServerResponse.setHeader(response, "cache-control", "no-store"),
          ),
        ),
      ),
    );
  }),
);
