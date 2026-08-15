import { Api } from "@dtpt/core/contracts/api";
import { UnsubscribeRateLimited } from "@dtpt/core/contracts/unsubscribe";
import { withTransaction } from "@dtpt/core/lib/database/errors";
import { Users } from "@dtpt/core/modules/users/service";
import { Effect } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { getRateLimitKey, RateLimiter } from "./rate-limit/service.js";

const UnexpectedErrorTags = [
  "DatabaseDeleteError",
  "DatabaseReadError",
  "DatabaseTransactionError",
  "SchemaError",
] as const;

export const UnsubscribeGroupLayer = HttpApiBuilder.group(
  Api,
  "unsubscribe",
  (handlers) =>
    Effect.gen(function* () {
      const rateLimiter = yield* RateLimiter;
      const sql = yield* SqlClient;
      const users = yield* Users;

      return handlers.handle(
        "submit",
        Effect.fn("UnsubscribeHttpApi.submit")(
          function* (ctx) {
            yield* rateLimiter.check(getRateLimitKey(ctx.request));

            const transaction = withTransaction(sql);

            const user = yield* transaction(
              "Unsubscribe.submit",
              Effect.gen(function* () {
                const user = yield* users.getByUnsubscribeToken(
                  ctx.payload.token,
                );

                yield* users.remove(user.id);

                return user;
              }),
            );

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
          Effect.catchTag("UserNotFound", () =>
            Effect.succeed({ ok: true as const }),
          ),
          Effect.tapErrorTag(UnexpectedErrorTags, (e) =>
            Effect.logError("unsubscribe: unexpected failure", {
              error: e.message,
            }),
          ),
          Effect.catchTag("RateLimitExceeded", () =>
            Effect.fail(new UnsubscribeRateLimited({})),
          ),
          Effect.catchTag(UnexpectedErrorTags, () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
          ),
        ),
      );
    }),
);
