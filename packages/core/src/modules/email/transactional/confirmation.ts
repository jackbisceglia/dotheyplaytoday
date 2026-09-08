import { Effect } from "effect";

import { WebUrl } from "../../../lib/config/web.js";
import { EmailView, Link, Note, Text } from "../render.js";
import { EmailLayerResend } from "../resend.js";
import { deliverMagicLink, type MagicLink } from "./magic-link.js";

export const renderConfirmationLink = Effect.fn("ConfirmationLink.render")(
  function* (confirmation: MagicLink) {
    const home = yield* WebUrl;

    return EmailView({
      subject: "Confirm your updates",
      headline: "Confirm your",
      accent: "updates.",
      home,
      preheader: "Confirm your email to start your game-day updates.",
      blocks: [
        Text.make({
          value:
            "Your teams and schedule are saved. Confirm your email to start your updates:",
        }),
        Link.make({ href: confirmation.url, text: "Confirm your updates" }),
        Note.make({
          value:
            "This link expires in 15 minutes and can only be used once. If you did not request it, you can ignore this email.",
        }),
      ],
    });
  },
);

export const sendConfirmationLink = Effect.fn("ConfirmationLink.send")(
  function* (link: MagicLink) {
    const rendered = yield* renderConfirmationLink(link).pipe(Effect.orDie);
    yield* deliverMagicLink(link.recipient, rendered);
  },
  Effect.provide(EmailLayerResend),
);
