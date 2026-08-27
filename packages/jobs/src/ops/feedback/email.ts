import { Array, DateTime, Match } from "effect";

import {
  Entry,
  EmailView,
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

    const detail = DateTime.formatUtc(feedback.createdAt, {
      locale: "en-US",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });

    return Entry.make({ label, detail, value: feedback.request });
  };

  return EmailView({
    subject,
    headline: "New feedback",
    accent: "landed.",
    preheader: feedback[0].request,
    blocks: [
      Text.make({ value: `${subject} waiting for review:` }),
      ...feedback.map(entry),
    ],
  }) satisfies EmailRendered;
}
