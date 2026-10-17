import { Effect } from "effect";

import { Id } from "../../../lib/id/service.js";
import { Email } from "../service.js";
import { EmailLayerResend } from "../resend.js";
import { WebUrl } from "../../../lib/config/web.js";
import { type Lines, makeTiledHeadline } from "../headline.js";
import { Code, EmailView, Link, Note, Text } from "../render.js";
import type { EmailAddress } from "../../users/schema.js";

export const signInLines: Lines = ["Your sign-in", "link."];
export const signInCodeLines: Lines = ["Your sign-in", "code."];

export const renderSignInLink = Effect.fn("SignInLink.render")(function* (
  url: string,
) {
  const home = yield* WebUrl;

  return EmailView({
    subject: "Sign in to dotheyplaytoday",
    headline: makeTiledHeadline(home, signInLines),
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

export const renderSignInCode = Effect.fn("SignInCode.render")(function* (
  code: string,
) {
  const home = yield* WebUrl;

  return EmailView({
    subject: "Your dotheyplaytoday sign-in code",
    headline: makeTiledHeadline(home, signInCodeLines),
    preheader: "Enter this code to sign in.",
    blocks: [
      Text.make({ value: "Enter this code to sign in:" }),
      Code.make({ value: code }),
      Note.make({
        value:
          "This code expires in 10 minutes and can only be used once. If you did not request it, you can ignore this email.",
      }),
    ],
  });
});

const createSendSignIn = (render: typeof renderSignInLink) =>
  Effect.fn("SignIn.send")(
    function* (recipient: EmailAddress, value: string) {
      const rendered = yield* render(value).pipe(Effect.orDie);
      const email = yield* Email;
      const id = yield* Id;

      yield* email.send(
        { recipient, idempotencyKey: yield* id.generate() },
        rendered,
      );
    },
    Effect.tap(() => Effect.logInfo("sign-in: delivered")),
    Effect.tapCause((cause) =>
      Effect.logError("sign-in: delivery failed", { cause }),
    ),
    Effect.provide(EmailLayerResend),
  );

export const sendSignInLink = createSendSignIn(renderSignInLink);
export const sendSignInCode = createSendSignIn(renderSignInCode);
