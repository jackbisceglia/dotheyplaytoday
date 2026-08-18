import * as Cloudflare from "alchemy/Cloudflare";
import { Api } from "@dtpt/core/contracts/api";
import { SignupRateLimited } from "@dtpt/core/contracts/signup";
import { mapToTransactionError } from "@dtpt/core/lib/database/errors";
import { Database } from "@dtpt/core/lib/database/service";
import { SignupConfirmation } from "@dtpt/core/modules/channels/signup/schema";
import { SignupChannel } from "@dtpt/core/modules/channels/signup/service";
import { SubjectCapacityReached } from "@dtpt/core/modules/subscriptions/errors";
import { SubscriptionPolicy } from "@dtpt/core/modules/subscriptions/policy";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { Users } from "@dtpt/core/modules/users/service";
import { Effect } from "effect";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { getRateLimitKey, RateLimiter } from "./rate-limit/service.js";

const UnexpectedErrorTags = [
  "DatabaseReadError",
  "DatabaseTransactionError",
  "DatabaseWriteError",
  "SchemaError",
] as const;

export const SignupGroupLayer = HttpApiBuilder.group(
  Api,
  "signup",
  (handlers) =>
    Effect.gen(function* () {
      const rateLimiter = yield* RateLimiter;
      const database = yield* Database;
      const subscriptions = yield* Subscriptions;
      const users = yield* Users;
      const signupChannel = yield* SignupChannel;
      const executionContext = yield* Cloudflare.WorkerExecutionContext;

      return handlers.handle(
        "submit",
        Effect.fn("SignupHttpApi.submit")(
          function* (ctx) {
            yield* rateLimiter.check(getRateLimitKey(ctx.request));

            // This static guard keeps known-invalid work outside the transaction;
            // user-dependent policy and subject checks still run inside it.
            const received = new Set(ctx.payload.subjectIds).size;
            const { max } = SubscriptionPolicy.subject.constraints;

            if (received > max) {
              return yield* new SubjectCapacityReached({
                limit: max,
                received,
              });
            }

            const receipt = yield* database
              .transaction(() =>
                Effect.gen(function* () {
                  const outcome = yield* users.upsertForSignup(
                    ctx.payload.email,
                    ctx.payload.timezone,
                  );

                  const subjects = yield* subscriptions.replaceForUser({
                    user: outcome.user,
                    subjectIds: ctx.payload.subjectIds,
                    schedule: ctx.payload.schedule,
                  });

                  return { outcome, subjects };
                }),
              )
              .pipe(mapToTransactionError("Signup.submit"));

            const [firstSubject, ...remainingSubjects] = receipt.subjects;

            if (!firstSubject) {
              return yield* Effect.die(
                "A successful signup must contain at least one subject",
              );
            }

            const confirmationFields = {
              user: receipt.outcome.user,
              subjects: [firstSubject, ...remainingSubjects] as const,
              schedule: ctx.payload.schedule,
            };
            const confirmation =
              receipt.outcome._tag === "first_signup"
                ? SignupConfirmation.cases.first_signup.make(confirmationFields)
                : SignupConfirmation.cases.repeat_signup.make(
                    confirmationFields,
                  );

            yield* executionContext.waitUntil(
              signupChannel.deliver(confirmation).pipe(
                Effect.tap(() =>
                  Effect.logInfo("signup confirmation: delivered", {
                    kind: confirmation._tag,
                    user: confirmation.user.email,
                  }),
                ),
                Effect.tapCause((cause) =>
                  Effect.logError("signup confirmation: delivery failed", {
                    cause,
                    kind: confirmation._tag,
                    user: confirmation.user.email,
                  }),
                ),
                Effect.ignore,
              ),
            );

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
