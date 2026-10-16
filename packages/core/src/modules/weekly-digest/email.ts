import { DateTime, Effect, Schema } from "effect";

import { WebUrl } from "../../lib/config/web.js";
import { buildUnsubscribeUrl } from "../../lib/unsubscribe.js";
import { type Lines, makeTiledHeadline } from "../email/headline.js";
import { EmailView, Link, Links, TeamSchedule, Text } from "../email/render.js";
import { EventId } from "../events/schema.js";
import type { EventWithParticipants } from "../events/service.js";
import type { Subject } from "../subjects/schema.js";
import type { WeeklyDigest } from "./schema.js";

export const weeklyDigestLines: Lines = ["Your teams.", "This week."];

export class WeeklyDigestRenderError extends Schema.TaggedErrorClass<WeeklyDigestRenderError>()(
  "WeeklyDigestRenderError",
  { eventId: EventId, message: Schema.String },
) {}

const matchup = Effect.fn("WeeklyDigest.matchup")(function* (
  subject: Subject,
  event: EventWithParticipants,
) {
  const home = event.participants.filter(
    (participant) => participant.details.role === "home",
  );
  const away = event.participants.filter(
    (participant) => participant.details.role === "away",
  );
  const homeTeam = home[0];
  const awayTeam = away[0];
  if (home.length !== 1 || away.length !== 1 || !homeTeam || !awayTeam) {
    return yield* new WeeklyDigestRenderError({
      eventId: event.id,
      message: "Expected exactly one home and one away participant",
    });
  }

  const normalize = (name: string) => name.trim().toLowerCase();
  const title = normalize(subject.details.display);
  if (normalize(homeTeam.details.title) === title)
    return `vs. ${awayTeam.details.title}`;
  if (normalize(awayTeam.details.title) === title)
    return `@ ${homeTeam.details.title}`;

  // Participant titles currently have no subject ID. Fail rather than invent a side.
  return yield* new WeeklyDigestRenderError({
    eventId: event.id,
    message: "Followed team does not match either participant title",
  });
});

export const renderWeeklyDigest = Effect.fn("WeeklyDigest.render")(function* (
  digest: WeeklyDigest,
) {
  const web = yield* WebUrl;
  const unsubscribe = yield* buildUnsubscribeUrl(digest.user.unsubscribeToken);
  const local = (instant: DateTime.Utc) =>
    DateTime.setZone(instant, digest.user.timezone);
  const start = local(digest.from);
  const end = DateTime.subtract(local(digest.to), { days: 1 });
  const dates = (date: DateTime.Zoned) =>
    DateTime.format(date, {
      locale: "en-US",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const first = DateTime.toParts(start);
  const last = DateTime.toParts(end);
  const month = (date: DateTime.Zoned) =>
    DateTime.format(date, { locale: "en-US", month: "long" });
  const dateRange =
    first.year !== last.year
      ? `${dates(start)} – ${dates(end)}`
      : first.month === last.month
        ? `${month(start)} ${first.day.toString()}–${last.day.toString()}`
        : `${month(start)} ${first.day.toString()} – ${month(end)} ${last.day.toString()}`;

  const teams = yield* Effect.forEach(digest.teams, (team) =>
    Effect.gen(function* () {
      const events = [...team.events].sort(
        (a, b) =>
          DateTime.toEpochMillis(a.startsAt) -
            DateTime.toEpochMillis(b.startsAt) || a.id.localeCompare(b.id),
      );
      const games = yield* Effect.forEach(events, (event) =>
        Effect.gen(function* () {
          const start = local(event.startsAt);
          return {
            date: DateTime.format(start, {
              locale: "en-US",
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
            opponent: yield* matchup(team.subject, event),
            time: DateTime.format(start, {
              locale: "en-US",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          };
        }),
      );
      return TeamSchedule.make({ team: team.subject.details.display, games });
    }),
  );

  return EmailView({
    subject: "Your Weekly Update",
    headline: makeTiledHeadline(web, weeklyDigestLines),
    preheader: "Here's when your teams play.",
    blocks: [
      Text.make({ value: dateRange }),
      ...teams,
      Links.make({
        items: [
          Link.make({
            href: `${web.replace(/\/+$/, "")}/home`,
            text: "Manage teams",
          }),
          Link.make({ href: unsubscribe, text: "Unsubscribe" }),
        ],
      }),
    ],
    metadata: { unsubscribe },
  });
});
