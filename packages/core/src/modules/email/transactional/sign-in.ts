import { Effect } from "effect";

import { Id } from "../../../lib/id/service.js";
import { Email } from "../service.js";
import { WebUrl } from "../../../lib/config/web.js";
import { EmailView, Link, Note, Text } from "../render.js";
import { EmailLayerResend } from "../resend.js";
import type { EmailAddress } from "../../users/schema.js";

export const renderSignInLink = Effect.fn("SignInLink.render")(function* (
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
          "This link expires in 15 minutes and can only be used once. If you did not request it, you can ignore this email.",
      }),
    ],
  });
});

export const sendSignInLink = Effect.fn("SignInLink.send")(
  function* (recipient: EmailAddress, url: string) {
    const rendered = yield* renderSignInLink(url).pipe(Effect.orDie);
    const email = yield* Email;
    const id = yield* Id;

    yield* email.send(
      { recipient, idempotencyKey: yield* id.generate() },
      rendered,
    );
  },
  Effect.tap(() => Effect.logInfo("sign-in link: delivered")),
  Effect.tapCause((cause) =>
    Effect.logError("sign-in link: delivery failed", { cause }),
  ),
  Effect.provide(EmailLayerResend),
);
