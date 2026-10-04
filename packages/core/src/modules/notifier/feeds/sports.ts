import { type Array, DateTime, Effect, Schema } from "effect";

import { type Lines, makeTiledHeadline } from "../../email/headline.js";
import {
  Link,
  Matchups,
  type EmailMatchup,
  type EmailViewProps,
} from "../../email/render.js";
import type { SportParticipant } from "../../events/participants/variants/sport.schema.js";
import type { Participant } from "../../events/participants/schema.js";
import { EventId } from "../../events/schema.js";
import type { EventWithParticipants } from "../../events/service.js";
import type { SportEvent } from "../../events/variants/sport.schema.js";
import type { Subject } from "../../subjects/schema.js";
import type { SportTeamSubject } from "../../subjects/variants/sport.schema.js";
import type { User } from "../../users/schema.js";
import type { Notification } from "../notification.js";
import {
  type FeedContext,
  findSharedParticipantTitle,
  formatStartTime,
  isTaggedAs,
} from "./shared.js";

export class EmailRenderError extends Schema.TaggedErrorClass<EmailRenderError>()(
  "EmailRenderError",
  {
    message: Schema.String,
    eventId: EventId,
    role: Schema.Literals(["home", "away"]),
  },
) {}

type SportsGameParticipant = Omit<Participant, "details"> & {
  readonly details: SportParticipant;
};
type SportsGameEvent = Omit<
  EventWithParticipants,
  "details" | "participants"
> & {
  readonly details: SportEvent;
  readonly participants: readonly SportsGameParticipant[];
};
type SportsGameEvents = Array.NonEmptyReadonlyArray<SportsGameEvent>;

type SportsTeamSubject = Omit<Subject, "details"> & {
  readonly details: SportTeamSubject;
};

export type SportsTeamNotification = Omit<
  Notification,
  "subject" | "events"
> & {
  readonly subject: SportsTeamSubject;
  readonly events: SportsGameEvents;
};

const isSportsTeam = (
  subject: Notification["subject"],
): subject is SportsTeamSubject => isTaggedAs("sports_team")(subject.details);

const isSportsGame = (event: EventWithParticipants): event is SportsGameEvent =>
  isTaggedAs("sports_game")(event.details) &&
  event.participants.every((participant) =>
    isTaggedAs("sports_game")(participant.details),
  );

const areSportsGames = (
  events: Notification["events"],
): events is SportsGameEvents =>
  events.length > 0 && events.every(isSportsGame);

export const sportsTeamFeed = {
  subject: isSportsTeam,
  events: areSportsGames,
};

const requireSportsParticipantsRoles = Effect.fn(
  "NotifierLayerEmail.requireSportsParticipantsRoles",
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

export const gameDayLines = (team: SportTeamSubject): Lines => [
  team.name,
  "play today.",
];

export const kickoffLines: Lines = ["Football is", "back."];

// TODO: Generalize this into configurable special events. It is dead after NFL
// kickoff (2026-09-13), and the NBA opener in October will want a variant with
// slightly different rules. Instead of deleting it, open a PR that moves the
// date, league, and header/subject copy into data (likely a database table),
// so each season opener is a row rather than a code change.
const shouldIncludeNflKickoffEvent = (
  events: SportsGameEvents,
  sendAt: Notification["sendAt"],
  timezone: User["timezone"],
) => {
  const NFL_KICKOFF_DATE = "2026-09-13";

  const hasNflGame = () =>
    events.some((event) => event.details.leagueId === "nfl");

  /** Local to the recipient: a Pacific Sunday evening is already Monday in UTC. */
  const isNflKickoffDay = () =>
    DateTime.formatIsoDate(DateTime.setZone(sendAt, timezone)) ===
    NFL_KICKOFF_DATE;

  return hasNflGame() && isNflKickoffDay();
};

export const sportsTeamEmail = Effect.fn("NotifierLayerEmail.sportsTeamEmail")(
  function* (notification: SportsTeamNotification, context: FeedContext) {
    const timezone = notification.user.timezone;
    const kickoff = shouldIncludeNflKickoffEvent(
      notification.events,
      notification.sendAt,
      timezone,
    );
    const playsToday = `${notification.subject.details.name} play today`;

    const sharedParticipantTitle = findSharedParticipantTitle(
      notification.events,
    );

    const matchups = yield* Effect.forEach(notification.events, (game) =>
      Effect.gen(function* () {
        const { home, away } = yield* requireSportsParticipantsRoles(game);

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

    return {
      subject: kickoff ? `Football's back. ${playsToday}.` : playsToday,
      headline: makeTiledHeadline(
        context.home,
        kickoff ? kickoffLines : gameDayLines(notification.subject.details),
      ),
      blocks: [
        Matchups.make({ items: matchups }),
        Link.make({
          href: context.unsubscribeUrl,
          text: "Unsubscribe",
        }),
      ],
      metadata: { unsubscribe: context.unsubscribeUrl },
    } satisfies EmailViewProps;
  },
);
