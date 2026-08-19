import * as Cloudflare from "alchemy/Cloudflare";
import { Api } from "@dtpt/core/contracts/api";
import { SignupRateLimited } from "@dtpt/core/contracts/signup";
import { mapToTransactionError } from "@dtpt/core/lib/database/errors";
import { Database } from "@dtpt/core/lib/database/service";
import { Id } from "@dtpt/core/lib/id/service";
import { EmailChannelClient } from "@dtpt/core/modules/channels/email/clients/service";
import { renderSignupConfirmation } from "@dtpt/core/modules/channels/signup-confirmation/email/render";
import { SignupConfirmation } from "@dtpt/core/modules/channels/signup-confirmation/schema";
import { Subject } from "@dtpt/core/modules/subjects/schema";
import { SubjectCapacityReached } from "@dtpt/core/modules/subscriptions/errors";
import { SubscriptionPolicy } from "@dtpt/core/modules/subscriptions/policy";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { Users } from "@dtpt/core/modules/users/service";
import { Effect, Schema } from "effect";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { getRateLimitKey, RateLimiter } from "./rate-limit/service.js";

const UnexpectedErrorTags = [
  "DatabaseReadError",
  "DatabaseTransactionError",
  "DatabaseWriteError",
  "SchemaError",
] as const;

const decodeSelectedSubjects = Schema.decodeUnknownEffect(
  Schema.NonEmptyArray(Subject),
);

export const SignupGroupLayer = HttpApiBuilder.group(
  Api,
  "signup",
  (handlers) =>
    Effect.gen(function* () {
      const rateLimiter = yield* RateLimiter;
      const database = yield* Database;
      const subscriptions = yield* Subscriptions;
      const users = yield* Users;
      const emailClient = yield* EmailChannelClient;
      const id = yield* Id;
      const context = yield* Cloudflare.WorkerExecutionContext;

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

            const signup = yield* database
              .transaction(() =>
                Effect.gen(function* () {
                  const { user, ...context } = yield* users.upsertForSignup(
                    ctx.payload.email,
                    ctx.payload.timezone,
                  );
                  const subjects = yield* subscriptions.replaceForUser({
                    user,
                    subjectIds: ctx.payload.subjectIds,
                    schedule: ctx.payload.schedule,
                  });

                  return { user, context, subjects };
                }),
              )
              .pipe(mapToTransactionError("Signup.submit"));
            const confirmation = SignupConfirmation.make({
              _tag: signup.context.isFirstSignup
                ? "firstSignup"
                : "repeatSignup",
              user: signup.user,
              subjects: yield* decodeSelectedSubjects(signup.subjects),
              schedule: ctx.payload.schedule,
            });

            yield* context.waitUntil(
              Effect.gen(function* () {
                const rendered = yield* renderSignupConfirmation(
                  confirmation,
                ).pipe(Effect.orDie);

                yield* emailClient.send(
                  {
                    recipient: confirmation.user.email,
                    hash: yield* id.generate(),
                  },
                  rendered,
                );
              }).pipe(
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
