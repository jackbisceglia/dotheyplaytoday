import { Effect, Match } from "effect";

import { StringParts } from "../../../../lib/string.js";
import { buildUnsubscribeUrl } from "../../../../lib/unsubscribe.js";
import {
  emailDesign,
  escapeHtml,
  type EmailRendered,
  renderUnsubscribeHtml,
  renderUnsubscribeText,
} from "../../email/design.js";
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
  const text = StringParts()
    .add(copy.heading)
    .add("")
    .add(copy.intro)
    .addParts(...teamNames.map((name) => `- ${name}`))
    .add("")
    .add(schedule)
    .add("")
    .add(renderUnsubscribeText(unsubscribe))
    .make("\n");
  const TeamList = teamNames
    .map((name) => `<li style="margin: 0 0 4px;">${escapeHtml(name)}</li>`)
    .join("");
  const paragraph = (content: string) =>
    `<p style="${emailDesign.paragraph}">${content}</p>`;
  const html = `<!DOCTYPE html>
<html lang="en">
  <body style="${emailDesign.body}">
    <div style="${emailDesign.container}">
      <p style="${emailDesign.heading}">${escapeHtml(copy.heading)}</p>
      ${paragraph(escapeHtml(copy.intro))}
      <ul style="margin: 0 0 12px; padding-left: 20px; font-size: 15px; line-height: 1.5; color: #1f2937;">${TeamList}</ul>
      ${paragraph(escapeHtml(schedule))}
      <div style="${emailDesign.footer}">${renderUnsubscribeHtml(unsubscribe)}</div>
    </div>
  </body>
</html>`;

  return {
    subject: copy.subject,
    body: { text, html },
  } satisfies EmailRendered;
});
