import { mapToReadError } from "@dtpt/core/lib/database/errors";
import { Database } from "@dtpt/core/lib/database/service";
import { Email } from "@dtpt/core/modules/email/service";
import { Feedback } from "@dtpt/core/modules/feedback/schema";
import { Array, Data, DateTime, Effect, Schema } from "effect";

import { AdminEmail } from "../config.js";
import { render } from "./email.js";

class NoFeedback extends Data.TaggedError("FeedbackJobNoFeedback")<{
  readonly from: string;
  readonly to: string;
}> {}

export const FeedbackWindow = Effect.gen(function* () {
  const to = DateTime.startOf(yield* DateTime.now, "hour");
  const from = DateTime.subtract(to, { hours: 12 });

  return {
    from: DateTime.formatIso(from),
    to: DateTime.formatIso(to),
  };
});

const decodeFeedback = Schema.decodeUnknownEffect(Schema.Array(Feedback));

export const SendFeedbackEmail = Effect.gen(function* () {
  const database = yield* Database;
  const window = yield* FeedbackWindow;

  const rows = yield* database.query.feedbackTable
    .findMany({
      where: { createdAt: { gte: window.from, lt: window.to } },
      orderBy: { createdAt: "asc", id: "asc" },
    })
    .pipe(mapToReadError("FeedbackJob.listRecent", window));

  const feedback = yield* decodeFeedback(rows);

  if (!Array.isReadonlyArrayNonEmpty(feedback)) {
    return yield* new NoFeedback(window);
  }

  yield* Effect.logInfo("feedback job: sending digest", {
    feedbackCount: feedback.length,
    from: window.from,
    to: window.to,
  });

  const recipient = yield* AdminEmail;
  const email = yield* Email;

  yield* email
    .send(
      {
        recipient,
        idempotencyKey: `feedback:${window.from}:${window.to}`,
      },
      render(feedback),
    )
    .pipe(
      Effect.tap(() =>
        Effect.logInfo("feedback digest: delivered", {
          feedbackCount: feedback.length,
          recipient,
        }),
      ),
      Effect.tapCause((cause) =>
        Effect.logError("feedback digest: delivery failed", {
          cause,
          feedbackCount: feedback.length,
          recipient,
        }),
      ),
    );
}).pipe(
  Effect.catchTag("FeedbackJobNoFeedback", ({ from, to }) =>
    Effect.logInfo("feedback job: no recent feedback", { from, to }),
  ),
);
