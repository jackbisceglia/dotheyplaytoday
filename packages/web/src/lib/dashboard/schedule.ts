import type { UserSchedule } from "@dtpt/core/modules/events/read-models";
import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { SubscriptionTiming } from "@dtpt/core/modules/subscriptions/time";
import { DateTime } from "effect";

export type ScheduleRow = {
  readonly team: Subject;
  readonly teamName: string;
  readonly eventId: string;
  readonly startsAt: string;
  readonly today: boolean;
  readonly day: string;
  readonly time: string;
  readonly opponent: string;
};

const normalizeName = (value: string) => value.trim().toLowerCase();

export function scheduleRows(
  schedule: UserSchedule,
  teams: readonly Subject[],
  catalog: readonly Subject[],
): readonly ScheduleRow[] {
  const timezone = DateTime.zoneToString(schedule.timezone);
  const dayFormat = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
  });
  const timeFormat = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
  });
  return schedule.events.flatMap((event) => {
    const startsAt = DateTime.formatIso(event.startsAt);
    const date = new Date(startsAt);
    const today =
      SubscriptionTiming.formatLocalDate(event.startsAt, schedule.timezone) ===
      schedule.today;
    const localDay = DateTime.toParts(
      DateTime.setZone(event.startsAt, schedule.timezone),
    ).day;
    const day = today
      ? "Today"
      : `${dayFormat.format(date)} ${localDay.toString()}`;
    return teams
      .filter((team) => event.subjectIds.includes(team.id))
      .map((team) => {
        const participantName = (title: string) =>
          catalog.find(
            (subject) =>
              subject.details.leagueId === event.details.leagueId &&
              normalizeName(subject.details.display) === normalizeName(title),
          )?.details.name ?? title.trim();
        const own = event.participants.find(
          (participant) =>
            normalizeName(participant.details.title) ===
            normalizeName(team.details.display),
        );
        // Like the notifier, keep both sides in away-at-home order when the
        // subscribed team's display name cannot identify its participant.
        const leading =
          own ??
          event.participants.find(
            (participant) => participant.details.role === "away",
          ) ??
          event.participants.find(
            (participant) => participant.details.role === "home",
          );
        const opponent =
          leading &&
          event.participants.find(
            (participant) => participant.details.role !== leading.details.role,
          );
        return {
          team,
          teamName:
            own || !leading
              ? team.details.name
              : participantName(leading.details.title),
          eventId: event.id,
          startsAt,
          today,
          day,
          time: timeFormat.format(date),
          opponent: opponent
            ? `${leading.details.role === "away" ? "at" : "vs"} ${participantName(opponent.details.title)}`
            : "",
        };
      });
  });
}

export function todayTeams(schedule: UserSchedule, teams: readonly Subject[]) {
  const playing = new Set(
    schedule.events
      .filter(
        (event) =>
          SubscriptionTiming.formatLocalDate(
            event.startsAt,
            schedule.timezone,
          ) === schedule.today,
      )
      .flatMap((event) => event.subjectIds),
  );
  return teams.filter((team) => playing.has(team.id));
}

export function todayHeading(teams: readonly Subject[]) {
  if (teams.length === 0) return { lead: "No games", answer: "today." };
  if (teams.length >= 3)
    return {
      lead: `${teams.length.toString()} of your teams`,
      answer: "play today.",
    };
  return {
    lead: `The ${teams.map((team) => team.details.name).join(" and ")}`,
    answer: "play today.",
  };
}
