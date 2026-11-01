import { Api } from "@dtpt/core/contracts/api";
import { UpdateSubscriptionsRateLimited } from "@dtpt/core/contracts/subscription";
import { whenSchemaIssue } from "@dtpt/core/lib/effect/index";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { UserId } from "@dtpt/core/modules/users/schema";
import { Users } from "@dtpt/core/modules/users/service";
import { Effect, type Layer, SchemaIssue } from "effect";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { Auth } from "../auth/auth.js";
import { withNoStoreResponse } from "../lib/no-store.js";
import { getRateLimitKey, RateLimiter } from "../rate-limit/service.js";

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

export const SubscriptionGroupLayer = <R>(
  authLayer: Layer.Layer<Auth, never, R>,
) => HttpApiBuilder.group(
  Api,
  "subscription",
  Effect.fn("SubscriptionHttpApi.group")(function* (handlers) {
    const rateLimiter = yield* RateLimiter;

    const users = yield* Users;
    const subscriptions = yield* Subscriptions;

    return handlers
      .handle(
        "list",
        Effect.fn("SubscriptionHttpApi.list")(
          function* (ctx) {
            const auth = yield* Auth;
            const session = yield* auth.getSession(ctx.request.headers);

            if (!session) {
              return yield* new HttpApiError.Unauthorized({});
            }

            const userId = yield* UserId.makeEffect(session.user.id);

            const user = yield* users.get(userId);

            return yield* subscriptions.listForUser(user.id);
          },
          Effect.tapError(
            whenSchemaIssue((error) =>
              Effect.logError("user subscription: unexpected failure", {
                error,
              }),
            ),
          ),
          Effect.tapErrorTag(UnexpectedErrorTags, (error) =>
            Effect.logError("user subscription: unexpected failure", { error }),
          ),
          Effect.catchIf(SchemaIssue.isIssue, () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
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
          Effect.provide(authLayer),
        ),
      )
      .handle(
        "update",
        Effect.fn("SubscriptionHttpApi.update")(
          function* (ctx) {
            const auth = yield* Auth;
            yield* rateLimiter.check(getRateLimitKey(ctx.request));

            const session = yield* auth.getSession(ctx.request.headers);

            if (!session) return yield* new HttpApiError.Unauthorized({});

            const userId = yield* UserId.makeEffect(session.user.id);
            const user = yield* users.get(userId);

            yield* subscriptions.replaceForUser({ user, ...ctx.payload });

            return { ok: true as const };
          },
          Effect.tapError(
            whenSchemaIssue((error) =>
              Effect.logError("update subscriptions failed", { error }),
            ),
          ),
          Effect.catchTags({
            UserNotFound: () => Effect.fail(new HttpApiError.Unauthorized({})),
            InvalidSubjectSelection: () =>
              Effect.fail(new HttpApiError.BadRequest({})),
            SubjectCapacityReached: () =>
              Effect.fail(new HttpApiError.BadRequest({})),
            RateLimitExceeded: () =>
              Effect.fail(new UpdateSubscriptionsRateLimited({})),
          }),
          Effect.tapErrorTag(UnexpectedUpdateErrorTags, (error) =>
            Effect.logError("update subscriptions failed", { error }),
          ),
          Effect.catchIf(SchemaIssue.isIssue, () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
          ),
          Effect.catchTag(UnexpectedUpdateErrorTags, () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
          ),
          withNoStoreResponse,
          Effect.provide(authLayer),
        ),
      );
  }),
);
