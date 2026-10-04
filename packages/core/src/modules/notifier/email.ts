import { Effect, Layer, Match, Schema } from "effect";

import { WebUrl } from "../../lib/config/web.js";
import { buildUnsubscribeUrl } from "../../lib/unsubscribe.js";
import { EmailLayerResend } from "../email/resend.js";
import { Email, type EmailDelivery } from "../email/service.js";
import { EmailView, type EmailRendered } from "../email/render.js";
import { SubjectId } from "../subjects/schema.js";
import { NotifierError } from "./errors.js";
import { esportsTeamEmail, esportsTeamFeed } from "./feeds/esports.js";
import type { FeedContext } from "./feeds/shared.js";
import { sportsTeamEmail, sportsTeamFeed } from "./feeds/sports.js";
import type { Notification } from "./notification.js";
import { Notifier } from "./service.js";

const makeEmailDelivery = (notification: Notification): EmailDelivery => ({
  recipient: notification.user.email,
  idempotencyKey: Notifier.createDeliveryHash(notification),
});

export class UnsupportedFeedError extends Schema.TaggedErrorClass<UnsupportedFeedError>()(
  "UnsupportedFeedError",
  {
    message: Schema.String,
    subjectId: SubjectId,
  },
) {}

const getEmailViewProps = Effect.fn("NotifierLayerEmail.getEmailViewProps")(
  function* (notification: Notification) {
    const context: FeedContext = {
      home: yield* WebUrl,
      unsubscribeUrl: yield* buildUnsubscribeUrl(
        notification.user.unsubscribeToken,
      ),
    };

    return yield* Match.value(notification).pipe(
      Match.when(sportsTeamFeed, (notification) =>
        sportsTeamEmail(notification, context),
      ),
      Match.when(esportsTeamFeed, (notification) =>
        esportsTeamEmail(notification, context),
      ),
      Match.orElse((notification) =>
        Effect.fail(
          new UnsupportedFeedError({
            message:
              "Expected the subject and every event to belong to one feed",
            subjectId: notification.subject.id,
          }),
        ),
      ),
    );
  },
);

export const NotifierLayerEmail = Notifier.makeLayer(
  Effect.gen(function* () {
    const email = yield* Email;

    const render = Effect.fn(function* (notification: Notification) {
      const props = yield* getEmailViewProps(notification);

      return EmailView(props);
    });

    const send = Effect.fn(function* (
      notification: Notification,
      rendered: EmailRendered,
    ) {
      return yield* email.send(makeEmailDelivery(notification), rendered).pipe(
        Effect.mapError(
          (cause) =>
            new NotifierError({
              layer: "NotifierLayerEmail",
              message: cause.message,
              cause,
            }),
        ),
      );
    });

    return {
      render,
      send,
    };
  }),
).pipe(Layer.provide(EmailLayerResend));
