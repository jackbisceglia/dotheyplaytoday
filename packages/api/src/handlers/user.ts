import { Api } from "@dtpt/core/contracts/api";
import {
  DuplicateSignup,
  SignupRateLimited,
  UnsubscribeRateLimited,
} from "@dtpt/core/contracts/user";
import { mapToTransactionError } from "@dtpt/core/lib/database/errors";
import { Database } from "@dtpt/core/lib/database/service";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { type EmailAddress, UserId } from "@dtpt/core/modules/users/schema";
import { Users } from "@dtpt/core/modules/users/service";
import { Effect } from "effect";
import {
  type Headers,
  HttpEffect,
  HttpServerResponse,
} from "effect/unstable/http";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { Auth } from "../auth/auth.js";
import { getRateLimitKey, RateLimiter } from "../rate-limit/service.js";

const ReadErrorTags = [
  "AuthRequestError",
  "DatabaseReadError",
  "SchemaError",
] as const;

const UnsubscribeErrorTags = [
  "DatabaseDeleteError",
  "DatabaseReadError",
  "DatabaseTransactionError",
  "SchemaError",
] as const;

const CreateErrorTags = [
  "DatabaseReadError",
  "DatabaseTransactionError",
  "DatabaseWriteError",
  "SchemaError",
] as const;

export const UserGroupLayer = HttpApiBuilder.group(Api, "user", (handlers) =>
  Effect.gen(function* () {
    const auth = yield* Auth;
    const rateLimiter = yield* RateLimiter;

    const database = yield* Database;
    const users = yield* Users;
    const subscriptions = yield* Subscriptions;

    const requestMagicLink = Effect.fn("User.requestMagicLink")(
      function* (email: EmailAddress, headers: Headers.Headers) {
        yield* auth.use((client) =>
          // The shared auth before hook owns the success/error callbacks.
          client.api.signInMagicLink({ headers, body: { email } }),
        );
      },
      Effect.catchTag("AuthRequestError", () =>
        Effect.logError("signup: magic-link issuance failed"),
      ),
    );

    return handlers
      .handle(
        "create",
        Effect.fn("UserHttpApi.create")(
          function* (ctx) {
            yield* rateLimiter.check(getRateLimitKey(ctx.request));

            yield* database
              .transaction(
                Effect.fn("User.createTransaction")(function* () {
                  const user = yield* users.create(
                    ctx.payload.email,
                    ctx.payload.timezone,
                  );

                  yield* subscriptions.replaceForUser({
                    user,
                    subjectIds: ctx.payload.subjectIds,
                    schedule: ctx.payload.schedule,
                  });
                }),
              )
              .pipe(
                mapToTransactionError("User.create"),
                // Handle duplicates only after the failed transaction rolls back.
                Effect.tapErrorTag("UserAlreadyExists", () =>
                  requestMagicLink(ctx.payload.email, ctx.request.headers),
                ),
                Effect.catchTag("UserAlreadyExists", () =>
                  Effect.fail(new DuplicateSignup({})),
                ),
              );

            yield* requestMagicLink(ctx.payload.email, ctx.request.headers);

            return { ok: true as const };
          },
          Effect.tapErrorTag(CreateErrorTags, (e) =>
            Effect.logError("signup: unexpected failure", {
              error: e.message,
            }),
          ),
          Effect.catchTags({
            InvalidSubjectSelection: () =>
              Effect.fail(new HttpApiError.BadRequest({})),
            SubjectCapacityReached: () =>
              Effect.fail(new HttpApiError.BadRequest({})),
            RateLimitExceeded: () => Effect.fail(new SignupRateLimited({})),
            DatabaseReadError: () =>
              Effect.fail(new HttpApiError.InternalServerError({})),
            DatabaseTransactionError: () =>
              Effect.fail(new HttpApiError.InternalServerError({})),
            DatabaseWriteError: () =>
              Effect.fail(new HttpApiError.InternalServerError({})),
            SchemaError: () =>
              Effect.fail(new HttpApiError.InternalServerError({})),
          }),
        ),
      )
      .handle(
        "get",
        Effect.fn("UserHttpApi.get")(
          function* (ctx) {
            const session = yield* auth.use((client) =>
              client.api.getSession({ headers: ctx.request.headers }),
            );

            if (!session) {
              return yield* new HttpApiError.Unauthorized({});
            }

            const userId = yield* UserId.makeEffect(session.user.id);

            const user = yield* users.get(userId);

            return { email: user.email, timezone: user.timezone };
          },
          Effect.tapErrorTag(ReadErrorTags, (error) =>
            Effect.logError("user: unexpected failure", { error }),
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
              HttpServerResponse.setHeader(
                response,
                "cache-control",
                "no-store",
              ),
            ),
          ),
        ),
      )
      .handle(
        "unsubscribe",
        Effect.fn("UserHttpApi.unsubscribe")(
          function* (ctx) {
            yield* rateLimiter.check(getRateLimitKey(ctx.request));

            const user = yield* database
              .transaction(
                Effect.fn("User.unsubscribeTransaction")(function* () {
                  const user = yield* users.getByUnsubscribeToken(
                    ctx.payload.token,
                  );

                  yield* users.remove(user.id);

                  return user;
                }),
              )
              .pipe(mapToTransactionError("User.unsubscribe"));

            yield* Effect.logInfo("unsubscribe: user removed", {
              userId: user.id,
            });

            return { ok: true as const };
          },
          // A token that resolves to no user is expected, not an error: stale,
          // unknown, and already-consumed tokens all return the same ok result
          // so the endpoint can't be used to probe which tokens exist.
          Effect.tapErrorTag("UserNotFound", () =>
            Effect.logInfo("unsubscribe: token did not match an active user"),
          ),
          Effect.tapErrorTag(UnsubscribeErrorTags, (e) =>
            Effect.logError("unsubscribe: unexpected failure", {
              error: e.message,
            }),
          ),
          Effect.catchTags({
            UserNotFound: () => Effect.succeed({ ok: true as const }),
            RateLimitExceeded: () =>
              Effect.fail(new UnsubscribeRateLimited({})),
            DatabaseDeleteError: () =>
              Effect.fail(new HttpApiError.InternalServerError({})),
            DatabaseReadError: () =>
              Effect.fail(new HttpApiError.InternalServerError({})),
            DatabaseTransactionError: () =>
              Effect.fail(new HttpApiError.InternalServerError({})),
            SchemaError: () =>
              Effect.fail(new HttpApiError.InternalServerError({})),
          }),
        ),
      );
  }),
);
