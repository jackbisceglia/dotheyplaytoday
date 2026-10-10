import type { EventsResponse } from "@dtpt/core/contracts/events";
import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { SubscriptionTiming } from "@dtpt/core/modules/subscriptions/time";
import { DateTime, Predicate } from "effect";

import {
  isSportsSubject,
  type SportsSubject,
} from "../catalog/sports/index.js";

export type ScheduleRow = {
  readonly team: SportsSubject;
  readonly teamName: string;
  readonly eventId: string;
  readonly startsAt: string;
  readonly day: string;
  readonly time: string;
  readonly opponent: string;
  readonly opponentTeam: SportsSubject | undefined;
  readonly matchup: "at" | "vs";
};

const normalizeName = (value: string) => value.trim().toLowerCase();

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
  const seen = new Set<string>();
  return schedule
    .flatMap(({ subject: team, events }) =>
      isSportsSubject(team)
        ? events.flatMap((event) =>
            event.details._tag === "sports_game" ? [{ team, event }] : [],
          )
        : [],
    )
    .filter(({ event }) => {
      const participants = [
        ...new Set(
          event.participants.map((participant) =>
            normalizeName(participant.details.title),
          ),
        ),
      ].sort();
      const key =
        participants.length >= 2
          ? JSON.stringify([
              event.details.leagueId,
              DateTime.formatIso(event.startsAt),
              participants,
            ])
          : event.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(({ team, event }): ScheduleRow => {
      const startsAt = DateTime.formatIso(event.startsAt);
      const date = new Date(startsAt);
      const today =
        SubscriptionTiming.formatLocalDate(event.startsAt, timezone) ===
        todayDate;
      const day = today ? "Today" : dayFormat.format(date);

      const participants = event.participants.flatMap((participant) =>
        Predicate.isTagged(participant.details, "sports_game")
          ? [{ ...participant, details: participant.details }]
          : [],
      );
      const participantName = (title: string) =>
        catalog
          .filter(isSportsSubject)
          .find(
            (subject) =>
              subject.details.leagueId === event.details.leagueId &&
              normalizeName(subject.details.display) === normalizeName(title),
          )?.details.name ?? title.trim();
      const own = participants.find(
        (participant) =>
          normalizeName(participant.details.title) ===
          normalizeName(team.details.display),
      );
      // Like the notifier, keep both sides in away-at-home order when the
      // subscribed team's display name cannot identify its participant.
      const leading =
        own ??
        participants.find(
          (participant) => participant.details.role === "away",
        ) ??
        participants.find((participant) => participant.details.role === "home");
      const opponent =
        leading &&
        participants.find(
          (participant) => participant.details.role !== leading.details.role,
        );
      const opponentTeam = opponent
        ? schedule
            .map(({ subject }) => subject)
            .filter(isSportsSubject)
            .find(
              (subject) =>
                subject.details.leagueId === event.details.leagueId &&
                normalizeName(subject.details.display) ===
                  normalizeName(opponent.details.title),
            )
        : undefined;
      return {
        team,
        teamName:
          own || !leading
            ? team.details.name
            : participantName(leading.details.title),
        eventId: event.id,
        startsAt,
        day,
        time: timeFormat.format(date),
        opponent: opponent ? participantName(opponent.details.title) : "",
        opponentTeam,
        matchup: leading?.details.role === "away" ? "at" : "vs",
      };
    })
    .sort(
      (a, b) =>
        a.startsAt.localeCompare(b.startsAt) ||
        a.eventId.localeCompare(b.eventId),
    );
}
