import { type Array, Effect, Schema } from "effect";

import { type Lines, makeTiledHeadline } from "../../email/headline.js";
import {
  Link,
  Matchups,
  type EmailMatchup,
  type EmailViewProps,
} from "../../email/render.js";
import type { EsportsParticipant } from "../../events/participants/variants/esports.schema.js";
import type { Participant } from "../../events/participants/schema.js";
import { EventId } from "../../events/schema.js";
import type { EventWithParticipants } from "../../events/service.js";
import type { EsportsMatch } from "../../events/variants/esports.schema.js";
import type { Subject } from "../../subjects/schema.js";
import type { EsportsTeamSubject } from "../../subjects/variants/esports.schema.js";
import type { Notification } from "../notification.js";
import {
  type FeedContext,
  findSharedParticipantTitle,
  formatStartTime,
  isTaggedAs,
} from "./shared.js";

export class EsportsEmailRenderError extends Schema.TaggedErrorClass<EsportsEmailRenderError>()(
  "EsportsEmailRenderError",
  {
    message: Schema.String,
    eventId: EventId,
  },
) {}

type EsportsMatchParticipant = Omit<Participant, "details"> & {
  readonly details: EsportsParticipant;
};
type EsportsMatchEvent = Omit<
  EventWithParticipants,
  "details" | "participants"
> & {
  readonly details: EsportsMatch;
  readonly participants: readonly EsportsMatchParticipant[];
};
type EsportsMatchEvents = Array.NonEmptyReadonlyArray<EsportsMatchEvent>;

type EsportsTeam = Omit<Subject, "details"> & {
  readonly details: EsportsTeamSubject;
};

export type EsportsTeamNotification = Omit<
  Notification,
  "subject" | "events"
> & {
  readonly subject: EsportsTeam;
  readonly events: EsportsMatchEvents;
};

const isEsportsTeam = (
  subject: Notification["subject"],
): subject is EsportsTeam => isTaggedAs("esports_team")(subject.details);

const isEsportsMatch = (
  event: EventWithParticipants,
): event is EsportsMatchEvent =>
  isTaggedAs("esports_match")(event.details) &&
  event.participants.every((participant) =>
    isTaggedAs("esports_match")(participant.details),
  );

const areEsportsMatches = (
  events: Notification["events"],
): events is EsportsMatchEvents =>
  events.length > 0 && events.every(isEsportsMatch);

export const esportsTeamFeed = {
  subject: isEsportsTeam,
  events: areEsportsMatches,
};

const requireEsportsParticipants = Effect.fn(
  "NotifierLayerEmail.requireEsportsParticipants",
)(function* (event: EsportsMatchEvent) {
  const [first, second] = event.participants;

  if (!first || !second) {
    return yield* new EsportsEmailRenderError({
      message: "Expected esports_match event to have two participants",
      eventId: event.id,
    });
  }

  return [first, second] as const;
});

/**
 * Matches have no home side, so the subscriber's team leads when it can be
 * identified (shared across the day's matches, or by display name) and the
 * listed order stands otherwise.
 */
const orderBySubject = (
  [first, second]: readonly [EsportsMatchParticipant, EsportsMatchParticipant],
  sharedParticipantTitle: string | undefined,
  subjectDisplay: string,
) => {
  const normalize = (value: string) => value.trim().toLowerCase();
  const isSubject = (participant: EsportsMatchParticipant) =>
    sharedParticipantTitle === undefined
      ? normalize(participant.details.title) === normalize(subjectDisplay)
      : participant.details.title === sharedParticipantTitle;

  return isSubject(second)
    ? { leading: second, trailing: first }
    : { leading: first, trailing: second };
};

export const gameDayLines = (team: EsportsTeamSubject): Lines => [
  team.name,
  "play today.",
];

export const esportsTeamEmail = Effect.fn(
  "NotifierLayerEmail.esportsTeamEmail",
)(function* (notification: EsportsTeamNotification, context: FeedContext) {
  const timezone = notification.user.timezone;
  const sharedParticipantTitle = findSharedParticipantTitle(
    notification.events,
  );

  const matchups = yield* Effect.forEach(notification.events, (match) =>
    Effect.gen(function* () {
      const participants = yield* requireEsportsParticipants(match);
      const { leading, trailing } = orderBySubject(
        participants,
        sharedParticipantTitle,
        notification.subject.details.display,
      );

      return {
        leading: leading.details.title,
        separator: "vs.",
        trailing: trailing.details.title,
        detail: formatStartTime(match, timezone),
      } satisfies EmailMatchup;
    }),
  );

  return {
    subject: `${notification.subject.details.name} play today`,
    headline: makeTiledHeadline(
      context.home,
      gameDayLines(notification.subject.details),
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
});
