import { Effect, Schema } from "effect";

import { WebUrl } from "../../../lib/config/web.js";
import { Id } from "../../../lib/id/service.js";
import { EmailAddress, User } from "../../users/schema.js";
import { EmailView, Link, Note, Text } from "../render.js";
import { EmailLayerResend } from "../resend.js";
import { Email, type EmailDelivery } from "../service.js";

export type MagicLink = typeof MagicLink.Type;
export const MagicLink = Schema.Struct({
  recipient: EmailAddress,
  url: Schema.String,
  emailVerified: User.fields.emailVerified,
});

const SignInView = (url: string, home: string) =>
  EmailView({
    subject: "Sign in to dotheyplaytoday",
    headline: "Your sign-in",
    accent: "link.",
    home,
    preheader: "Sign in with this secure link.",
    blocks: [
      Text.make({ value: "Use this secure link to sign in:" }),
      Link.make({ href: url, text: "Sign in" }),
      Note.make({
        value:
          "This link expires in 15 minutes and can only be used once. If you did not request it, you can ignore this email.",
      }),
    ],
  });

const ConfirmUpdatesView = (url: string, home: string) =>
  EmailView({
    subject: "Confirm your updates",
    headline: "Confirm your",
    accent: "updates.",
    home,
    preheader: "Confirm your updates with this secure link.",
    blocks: [
      Text.make({
        value: "Confirm your email to start your saved updates and sign in:",
      }),
      Link.make({ href: url, text: "Confirm your updates" }),
      Note.make({
        value:
          "This link expires in 15 minutes and can only be used once. If you did not request it, you can ignore this email.",
      }),
    ],
  });

export const renderMagicLink = Effect.fn("MagicLink.render")(function* (
  magicLink: MagicLink,
) {
  const home = yield* WebUrl;

  return magicLink.emailVerified
    ? SignInView(magicLink.url, home)
    : ConfirmUpdatesView(magicLink.url, home);
});

export const sendMagicLink = Effect.fn("MagicLink.send")(function* (
  magicLink: MagicLink,
) {
  const email = yield* Email;
  const id = yield* Id;
  const rendered = yield* renderMagicLink(magicLink).pipe(Effect.orDie);
  const delivery: EmailDelivery = {
    recipient: magicLink.recipient,
    idempotencyKey: yield* id.generate(),
  };

  yield* email.send(delivery, rendered).pipe(
    Effect.tap(() =>
      Effect.logInfo("magic link: delivered", {
        user: magicLink.recipient,
      }),
    ),
    Effect.tapCause((cause) =>
      Effect.logError("magic link: delivery failed", {
        cause,
        user: magicLink.recipient,
      }),
    ),
  );
}, Effect.provide(EmailLayerResend));
