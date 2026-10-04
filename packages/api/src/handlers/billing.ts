import { Api } from "@dtpt/core/contracts/api";
import { BillingRateLimited } from "@dtpt/core/contracts/billing";
import { WebUrl } from "@dtpt/core/lib/config/web";
import { Billing } from "@dtpt/core/modules/billing/service";
import { UserId } from "@dtpt/core/modules/users/schema";
import { Users } from "@dtpt/core/modules/users/service";
import { Effect, Schema } from "effect";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";
import { HttpServerResponse } from "effect/unstable/http";

import { Auth } from "../auth/auth.js";
import { BillingConfig, isBillingConfigured } from "../billing/config.js";
import { withNoStoreResponse } from "../lib/no-store.js";
import {
  StripeBilling,
  type BillingProviderError,
  type BillingUnavailable,
  type BillingForbidden,
  type BillingInvalidRequest,
} from "../billing/service.js";
import type {
  DatabaseReadError,
  DatabaseWriteError,
} from "@dtpt/core/lib/database/errors";
import type { AuthRequestError } from "../auth/auth.js";
import type { UserNotFound } from "@dtpt/core/modules/users/service";
import type { RateLimitExceeded } from "../rate-limit/errors.js";
import { RateLimiter } from "../rate-limit/service.js";

export const BillingGroupLayer = HttpApiBuilder.group(
  Api,
  "billing",
  Effect.fn("BillingHttpApi.group")(function* (handlers) {
    const auth = yield* Auth;
    const users = yield* Users;
    const billing = yield* Billing;
    const config = yield* BillingConfig;
    const stripe = yield* StripeBilling;
    const limiter = yield* RateLimiter;
    const webOrigin = new URL(yield* WebUrl).origin;

    const account = Effect.fn("BillingHttpApi.account")(function* (
      headers: Parameters<typeof auth.getSession>[0],
    ) {
      const session = yield* auth.getSession(headers);
      if (!session) return yield* new HttpApiError.Unauthorized({});
      return yield* users.get(
        yield* Schema.decodeUnknownEffect(UserId)(session.user.id),
      );
    });

    const writeAccount = Effect.fn("BillingHttpApi.writeAccount")(function* (
      headers: Parameters<typeof auth.getSession>[0],
    ) {
      if (headers.origin !== webOrigin)
        return yield* new HttpApiError.Forbidden({});
      const user = yield* account(headers);
      yield* limiter.check(`billing:${user.id}`);
      return user;
    });

    const mapErrors = <A, R>(
      effect: Effect.Effect<
        A,
        | DatabaseReadError
        | DatabaseWriteError
        | AuthRequestError
        | UserNotFound
        | Schema.SchemaError
        | BillingProviderError
        | BillingUnavailable
        | BillingForbidden
        | BillingInvalidRequest
        | RateLimitExceeded
        | HttpApiError.Unauthorized
        | HttpApiError.Forbidden,
        R
      >,
    ) =>
      effect.pipe(
        Effect.tapErrorTag(
          [
            "DatabaseReadError",
            "DatabaseWriteError",
            "AuthRequestError",
            "SchemaError",
            "BillingProviderError",
          ],
          (error) => Effect.logError("billing: unexpected failure", { error }),
        ),
        Effect.catchTags({
          UserNotFound: () => Effect.fail(new HttpApiError.Unauthorized({})),
          AuthRequestError: () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
          SchemaError: () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
          DatabaseReadError: () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
          DatabaseWriteError: () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
          BillingProviderError: () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
          BillingUnavailable: () =>
            Effect.fail(new HttpApiError.ServiceUnavailable({})),
          BillingForbidden: () => Effect.fail(new HttpApiError.Forbidden({})),
          BillingInvalidRequest: () =>
            Effect.fail(new HttpApiError.BadRequest({})),
          RateLimitExceeded: () => Effect.fail(new BillingRateLimited({})),
        }),
      );

    return handlers
      .handle(
        "get",
        Effect.fn("BillingHttpApi.get")(
          function* (ctx) {
            const session = yield* auth.getSession(ctx.request.headers);
            if (!session) return yield* new HttpApiError.Unauthorized({});
            const user = yield* users.get(
              yield* Schema.decodeUnknownEffect(UserId)(session.user.id),
            );
            return {
              ...(yield* billing.getAccess(user)),
              available: isBillingConfigured(config),
            };
          },
          Effect.tapErrorTag(
            ["AuthRequestError", "DatabaseReadError", "SchemaError"],
            (error) =>
              Effect.logError("billing: unexpected failure", { error }),
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
        "checkout",
        Effect.fn("BillingHttpApi.checkout")(
          function* (ctx) {
            return yield* stripe.checkout(
              yield* writeAccount(ctx.request.headers),
            );
          },
          mapErrors,
          withNoStoreResponse,
        ),
      )
      .handle(
        "portal",
        Effect.fn("BillingHttpApi.portal")(
          function* (ctx) {
            const result = yield* stripe.portal(
              yield* writeAccount(ctx.request.headers),
            );
            return { url: result.url };
          },
          mapErrors,
          withNoStoreResponse,
        ),
      )
      .handle(
        "sync",
        Effect.fn("BillingHttpApi.sync")(
          function* (ctx) {
            const user = yield* writeAccount(ctx.request.headers);
            yield* stripe.sync(user);
            return {
              ...(yield* billing.getAccess(user)),
              available: isBillingConfigured(config),
            };
          },
          mapErrors,
          withNoStoreResponse,
        ),
      )
      .handleRaw(
        "webhook",
        Effect.fn("BillingHttpApi.webhook")(
          function* (ctx) {
            const payload = yield* ctx.request.text.pipe(
              Effect.mapError(() => new HttpApiError.BadRequest({})),
            );
            yield* stripe.webhook(
              payload,
              ctx.request.headers["stripe-signature"] ?? "",
            );
            return yield* HttpServerResponse.json({ ok: true }).pipe(
              Effect.orDie,
            );
          },
          Effect.catchTags({
            BillingInvalidSignature: () =>
              Effect.fail(new HttpApiError.BadRequest({})),
            BillingInvalidRequest: () =>
              Effect.fail(new HttpApiError.BadRequest({})),
            BillingUnavailable: () =>
              Effect.fail(new HttpApiError.ServiceUnavailable({})),
            BillingProviderError: () =>
              Effect.fail(new HttpApiError.InternalServerError({})),
            DatabaseReadError: () =>
              Effect.fail(new HttpApiError.InternalServerError({})),
            DatabaseWriteError: () =>
              Effect.fail(new HttpApiError.InternalServerError({})),
          }),
          withNoStoreResponse,
        ),
      );
  }),
);
