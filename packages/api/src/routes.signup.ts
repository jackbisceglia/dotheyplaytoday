import { SignupRateLimited, Subscriptions, Users } from "@dtpt/core";
import { Api } from "@dtpt/core/contracts/api";
import { Effect } from "effect";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { getRateLimitKey, RateLimiter } from "./rate-limit/service.js";

const UnexpectedErrorTags = [
  "DatabaseReadError",
  "DatabaseWriteError",
  "SchemaError",
] as const;

export const SignupGroupLayer = HttpApiBuilder.group(
  Api,
  "signup",
  (handlers) =>
    Effect.gen(function* () {
      const rateLimiter = yield* RateLimiter;
      const subscriptions = yield* Subscriptions;
      const users = yield* Users;

      return handlers.handle(
        "submit",
        Effect.fn(
          function* (ctx) {
            yield* rateLimiter.check(getRateLimitKey(ctx.request));

            // TODO(database): restore atomic signup with D1 batch support.
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
          },
          Effect.tapErrorTag(UnexpectedErrorTags, (e) =>
            Effect.logError("signup: unexpected failure", { error: e.message }),
          ),
          Effect.catchTag(
            ["InvalidSubjectSelection", "SubjectCapacityReached"],
            () => Effect.fail(new HttpApiError.BadRequest({})),
          ),
          Effect.catchTag("RateLimitExceeded", () =>
            Effect.fail(new SignupRateLimited({})),
          ),
          Effect.catchTag(UnexpectedErrorTags, () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
          ),
        ),
      );
    }),
);
