import { UnsubscribeRateLimited, Users } from "@dtpt/core-v2";
import { Api } from "@dtpt/core-v2/contracts/api";
import { Effect } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { getRateLimitKey, RateLimiter } from "./rate-limit/service.js";

const UnexpectedErrorTags = [
  "DatabaseDeleteError",
  "DatabaseReadError",
  "SchemaError",
  "SqlError",
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
        Effect.fn(
          function* (ctx) {
            yield* rateLimiter.check(getRateLimitKey(ctx.request));

            const removed = yield* sql.withTransaction(
              Effect.gen(function* () {
                const user = yield* users.getByUnsubscribeToken(
                  ctx.payload.token,
                );

                yield* users.remove(user.id);

                return user;
              }),
            );

            yield* Effect.logInfo("unsubscribe: user removed", {
              userId: removed.id,
            });

            return { ok: true as const };
          },
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
