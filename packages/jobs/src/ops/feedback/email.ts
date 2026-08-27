import { Array, DateTime, Match } from "effect";

import {
  EmailView,
  Note,
  Text,
  type EmailRendered,
} from "@dtpt/core/modules/email/render";
import { type Feedback } from "@dtpt/core/modules/feedback/schema";

export function render(feedback: Array.NonEmptyReadonlyArray<Feedback>) {
  const count = feedback.length;
  const subject = `${count.toString()} new feedback ${count === 1 ? "submission" : "submissions"}`;

  const entry = (feedback: Feedback) => {
    const label = Match.value(feedback.type).pipe(
      Match.when("new_subject", () => "New subject"),
      Match.when("general", () => "General"),
      Match.exhaustive,
    );

    return `${DateTime.formatIso(feedback.createdAt)} · ${label} — ${feedback.request}`;
  };

  return EmailView({
    subject,
    headline: "New feedback",
    accent: "landed.",
    preheader: feedback[0].request,
    blocks: [
      Text.make({ value: `${subject} waiting for review:` }),
      ...feedback.map((item) => Note.make({ value: entry(item) })),
    ],
  }) satisfies EmailRendered;
}
