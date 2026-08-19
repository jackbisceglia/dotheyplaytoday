import { Api } from "@dtpt/core/contracts/api";
import { FeedbackRateLimited } from "@dtpt/core/contracts/feedback";
import { mapToWriteError } from "@dtpt/core/lib/database/errors";
import { Database } from "@dtpt/core/lib/database/service";
import { feedbackTable } from "@dtpt/core/modules/feedback/schema";
import { Effect } from "effect";
import { HttpApiBuilder, HttpApiError } from "effect/unstable/httpapi";

import { getRateLimitKey, RateLimiter } from "./rate-limit/service.js";

export const FeedbackGroupLayer = HttpApiBuilder.group(
  Api,
  "feedback",
  Effect.fn("FeedbackHttpApi.group")(function* (handlers) {
    const database = yield* Database;
    const rateLimiter = yield* RateLimiter;

    return handlers.handle(
      "submit",
      Effect.fn("FeedbackHttpApi.submit")(
        function* ({ payload, request }) {
          yield* rateLimiter.check(getRateLimitKey(request));

          yield* database
            .insert(feedbackTable)
            .values(payload)
            .pipe(mapToWriteError("Feedback.submit"));

          return { ok: true as const };
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
