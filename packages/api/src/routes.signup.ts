import {
  SignupRateLimited,
  SubjectCapacityReached,
  SubscriptionPolicy,
  Subscriptions,
  Users,
} from "@dtpt/core";
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
        Effect.fn("SignupHttpApi.submit")(
          function* (ctx) {
            yield* rateLimiter.check(getRateLimitKey(ctx.request));

            // TODO(signup): move this into a signup domain service once D1
            // batch restores atomicity. This is only a static pre-user guard;
            // user-dependent policy and subject existence checks still happen
            // after the user write.
            const received = new Set(ctx.payload.subjectIds).size;
            const { max } = SubscriptionPolicy.subject.constraints;

            if (received > max) {
              return yield* new SubjectCapacityReached({
                limit: max,
                received,
              });
            }

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
