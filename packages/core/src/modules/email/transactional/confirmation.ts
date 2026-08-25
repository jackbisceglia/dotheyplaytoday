import { Effect, Match, Schema } from "effect";

import { Id } from "../../../lib/id/service.js";
import { WebUrl } from "../../../lib/config/web.js";
import { buildUnsubscribeUrl } from "../../../lib/unsubscribe.js";
import { EmailLayerResend } from "../resend.js";
import { Email, type EmailDelivery } from "../service.js";
import { EmailBlock, EmailView, type EmailRendered } from "../render.js";
import { Subject } from "../../subjects/schema.js";
import { Subscription } from "../../subscriptions/schema.js";
import { User } from "../../users/schema.js";

const fields = {
  user: User,
  subjects: Schema.NonEmptyArray(Subject),
  schedule: Subscription.fields.schedule,
};

export type SignupConfirmation = typeof SignupConfirmation.Type;
export const SignupConfirmation = Schema.TaggedUnion({
  firstSignup: fields,
  repeatSignup: fields,
});

const formatTimezoneAbbreviation = (timezone: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "shortGeneric",
  })
    .formatToParts()
    .find((part) => part.type === "timeZoneName")?.value ?? timezone;

const formatLocalTime = (seconds: number, timezone: string) => {
  const hour = Math.floor(seconds / 3_600);
  const minute = Math.floor((seconds % 3_600) / 60);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  const timezoneAbbreviation = formatTimezoneAbbreviation(timezone);

  return `${hour12.toString()}:${minute.toString().padStart(2, "0")} ${period} ${timezoneAbbreviation}`;
};

export const renderSignupConfirmation = Effect.fn("SignupConfirmation.render")(
  function* (confirmation: SignupConfirmation) {
    const home = yield* WebUrl;
    const unsubscribeUrl = yield* buildUnsubscribeUrl(
      confirmation.user.unsubscribeToken,
    );

    const localTime = formatLocalTime(
      confirmation.schedule.sendAtSecondsLocal,
      confirmation.user.timezone.id,
    );

    const teamNames = confirmation.subjects.map(
      (subject) => subject.details.display,
    );

    const copy = Match.value(confirmation).pipe(
      Match.tagsExhaustive({
        firstSignup: () => ({
          subject: "Welcome to dotheyplaytoday",
          headline: "You're on the",
          accent: "roster.",
          intro: "Your game-day email signup is active for these teams:",
        }),
        repeatSignup: () => ({
          subject: "Your picks are updated",
          headline: "Picks",
          accent: "updated.",
          intro: "We replaced your previous picks with these teams:",
        }),
      }),
    );
    const schedule = `We'll email you at ${localTime} on days one of your teams plays.`;

    return EmailView({
      subject: copy.subject,
      home,
      headline: copy.headline,
      accent: copy.accent,
      blocks: [
        EmailBlock.text(copy.intro),
        EmailBlock.list(teamNames),
        EmailBlock.note(schedule),
        EmailBlock.link(unsubscribeUrl, "Unsubscribe"),
      ],
      unsubscribeUrl,
    }) satisfies EmailRendered;
  },
);

export const sendSignupConfirmation = Effect.fn("SignupConfirmation.send")(
  function* (confirmation: SignupConfirmation) {
    const email = yield* Email;
    const id = yield* Id;

    const rendered = yield* renderSignupConfirmation(confirmation).pipe(
      Effect.orDie,
    );
    const delivery: EmailDelivery = {
      recipient: confirmation.user.email,
      idempotencyKey: yield* id.generate(),
    };

    yield* email.send(delivery, rendered).pipe(
      Effect.tap(() =>
        Effect.logInfo("signup confirmation: delivered", {
          kind: confirmation._tag,
          user: confirmation.user.email,
        }),
      ),
      Effect.tapCause((cause) =>
        Effect.logError("signup confirmation: delivery failed", {
          cause,
          kind: confirmation._tag,
          user: confirmation.user.email,
        }),
      ),
    );
  },
  Effect.provide(EmailLayerResend),
);
