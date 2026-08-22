import { type Array, DateTime, Effect, Layer, Match, Schema } from "effect";

import type { ExtractFromTag } from "../../../lib/types.js";
import { WebUrl } from "../../../lib/config/web.js";
import { buildUnsubscribeUrl } from "../../../lib/unsubscribe.js";
import { EventId } from "../../events/schema.js";
import type { EventWithParticipants } from "../../events/service.js";
import type { Subject } from "../../subjects/schema.js";
import type { User } from "../../users/schema.js";
import type { Notification } from "../notification/schema.js";
import { Channel } from "../service.js";
import { EmailChannelClientLayerResend } from "./clients/resend.js";
import { EmailChannelClient } from "./clients/service.js";
import { EmailDelivery } from "./delivery.js";
import {
  EmailBlock,
  EmailView,
  type EmailMatchup,
  type EmailRendered,
  type EmailViewProps,
} from "./render.js";

const isTaggedAs =
  <const TTag extends PropertyKey>(tag: TTag) =>
  <TValue extends { readonly _tag: PropertyKey }>(
    value: TValue,
  ): value is Extract<TValue, { readonly _tag: TTag }> =>
    value._tag === tag;

export class EmailRenderError extends Schema.TaggedErrorClass<EmailRenderError>()(
  "EmailRenderError",
  {
    message: Schema.String,
    eventId: EventId,
    role: Schema.Literals(["home", "away"]),
  },
) {}

type SportsGameEvents = Array.NonEmptyReadonlyArray<SportsGameEvent>;
type SportsGameEvent = ExtractFromTag<EventWithParticipants, "sports_game">;
type SportsGameParticipant = SportsGameEvent["participants"][number];

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

type SubjectSide = {
  readonly leading: SportsGameParticipant;
  readonly trailing: SportsGameParticipant;
  readonly separator: "@" | "vs.";
};

/**
 * When every event in the batch shares exactly one participant title, that
 * title must be the subscriber's team: the events were pulled in because
 * they're the subject's games, so a team present in all of them can only be
 * the subject. This is a structural inference, not a guess.
 */
const findSharedParticipantTitle = (
  events: SportsGameEvents,
): string | undefined => {
  if (events.length < 2) return undefined;

  const titleCounts = new Map<string, number>();

  for (const event of events) {
    for (const participant of event.participants) {
      const title = participant.details.title;

      titleCounts.set(title, (titleCounts.get(title) ?? 0) + 1);
    }
  }

  let sharedTitle: string | undefined;

  for (const [title, count] of titleCounts) {
    if (count !== events.length) continue;
    if (sharedTitle !== undefined) return undefined;
    sharedTitle = title;
  }

  return sharedTitle;
};

/**
 * Best-effort guess at which participant is the subscriber's team, used when
 * {@link findSharedParticipantTitle} has nothing to compare across (a single
 * event). Participant titles carry no id back to the subject, so this is a
 * plain string match against the subject's display name — it can miss
 * (differing formatting, renamed teams), in which case callers should treat
 * `undefined` as "ordering doesn't matter".
 */
const guessSubjectSide = (
  home: SportsGameParticipant,
  away: SportsGameParticipant,
  subjectDisplay: string,
): SubjectSide | undefined => {
  const normalize = (value: string) => value.trim().toLowerCase();
  const target = normalize(subjectDisplay);

  if (normalize(home.details.title) === target) {
    return { leading: home, trailing: away, separator: "vs." };
  }
  if (normalize(away.details.title) === target) {
    return { leading: away, trailing: home, separator: "@" };
  }

  return undefined;
};

const orderBySubject = (
  home: SportsGameParticipant,
  away: SportsGameParticipant,
  sharedParticipantTitle: string | undefined,
  subjectDisplay: string,
): SubjectSide => {
  if (sharedParticipantTitle === home.details.title) {
    return { leading: home, trailing: away, separator: "vs." };
  }
  if (sharedParticipantTitle === away.details.title) {
    return { leading: away, trailing: home, separator: "@" };
  }

  return (
    guessSubjectSide(home, away, subjectDisplay) ?? {
      leading: away,
      trailing: home,
      separator: "@",
    }
  );
};

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
    const home = yield* WebUrl;
    const unsubscribeUrl = yield* buildUnsubscribeUrl(
      notification.user.unsubscribeToken,
    );
    const cases = createFeedCases();

    return yield* Match.value(notification).pipe(
      Match.when(cases.sportsTeamFeed, (notification) =>
        Effect.gen(function* () {
          const subject = `${notification.subject.details.name} play today`;

          const sharedParticipantTitle = findSharedParticipantTitle(
            notification.events,
          );

          const matchups = yield* Effect.forEach(notification.events, (game) =>
            Effect.gen(function* () {
              const { home, away } =
                yield* requireSportsParticipantsRoles(game);

              const { leading, trailing, separator } = orderBySubject(
                home,
                away,
                sharedParticipantTitle,
                notification.subject.details.display,
              );

              return {
                leading: leading.details.title,
                separator,
                trailing: trailing.details.title,
                detail: formatStartTime(game, timezone),
              } satisfies EmailMatchup;
            }),
          );

          const unsubscribe = {
            text: "Unsubscribe",
            href: unsubscribeUrl,
          };

          return {
            subject,
            home,
            headline: `${notification.subject.details.name} play`,
            accent: "today.",
            blocks: [EmailBlock.matchups(matchups)],
            unsubscribe,
          } satisfies EmailViewProps;
        }),
      ),
      Match.exhaustive,
    );
  },
);

export const EmailChannelLayer = Channel.makeLayer(
  Effect.gen(function* () {
    const client = yield* EmailChannelClient;

    const render = Effect.fn(function* (notification: Notification) {
      const props = yield* getEmailViewProps(notification);

      return EmailView(props);
    });

    const send = Effect.fn(function* (
      notification: Notification,
      rendered: EmailRendered,
    ) {
      const delivery = EmailDelivery.makeFromNotification(notification);

      return yield* client.send(delivery, rendered);
    });

    return {
      render,
      send,
    };
  }),
).pipe(Layer.provide(EmailChannelClientLayerResend));
