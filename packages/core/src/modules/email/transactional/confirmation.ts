import { Effect } from "effect";

import { Id } from "../../../lib/id/service.js";
import { Email } from "../service.js";
import { EmailLayerResend } from "../resend.js";
import { WebUrl } from "../../../lib/config/web.js";
import { type Lines, makeTiledHeadline } from "../headline.js";
import { Code, EmailView, Link, Note, Text } from "../render.js";
import type { EmailAddress } from "../../users/schema.js";

export const confirmationLines: Lines = ["Confirm your", "updates."];

export const renderConfirmationLink = Effect.fn("ConfirmationLink.render")(
  function* (url: string) {
    const home = yield* WebUrl;

    return EmailView({
      subject: "Confirm your updates",
      headline: makeTiledHeadline(home, confirmationLines),
      preheader: "Confirm your email to start your game-day updates.",
      blocks: [
        Text.make({
          value:
            "Your teams and schedule are saved. Confirm your email to start your updates:",
        }),
        Link.make({ href: url, text: "Confirm your updates" }),
        Note.make({
          value:
            "This link expires in 15 minutes and can only be used once. If you did not request it, you can ignore this email.",
        }),
      ],
    });
  },
);

export const renderConfirmationCode = Effect.fn("ConfirmationCode.render")(
  function* (code: string) {
    const home = yield* WebUrl;

    return EmailView({
      subject: "Confirm your updates",
      headline: makeTiledHeadline(home, confirmationLines),
      preheader: "Enter this code to confirm your email.",
      blocks: [
        Text.make({
          value:
            "Your teams and schedule are saved. Enter this code to confirm your email and start your updates:",
        }),
        Code.make({ value: code }),
        Note.make({
          value:
            "This code expires in 10 minutes and can only be used once. If you did not request it, you can ignore this email.",
        }),
      ],
    });
  },
);

const createSendConfirmation = (render: typeof renderConfirmationLink) =>
  Effect.fn("Confirmation.send")(
    function* (recipient: EmailAddress, value: string) {
      const rendered = yield* render(value).pipe(Effect.orDie);
      const email = yield* Email;
      const id = yield* Id;

      yield* email.send(
        { recipient, idempotencyKey: yield* id.generate() },
        rendered,
      );
    },
    Effect.tap(() => Effect.logInfo("confirmation: delivered")),
    Effect.tapCause((cause) =>
      Effect.logError("confirmation: delivery failed", { cause }),
    ),
    Effect.provide(EmailLayerResend),
  );

export const sendConfirmationLink = createSendConfirmation(
  renderConfirmationLink,
);
export const sendConfirmationCode = createSendConfirmation(
  renderConfirmationCode,
);
