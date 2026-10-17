import {
  Array,
  DateTime,
  Effect,
  Layer,
  Match,
  Order,
  Predicate,
  Schema,
} from "effect";

import { WebUrl } from "../../lib/config/web.js";
import { buildUnsubscribeUrl } from "../../lib/unsubscribe.js";
import { EmailLayerResend } from "../email/resend.js";
import { Email, type EmailDelivery } from "../email/service.js";
import { type Lines, makeTiledHeadline } from "../email/headline.js";
import {
  EmailView,
  EventSummary,
  Link,
  Matchups,
  type EmailMatchup,
  type EmailRendered,
  type EmailViewProps,
} from "../email/render.js";
import { type MmaFight, mmaFights } from "../mma/fights.js";
import { EventId } from "../events/schema.js";
import {
  isEventWithParticipants,
  type NarrowedEventWithParticipants,
} from "../events/joined.js";
import { SportParticipant } from "../events/participants/variants/sport.schema.js";
import { SubjectDetails } from "../subjects/schema.js";
import type { SportTeamSubject } from "../subjects/variants/sport.schema.js";
import type { User } from "../users/schema.js";
import { NotifierError } from "./errors.js";
import type { Notification } from "./notification.js";
import { Notifier } from "./service.js";

const makeEmailDelivery = (notification: Notification): EmailDelivery => ({
  recipient: notification.user.email,
  idempotencyKey: Notifier.createDeliveryHash(notification),
});

export class EmailRenderError extends Schema.TaggedError<EmailRenderError>()(
  "EmailRenderError",
  {
    message: Schema.String,
    eventId: EventId,
    role: SportParticipant.fields.role,
  },
) {}

type SportsGameEvents = Array.NonEmptyReadonlyArray<SportsGameEvent>;
type SportsGameEvent = NarrowedEventWithParticipants<"sports_game">;
type SportsGameParticipant = SportsGameEvent["participants"][number];

type MmaEvents = Array.NonEmptyReadonlyArray<MmaCardEvent>;
type MmaCardEvent = NarrowedEventWithParticipants<"mma_card">;

function createFeedCases() {
  return {
    sportsTeamFeed: {
      subject: { details: Predicate.isTagged("sports_team") },

      events: (events: Notification["events"]): events is SportsGameEvents =>
        Array.isReadonlyArrayNonEmpty(events) &&
        events.every(isEventWithParticipants("sports_game")),
    },

    mmaFeed: {
      subject: {
        details: SubjectDetails.isAnyOf(["mma_fighter", "mma_tracking"]),
      },

      events: (events: Notification["events"]): events is MmaEvents =>
        Array.isReadonlyArrayNonEmpty(events) &&
        events.every(isEventWithParticipants("mma_card")),
    },
  };
}

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

export const gameDayLines = (team: Pick<SportTeamSubject, "name">): Lines => [
  team.name,
  "play today.",
];

export const kickoffLines: Lines = ["Football is", "back."];

export const ufcLines: Lines = ["UFC is on", "today."];

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

const formatStartTime = (startsAt: DateTime.Utc, tz: User["timezone"]) => {
  const userLocaleDateTime = DateTime.setZone(startsAt, tz);

  return DateTime.format(userLocaleDateTime, {
    locale: "en-US",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
};

/** The followed fighter comes first; a lone fighter's opponent is TBD. */
const fightMatchup = (
  fight: MmaFight,
  followed: string | undefined,
  detail: string,
): EmailMatchup => {
  const [first, second] = Array.sort(
    Array.map(fight.fighters, (fighter) => fighter.title),
    Order.mapInput(Order.Boolean, (title: string) => title !== followed),
  );

  return {
    leading: first,
    separator: "vs.",
    trailing: second ?? "Opponent TBD",
    detail,
  };
};

/**
 * The card leads with its title and main-card start, which is all a coverage
 * subscriber needs. A followed fighter's bouts are bullets beneath it, naming
 * their segment; prelims add their own, earlier start.
 */
const mmaCardSummary = (
  event: MmaCardEvent,
  followed: string | undefined,
  timezone: User["timezone"],
) => {
  const card = event.details;
  const startTime = (placement: MmaFight["placement"]) =>
    formatStartTime(card.timings[placement], timezone);
  const segment = (placement: MmaFight["placement"]) =>
    placement === "main" ? "Main card" : `Prelims, ${startTime("prelims")}`;

  const followedFights = mmaFights(
    event.participants.map((participant) => participant.details),
  ).filter((fight) =>
    fight.fighters.some((fighter) => fighter.title === followed),
  );

  return EventSummary.make({
    title: card.title,
    detail: `${startTime("main")}, main card`,
    bullets: followedFights.map((fight) =>
      fightMatchup(fight, followed, segment(fight.placement)),
    ),
  });
};

const getEmailViewProps = Effect.fn("NotifierLayerEmail.getEmailViewProps")(
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
                detail: formatStartTime(game.startsAt, timezone),
              } satisfies EmailMatchup;
            }),
          );

          return {
            subject: kickoff ? `Football's back. ${playsToday}.` : playsToday,
            headline: makeTiledHeadline(
              home,
              kickoff
                ? kickoffLines
                : gameDayLines(notification.subject.details),
            ),
            blocks: [
              Matchups.make({ items: matchups }),
              Link.make({
                href: unsubscribeUrl,
                text: "Unsubscribe",
              }),
            ],
            metadata: { unsubscribe: unsubscribeUrl },
          } satisfies EmailViewProps;
        }),
      ),
      Match.when(cases.mmaFeed, (notification) => {
        const details = notification.subject.details;
        const followed =
          details._tag === "mma_fighter" ? details.display : undefined;

        return Effect.succeed({
          subject:
            followed === undefined
              ? "UFC is on today"
              : `${followed} fights today`,
          headline: makeTiledHeadline(home, ufcLines),
          blocks: [
            ...notification.events.map((event) =>
              mmaCardSummary(event, followed, timezone),
            ),
            Link.make({ href: unsubscribeUrl, text: "Unsubscribe" }),
          ],
          metadata: { unsubscribe: unsubscribeUrl },
        } satisfies EmailViewProps);
      }),
      Match.orElse(() => Effect.die("Unsupported subject/event combination")),
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
