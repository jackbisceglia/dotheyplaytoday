import { SignupRateLimited, Subscriptions, Users } from "@dtpt/core-v2";
import { Api } from "@dtpt/core-v2/contracts/api";
import { Effect, Option } from "effect";
import { SqlClient } from "effect/unstable/sql/SqlClient";
import { HttpServerRequest } from "effect/unstable/http";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { RateLimiter } from "./rate-limit/service.js";

const UnexpectedErrorTags = [
  "DatabaseReadError",
  "DatabaseWriteError",
  "SchemaError",
  "SqlError",
] as const;

const rateLimitKey = (request: HttpServerRequest.HttpServerRequest) =>
  Option.getOrElse(request.remoteAddress, () => "unknown");

export const SignupGroupLayer = HttpApiBuilder.group(
  Api,
  "signup",
  (handlers) =>
    Effect.gen(function* () {
      const rateLimiter = yield* RateLimiter;
      const sql = yield* SqlClient;
      const subscriptions = yield* Subscriptions;
      const users = yield* Users;

      return handlers.handle(
        "submit",
        Effect.fn(
          function* (ctx) {
            const key = rateLimitKey(ctx.request);
            yield* rateLimiter.check(key);

            return yield* sql.withTransaction(
              Effect.gen(function* () {
                const user = yield* users.upsertForSignup(
                  ctx.payload.email,
                  ctx.payload.timezone,
                );

                yield* subscriptions.replaceForUser({
                  user,
                  subjectIds: ctx.payload.subjectIds,
                  schedule: ctx.payload.schedule,
                });

                return { ok: true as const };
              }),
            );
          },
          Effect.tapErrorTag(
            UnexpectedErrorTags,
            (e) => Effect.logError("signup: unexpected failure", { error: e.message }),
          ),
          Effect.catchTag(
            ["InvalidSubjectSelection", "SubjectCapacityReached"],
            () => Effect.fail(new HttpApiError.BadRequest({})),
          ),
          Effect.catchTag("RateLimitExceeded", () =>
            Effect.fail(new SignupRateLimited({})),
          ),
          Effect.catchTag(
            UnexpectedErrorTags,
            () => Effect.fail(new HttpApiError.InternalServerError({})),
          ),
        ),
      );
    }),
);
