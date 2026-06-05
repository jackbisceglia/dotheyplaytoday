import { type Array, DateTime, Effect, Layer, Match, Schema } from "effect";

import { StringParts } from "../../../../lib/string.js";
import { isTaggedAs } from "../../../../lib/tagged.js";
import type { ExtractFromTag } from "../../../../lib/types.js";
import { buildUnsubscribeUrl } from "../../../../lib/url.js";
import { EventId } from "../../../events/schema.js";
import type { EventWithParticipants } from "../../../events/service.js";
import type { Subject } from "../../../subjects/schema.js";
import type { EmailAddress, User } from "../../../users/schema.js";
import type { Notification } from "../../schema.js";
import { Channel } from "../service.js";
import { EmailChannelClient } from "./clients/service.js";
import { EmailView, type EmailRendered } from "./render.js";

export class EmailRenderError extends Schema.TaggedErrorClass<EmailRenderError>()(
  "EmailRenderError",
  {
    message: Schema.String,
    eventId: EventId,
    role: Schema.Literals(["home", "away"]),
  },
) {}

export class EmailChannel extends Channel.makeService<
  EmailChannel,
  EmailAddress,
  EmailRendered,
  EmailRenderError
>()("@dtpt/core-v2/EmailChannel") {}

type SportsGameEvents = Array.NonEmptyReadonlyArray<SportsGameEvent>;
type SportsGameEvent = ExtractFromTag<EventWithParticipants, "sports_game">;

type SportsTeamSubject = Subject & {
  readonly details: ExtractFromTag<Subject["details"], "sports_team">;
};

function createFeedCases() {
  // subjects
  const isSportsTeam = (
    subject: Notification["subject"],
  ): subject is SportsTeamSubject => isTaggedAs("sports_team")(subject.details);

  // events
  const areSportsGames = (
    events: Notification["events"],
  ): events is SportsGameEvents =>
    events.length > 0 && events.every(isTaggedAs("sports_game"));

  return {
    sportsTeamFeed: {
      subject: isSportsTeam,
      events: areSportsGames,
    },
  };
}

const requireSportsParticipantsRoles = Effect.fn(
  "EmailChannel.requireSportsParticipantsRoles",
)(function* (event: SportsGameEvent) {
  const home = event.participants.find((p) => p.details.role === "home");
  const away = event.participants.find((p) => p.details.role === "away");

  if (!home || !away) {
    const role = home ? "away" : "home";

    return yield* new EmailRenderError({
      message: "Expected sports_game event to have participant role",
      eventId: event.id,
      role,
    });
  }

  return { home, away };
});

const formatStartTime = (event: SportsGameEvent, tz: User["timezone"]) => {
  const userLocaleDateTime = DateTime.setZone(event.startsAt, tz);

  return DateTime.format(userLocaleDateTime, {
    locale: "en-US",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
};

const getEmailViewProps = Effect.fn("EmailChannel.getEmailViewProps")(
  function* (notification: Notification) {
    const timezone = notification.user.timezone;
    const unsubscribeUrl = yield* buildUnsubscribeUrl(
      notification.user.unsubscribeToken,
    );
    const cases = createFeedCases();

    return yield* Match.value(notification).pipe(
      Match.when(cases.sportsTeamFeed, (notification) =>
        Effect.gen(function* () {
          const subject = `${notification.subject.details.location} ${notification.subject.details.name} play today`;

          const main = yield* Effect.forEach(notification.events, (game) =>
            Effect.gen(function* () {
              const { home, away } =
                yield* requireSportsParticipantsRoles(game);

              return StringParts()
                .add(`${away.details.title} at ${home.details.title}`)
                .add(formatStartTime(game, timezone))
                .make(", ");
            }),
          );

          const unsubscribe = {
            text: "Unsubscribe",
            href: unsubscribeUrl,
          };

          return { subject, main, unsubscribe };
        }),
      ),
      Match.exhaustive,
    );
  },
);

export const EmailChannelLayer = Layer.effect(
  EmailChannel,
  Effect.gen(function* () {
    const client = yield* EmailChannelClient;

    type Service = EmailChannel["Service"];

    const render: Service["render"] = Effect.fn("EmailChannel.render")(
      function* (notification) {
        const props = yield* getEmailViewProps(notification);

        return EmailView(props);
      },
    );

    const send: Service["send"] = Effect.fn("EmailChannel.send")(
      function* (to, rendered) {
        return yield* client.send(to, rendered);
      },
    );

    return EmailChannel.of({ render, send });
  }),
);
