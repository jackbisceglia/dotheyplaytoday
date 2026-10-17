import { Effect } from "effect";

import { WebUrl } from "../../../lib/config/web.js";
import { type Lines, makeTiledHeadline } from "../headline.js";
import { Code, EmailView, Link, Note, Text } from "../render.js";
import type { EmailAddress } from "../../users/schema.js";
import { deliverTransactional } from "./delivery.js";

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

export const sendSignInLink = Effect.fn("SignInLink.send")(
  function* (recipient: EmailAddress, url: string) {
    const rendered = yield* renderSignInLink(url).pipe(Effect.orDie);
    yield* deliverTransactional(recipient, rendered);
  },
  Effect.tap(() => Effect.logInfo("sign-in link: delivered")),
  Effect.tapCause((cause) =>
    Effect.logError("sign-in link: delivery failed", { cause }),
  ),
);

export const sendSignInCode = Effect.fn("SignInCode.send")(
  function* (recipient: EmailAddress, code: string) {
    const rendered = yield* renderSignInCode(code).pipe(Effect.orDie);
    yield* deliverTransactional(recipient, rendered);
  },
  Effect.tap(() => Effect.logInfo("sign-in code: delivered")),
  Effect.tapCause((cause) =>
    Effect.logError("sign-in code: delivery failed", { cause }),
  ),
);
