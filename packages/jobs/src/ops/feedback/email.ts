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

  const entry = (f: Feedback) => {
    const label = Match.value(f.type).pipe(
      Match.when("new_subject", () => "New subject"),
      Match.when("general", () => "General"),
      Match.exhaustive,
    );

    return `${DateTime.formatIso(f.createdAt)} · ${label} — ${f.request}`;
  };

  return EmailView({
    subject,
    headline: "New feedback",
    accent: "landed.",
    preheader: feedback[0].request,
    blocks: [
      Text.make({ value: `${subject} waiting for review:` }),
      ...feedback.map((f) => Note.make({ value: entry(f) })),
    ],
  }) satisfies EmailRendered;
}
