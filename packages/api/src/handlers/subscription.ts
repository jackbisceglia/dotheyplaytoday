import { Api } from "@dtpt/core/contracts/api";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
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

const UnexpectedUpdateErrorTags = [
  ...UnexpectedErrorTags,
  "DatabaseWriteError",
  "DatabaseTransactionError",
] as const;

export const SubscriptionGroupLayer = HttpApiBuilder.group(
  Api,
  "subscription",
  Effect.fn("SubscriptionHttpApi.group")(function* (handlers) {
    const auth = yield* Auth;

    const users = yield* Users;
    const subscriptions = yield* Subscriptions;

    return handlers
      .handle(
        "list",
        Effect.fn("SubscriptionHttpApi.list")(
          function* (ctx) {
            const session = yield* auth.getSession(ctx.request.headers);

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
          withNoStoreResponse,
        ),
      )
      .handle(
        "update",
        Effect.fn("SubscriptionHttpApi.update")(
          function* (ctx) {
            const session = yield* auth.getSession(ctx.request.headers);

            if (!session) return yield* new HttpApiError.Unauthorized({});

            const userId = yield* UserId.makeEffect(session.user.id);
            const user = yield* users.get(userId);

            yield* subscriptions.replaceForUser({ user, ...ctx.payload });

            return { ok: true as const };
          },
          Effect.catchTags({
            UserNotFound: () => Effect.fail(new HttpApiError.Unauthorized({})),
            InvalidSubjectSelection: () =>
              Effect.fail(new HttpApiError.BadRequest({})),
            SubjectCapacityReached: () =>
              Effect.fail(new HttpApiError.BadRequest({})),
          }),
          Effect.tapErrorTag(UnexpectedUpdateErrorTags, (error) =>
            Effect.logError("update subscriptions failed", { error }),
          ),
          Effect.catchTag(UnexpectedUpdateErrorTags, () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
          ),
          withNoStoreResponse,
        ),
      );
  }),
);
