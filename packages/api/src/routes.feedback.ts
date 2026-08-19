import { Api } from "@dtpt/core/contracts/api";
import { FeedbackRateLimited } from "@dtpt/core/contracts/feedback";
import { mapToWriteError } from "@dtpt/core/lib/database/errors";
import { Database } from "@dtpt/core/lib/database/service";
import { Id } from "@dtpt/core/lib/id/service";
import { Feedback, feedbackTable } from "@dtpt/core/modules/feedback/schema";
import { Effect } from "effect";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { getRateLimitKey, RateLimiter } from "./rate-limit/service.js";

export const FeedbackGroupLayer = HttpApiBuilder.group(
  Api,
  "feedback",
  (handlers) =>
    Effect.gen(function* () {
      const rateLimiter = yield* RateLimiter;
      const database = yield* Database;
      const id = yield* Id;

      return handlers.handle(
        "submit",
        Effect.fn("FeedbackHttpApi.submit")(
          function* (ctx) {
            yield* rateLimiter.check(getRateLimitKey(ctx.request));

            yield* database
              .insert(feedbackTable)
              .values({
                id: yield* id.makeFromBrandedSchema(Feedback.fields.id),
                ...ctx.payload,
              })
              .pipe(mapToWriteError("Feedback.submit"));
          },
          Effect.tapErrorTag("DatabaseWriteError", (error) =>
            Effect.logError("feedback: unexpected failure", {
              error: error.message,
            }),
          ),
          Effect.catchTag("DatabaseWriteError", () =>
            Effect.fail(new HttpApiError.InternalServerError({})),
          ),
          Effect.catchTag("RateLimitExceeded", () =>
            Effect.fail(new FeedbackRateLimited({})),
          ),
        ),
      );
    }),
);
