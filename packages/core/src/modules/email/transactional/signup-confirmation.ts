import { Effect, Match, Schema } from "effect";

import { Id } from "../../../lib/id/service.js";
import { buildUnsubscribeUrl } from "../../../lib/unsubscribe.js";
import { EmailChannelClientLayerResend } from "../../channels/email/clients/resend.js";
import { EmailChannelClient } from "../../channels/email/clients/service.js";
import { EmailView, type EmailRendered } from "../../channels/email/render.js";
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

const formatLocalTime = (seconds: number, timezone: string) => {
  const hour = Math.floor(seconds / 3_600);
  const minute = Math.floor((seconds % 3_600) / 60);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12.toString()}:${minute.toString().padStart(2, "0")} ${period} (${timezone})`;
};

export const renderSignupConfirmation = Effect.fn("SignupConfirmation.render")(
  function* (confirmation: SignupConfirmation) {
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
        firstSignup: () => ({
          subject: "Welcome to dotheyplaytoday",
          heading: "You're on the roster",
          intro: "Your game-day email signup is active for these teams:",
        }),
        repeatSignup: () => ({
          subject: "Your Picks are Updated",
          heading: undefined,
          intro: "Your previous picks have been replaced with these teams:",
        }),
      }),
    );
    const schedule = `We'll email you at ${localTime} on days one of your teams plays.`;

    return EmailView({
      subject: copy.subject,
      main: [
        ...(copy.heading === undefined ? [] : [copy.heading, ""]),
        copy.intro,
        ...teamNames.map((name) => `- ${name}`),
        "",
        schedule,
      ],
      unsubscribe,
    }) satisfies EmailRendered;
  },
);

export const sendSignupConfirmation = Effect.fn("SignupConfirmation.send")(
  function* (confirmation: SignupConfirmation) {
    const client = yield* EmailChannelClient;
    const id = yield* Id;

    const rendered = yield* renderSignupConfirmation(confirmation).pipe(
      Effect.orDie,
    );

    yield* client
      .send(
        {
          recipient: confirmation.user.email,
          hash: yield* id.generate(),
        },
        rendered,
      )
      .pipe(
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
  Effect.provide(EmailChannelClientLayerResend),
);
