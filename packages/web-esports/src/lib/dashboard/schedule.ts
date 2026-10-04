import type { EventsResponse } from "@dtpt/core/contracts/events";
import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { SubscriptionTiming } from "@dtpt/core/modules/subscriptions/time";
import { DateTime } from "effect";

import {
  isEsportsMatch,
  isEsportsTeam,
  type EsportsTeam,
} from "../catalog/esports/index.js";

export type ScheduleRow = {
  readonly team: EsportsTeam;
  readonly teamName: string;
  readonly eventId: string;
  readonly startsAt: string;
  readonly day: string;
  readonly time: string;
  readonly opponent: string;
  readonly opponentTeam: EsportsTeam | undefined;
};

const normalizeName = (value: string) => value.trim().toLowerCase();

export function scheduleRows(
  response: EventsResponse,
  timezone: DateTime.TimeZone.Named,
  subjects: readonly Subject[],
  now: DateTime.Utc = DateTime.nowUnsafe(),
): readonly ScheduleRow[] {
  const schedule = response.flatMap(({ subject, events }) =>
    isEsportsTeam(subject)
      ? [{ subject, events: events.filter(isEsportsMatch) }]
      : [],
  );
  const catalog = subjects.filter(isEsportsTeam);
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
      events.map((event) => ({ team, event })),
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
              event.details.gameId,
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

      // Organizations field rosters in several games, so names only match
      // within the event's game. COD is the only game until CS2 and VAL land.
      const inGame = (subject: EsportsTeam) =>
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        subject.details.gameId === event.details.gameId;
      const participantName = (title: string) =>
        catalog.find(
          (subject) =>
            inGame(subject) &&
            normalizeName(subject.details.display) === normalizeName(title),
        )?.details.name ?? title.trim();
      const own = event.participants.find(
        (participant) =>
          normalizeName(participant.details.title) ===
          normalizeName(team.details.display),
      );
      // Like the notifier, keep the listed order when the subscribed team's
      // display name cannot identify its participant.
      const leading = own ?? event.participants[0];
      const opponent =
        leading &&
        event.participants.find((participant) => participant !== leading);
      const opponentTeam = opponent
        ? schedule.find(
            ({ subject }) =>
              inGame(subject) &&
              normalizeName(subject.details.display) ===
                normalizeName(opponent.details.title),
          )?.subject
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
      };
    })
    .sort(
      (a, b) =>
        a.startsAt.localeCompare(b.startsAt) ||
        a.eventId.localeCompare(b.eventId),
    );
}
