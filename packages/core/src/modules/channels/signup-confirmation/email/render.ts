import { Effect, Match } from "effect";

import { buildUnsubscribeUrl } from "../../../../lib/unsubscribe.js";
import { EmailView, type EmailRendered } from "../../email/render.js";
import type { SignupConfirmation } from "../schema.js";

const formatLocalTime = (seconds: number, timezone: string) => {
  const hour = Math.floor(seconds / 3_600);
  const minute = Math.floor((seconds % 3_600) / 60);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12.toString()}:${minute.toString().padStart(2, "0")} ${period} (${timezone})`;
};

export const renderSignupConfirmation = Effect.fn(
  "SignupEmail.renderConfirmation",
)(function* (confirmation: SignupConfirmation) {
  const unsubscribe = {
    text: "Unsubscribe",
    href: yield* buildUnsubscribeUrl(confirmation.user.unsubscribeToken),
  };
  const localTime = formatLocalTime(
    confirmation.schedule.sendAtSecondsLocal,
    confirmation.user.timezone.id,
  );
  const teamNames = confirmation.subjects.map(
    (subject) => subject.details.display,
  );

  const copy = Match.value(confirmation).pipe(
    Match.tagsExhaustive({
      first_signup: () => ({
        subject: "Welcome to dotheyplaytoday",
        heading: "You're on the roster",
        intro: "Your game-day email signup is active for these teams:",
      }),
      repeat_signup: () => ({
        subject: "Your dotheyplaytoday picks are updated",
        heading: "Your picks are updated",
        intro: "Your previous picks have been replaced with these teams:",
      }),
    }),
  );
  const schedule = `We'll email you at ${localTime} on days one of your teams plays.`;
  return EmailView({
    subject: copy.subject,
    main: [
      copy.heading,
      "",
      copy.intro,
      ...teamNames.map((name) => `- ${name}`),
      "",
      schedule,
    ],
    unsubscribe,
  }) satisfies EmailRendered;
});
