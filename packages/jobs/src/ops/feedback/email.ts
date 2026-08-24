import { Array, DateTime, Effect } from "effect";

import {
  EmailBlock,
  EmailView,
  type EmailRendered,
} from "@dtpt/core/modules/email/render";
import { makeEmailLayerResend } from "@dtpt/core/modules/email/resend";
import { Email } from "@dtpt/core/modules/email/service";
import { type Feedback } from "@dtpt/core/modules/feedback/schema";
import { EmailAddress } from "@dtpt/core/modules/users/schema";
import { AdminEmail } from "../config.js";

export const FeedbackEmailLayer = makeEmailLayerResend({
  from: {
    name: "ops, dotheyplaytoday",
    email: EmailAddress.make("ops@dotheyplay.today"),
  },
});

const feedbackLabel = (feedback: Feedback) =>
  feedback.type === "new_subject" ? "New subject" : "General";

const feedbackLine = (feedback: Feedback) =>
  `${DateTime.formatIso(feedback.createdAt)} · ${feedbackLabel(feedback)} — ${feedback.request}`;

function render(feedback: Array.NonEmptyReadonlyArray<Feedback>) {
  const count = feedback.length;

  return EmailView({
    subject: `${count.toString()} new feedback ${count === 1 ? "submission" : "submissions"}`,
    headline: "New feedback",
    accent: "landed.",
    preheader: feedback[0].request,
    blocks: [
      EmailBlock.text(
        `${count.toString()} ${count === 1 ? "submission is" : "submissions are"} waiting for review:`,
      ),
      ...feedback.map((item) => EmailBlock.note(feedbackLine(item))),
    ],
  }) satisfies EmailRendered;
}

export const sendFeedback = Effect.fn("Feedback.send")(function* (
  feedback: Array.NonEmptyReadonlyArray<Feedback>,
  idempotencyKey: string,
) {
  const recipient = yield* AdminEmail;
  const email = yield* Email;
  const rendered = render(feedback);

  yield* email.send({ recipient, idempotencyKey }, rendered).pipe(
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
});
