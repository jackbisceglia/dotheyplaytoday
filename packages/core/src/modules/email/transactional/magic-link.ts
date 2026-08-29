import { Effect } from "effect";

import { WebUrl } from "../../../lib/config/web.js";
import { Id } from "../../../lib/id/service.js";
import type { EmailAddress } from "../../users/schema.js";
import { EmailView, Link, Note, Text } from "../render.js";
import { EmailLayerResend } from "../resend.js";
import { Email } from "../service.js";

export const renderMagicLink = Effect.fn("MagicLink.render")(function* (
  url: string,
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
      Link.make({ href: url, text: "Sign in" }),
      Note.make({
        value:
          "This link expires soon and can only be used once. If you did not request it, you can ignore this email.",
      }),
    ],
  });
});

export const sendMagicLink = Effect.fn("MagicLink.send")(function* (
  recipient: EmailAddress,
  url: string,
) {
  const email = yield* Email;
  const id = yield* Id;
  const rendered = yield* renderMagicLink(url);

  yield* email.send(
    { recipient, idempotencyKey: yield* id.generate() },
    rendered,
  );
});

export const sendMagicLinkEmail = (recipient: EmailAddress, url: string) =>
  sendMagicLink(recipient, url).pipe(Effect.provide(EmailLayerResend));
