import type { EventsResponse } from "@dtpt/core/contracts/events";
import {
  isEventWithParticipants,
  type EventWithParticipants,
} from "@dtpt/core/modules/events/joined";
import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { SubscriptionTiming } from "@dtpt/core/modules/subscriptions/time";
import { mmaTimingText } from "@dtpt/core/modules/mma/time";
import { mmaFights } from "@dtpt/core/modules/mma/fights";
import { Array, DateTime, Match } from "effect";

import {
  getTeams,
  isSportsSubject,
  type SportsSubject,
} from "../catalog/sports/index.js";

export type ScheduleRow = {
  readonly eventId: string;
  readonly startsAt: string;
  readonly day: string;
  readonly time: string;
  readonly title: string;
  readonly subjects: Array.NonEmptyReadonlyArray<Subject>;
} & (
  | {
      readonly _tag: "sports_game";
      readonly opponent: string;
      readonly opponentTeam: SportsSubject | undefined;
      readonly matchup: "at" | "vs";
    }
  | {
      readonly _tag: "mma_card";
      readonly fights: ReturnType<typeof mmaFights>;
      readonly timing: string;
    }
);

const normalizeName = (value: string) => value.trim().toLowerCase();

const eventKey = (event: EventWithParticipants) =>
  Match.value(event.details).pipe(
    Match.tag("mma_card", () => event.id),
    Match.tag("sports_game", (game) => {
      const participants = [
        ...new Set(
          event.participants.map((participant) =>
            normalizeName(participant.details.title),
          ),
        ),
      ].sort();

      return participants.length >= 2
        ? JSON.stringify([
            game.leagueId,
            DateTime.formatIso(event.startsAt),
            participants,
          ])
        : event.id;
    }),
    Match.exhaustive,
  );

export function scheduleRows(
  schedule: EventsResponse,
  timezone: DateTime.TimeZone.Named,
  catalog: readonly Subject[],
  now: DateTime.Utc = DateTime.nowUnsafe(),
): readonly ScheduleRow[] {
  const todayDate = SubscriptionTiming.formatLocalDate(now, timezone);
  const zoneName = DateTime.zoneToString(timezone);
  const dayFormat = new Intl.DateTimeFormat("en-US", {
    timeZone: zoneName,
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const timeFormat = new Intl.DateTimeFormat("en-US", {
    timeZone: zoneName,
    hour: "numeric",
    minute: "2-digit",
  });
  const teams = getTeams(catalog);
  const matches = schedule.flatMap(({ subject, events }) =>
    events
      .filter((event) => event.availability === "active")
      .map((event) => ({ subject, event })),
  );
  const groups = Array.groupBy(matches, ({ event }) => eventKey(event));

  return Object.values(groups)
    .flatMap((matches): ScheduleRow[] => {
      const { event, subject } = matches[0];
      const subjects = Array.dedupeWith(
        Array.map(matches, (match) => match.subject),
        (a, b) => a.id === b.id,
      );
      const startsAt = DateTime.formatIso(event.startsAt);
      const date = new Date(startsAt);
      const today =
        SubscriptionTiming.formatLocalDate(event.startsAt, timezone) ===
        todayDate;
      const common = {
        eventId: event.id,
        startsAt,
        day: today ? "Today" : dayFormat.format(date),
        time: timeFormat.format(date),
        subjects,
      };

      return Match.value(event).pipe(
        Match.when(
          isEventWithParticipants("mma_card"),
          (card): ScheduleRow[] => [
            {
              ...common,
              _tag: "mma_card",
              title: card.details.title,
              fights: mmaFights(
                card.participants.map((participant) => participant.details),
              ),
              timing: mmaTimingText(card.details, timezone),
            },
          ],
        ),
        Match.when(
          isEventWithParticipants("sports_game"),
          (game): ScheduleRow[] => {
            if (!isSportsSubject(subject)) return [];

            const participants = game.participants.map(
              (participant) => participant.details,
            );
            const participantName = (title: string) =>
              teams.find(
                (team) =>
                  team.details.leagueId === game.details.leagueId &&
                  normalizeName(team.details.display) === normalizeName(title),
              )?.details.name ?? title.trim();
            const own = participants.find(
              (participant) =>
                normalizeName(participant.title) ===
                normalizeName(subject.details.display),
            );
            const leading =
              own ??
              participants.find((participant) => participant.role === "away") ??
              participants.find((participant) => participant.role === "home");
            const opponent =
              leading &&
              participants.find(
                (participant) => participant.role !== leading.role,
              );
            const opponentTeam = getTeams(subjects).find(
              (team) =>
                opponent &&
                normalizeName(team.details.display) ===
                  normalizeName(opponent.title),
            );

            return [
              {
                ...common,
                _tag: "sports_game",
                title:
                  own || !leading
                    ? subject.details.name
                    : participantName(leading.title),
                opponent: opponent ? participantName(opponent.title) : "",
                opponentTeam,
                matchup: leading?.role === "away" ? "at" : "vs",
              },
            ];
          },
        ),
        Match.orElse(() => []),
      );
    })
    .sort(
      (a, b) =>
        a.startsAt.localeCompare(b.startsAt) ||
        a.eventId.localeCompare(b.eventId),
    );
}
