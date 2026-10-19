import { DateTime, Effect, Schema } from "effect";

import { EventId } from "../events/schema.js";
import {
  isEventWithParticipants,
  type NarrowedEventWithParticipants,
} from "../events/joined.js";
import { SubjectId } from "../subjects/schema.js";
import type { SportTeamSubject } from "../subjects/variants/sport.schema.js";
import type { User } from "../users/schema.js";
import type { WeeklyDigest } from "./schema.js";

export class SportsScheduleRenderError extends Schema.TaggedError<SportsScheduleRenderError>()(
  "SportsScheduleRenderError",
  {
    subjectId: SubjectId,
    eventId: Schema.optional(EventId),
    message: Schema.String,
  },
) {}

type SportsGame = NarrowedEventWithParticipants<"sports_game">;

const matchup = Effect.fn("SportsSchedule.matchup")(function* (
  subjectId: SubjectId,
  team: SportTeamSubject,
  event: SportsGame,
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
    return yield* new SportsScheduleRenderError({
      subjectId,
      eventId: event.id,
      message: "Expected exactly one home and one away participant",
    });
  }

  const normalize = (name: string) => name.trim().toLowerCase();
  const title = normalize(team.display);
  if (normalize(homeTeam.details.title) === title)
    return `vs. ${awayTeam.details.title}`;
  if (normalize(awayTeam.details.title) === title)
    return `@ ${homeTeam.details.title}`;

  // Participants have no subject ID; fail rather than invent a side.
  return yield* new SportsScheduleRenderError({
    subjectId,
    eventId: event.id,
    message: "Followed team does not match either participant title",
  });
});

/** Adapt a domain group into display rows; validate variant identity once here. */
export const sportsSchedule = Effect.fn("SportsSchedule.present")(function* (
  group: WeeklyDigest["groups"][number],
  timezone: User["timezone"],
) {
  const { subject } = group;
  if (
    subject._tag !== "sports_team" ||
    subject.details._tag !== "sports_team"
  ) {
    return yield* new SportsScheduleRenderError({
      subjectId: subject.id,
      message: "Expected a sports team subject",
    });
  }
  const team = subject.details;
  const games = yield* Effect.forEach(group.events, (event) => {
    if (!isEventWithParticipants("sports_game")(event)) {
      return Effect.fail(
        new SportsScheduleRenderError({
          subjectId: subject.id,
          eventId: event.id,
          message: "Expected a sports game with sports participants",
        }),
      );
    }
    return Effect.succeed(event);
  });
  const ordered = [...games].sort(
    (a, b) =>
      DateTime.toEpochMillis(a.startsAt) - DateTime.toEpochMillis(b.startsAt) ||
      a.id.localeCompare(b.id),
  );
  const rows = yield* Effect.forEach(ordered, (game) =>
    Effect.gen(function* () {
      const start = DateTime.setZone(game.startsAt, timezone);
      return {
        date: DateTime.format(start, {
          locale: "en-US",
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        label: yield* matchup(subject.id, team, game),
        time: DateTime.format(start, {
          locale: "en-US",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
    }),
  );
  return { title: team.display, rows };
});
