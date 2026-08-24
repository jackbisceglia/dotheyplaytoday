import { mapToReadError } from "@dtpt/core/lib/database/errors";
import { Database } from "@dtpt/core/lib/database/service";
import { Feedback } from "@dtpt/core/modules/feedback/schema";
import { Array, Data, DateTime, Effect, Schema } from "effect";

import { sendFeedback } from "./email.js";

class NoFeedback extends Data.TaggedError("FeedbackJobNoFeedback")<{
  readonly from: string;
  readonly to: string;
}> {}

export const getFeedbackWindow = Effect.fn("FeedbackJob.getWindow")(
  function* () {
    const now = yield* DateTime.now;
    const to = DateTime.startOf(now, "hour");
    const from = DateTime.subtract(to, { hours: 12 });

    return {
      from: DateTime.formatIso(from),
      to: DateTime.formatIso(to),
    };
  },
);

const decodeFeedback = Schema.decodeUnknownEffect(Schema.Array(Feedback));

export const emailRecentFeedback = Effect.fn("FeedbackJob.emailRecent")(
  function* () {
    const database = yield* Database;
    const { from, to } = yield* getFeedbackWindow();

    const rows = yield* database.query.feedbackTable
      .findMany({
        where: { createdAt: { gte: from, lt: to } },
        orderBy: { createdAt: "asc", id: "asc" },
      })
      .pipe(mapToReadError("FeedbackJob.listRecent", { from, to }));

    const feedback = yield* decodeFeedback(rows);

    if (!Array.isReadonlyArrayNonEmpty(feedback)) {
      return yield* new NoFeedback({ from, to });
    }

    yield* Effect.logInfo("feedback job: sending digest", {
      feedbackCount: feedback.length,
      from,
      to,
    });

    yield* sendFeedback(feedback, `feedback-digest:${from}:${to}`);
  },
  Effect.catchTag("FeedbackJobNoFeedback", ({ from, to }) =>
    Effect.logInfo("feedback job: no recent feedback", { from, to }),
  ),
);
