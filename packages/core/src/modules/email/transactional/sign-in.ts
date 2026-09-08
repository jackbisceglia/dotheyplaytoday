import { Effect } from "effect";

import { WebUrl } from "../../../lib/config/web.js";
import { EmailView, Link, Note, Text } from "../render.js";
import { EmailLayerResend } from "../resend.js";
import { deliverMagicLink, type MagicLink } from "./magic-link.js";

export const renderSignInLink = Effect.fn("SignInLink.render")(function* (
  magicLink: MagicLink,
) {
  const home = yield* WebUrl;

  return EmailView({
    subject: "Sign in to dotheyplaytoday",
    headline: "Your sign-in",
    accent: "link.",
    home,
    preheader: "Use this secure link to sign in.",
    blocks: [
      Text.make({ value: "Use this secure link to sign in:" }),
      Link.make({ href: magicLink.url, text: "Sign in" }),
      Note.make({
        value:
          "This link expires in 15 minutes and can only be used once. If you did not request it, you can ignore this email.",
      }),
    ],
  });
});

export const sendSignInLink = Effect.fn("SignInLink.send")(function* (
  link: MagicLink,
) {
  const rendered = yield* renderSignInLink(link).pipe(Effect.orDie);
  yield* deliverMagicLink(link.recipient, rendered);
}, Effect.provide(EmailLayerResend));
