import type { EventsResponse } from "@dtpt/core/contracts/events";
import {
  isEventWithParticipants,
  type EventWithParticipants,
  type NarrowedEventWithParticipants,
} from "@dtpt/core/modules/events/joined";
import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { SubscriptionTiming } from "@dtpt/core/modules/subscriptions/time";
import { mmaFights } from "@dtpt/core/modules/mma/fights";
import type { MmaEvent } from "@dtpt/core/modules/events/variants/mma.schema";
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
  // Context above the headline, such as a card's event name.
  readonly label: string | undefined;
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
      readonly headliners: readonly Fighter[];
      readonly sections: readonly {
        readonly name: "Main card" | "Prelims";
        readonly time: string;
        readonly fights: readonly {
          readonly id: string;
          readonly fighters: readonly string[];
        }[];
      }[];
    }
);

type Fighter = { readonly name: string; readonly followed: boolean };

const normalizeName = (value: string) => value.trim().toLowerCase();

// Card titles name fighters by surname: "Volkanovski" names Alexander Volkanovski.
const matchesName = (fullName: string, name: string) =>
  ` ${normalizeName(fullName)}`.endsWith(` ${normalizeName(name)}`);

const followedFighters = (subjects: readonly Subject[]) =>
  subjects.flatMap((subject) =>
    subject._tag === "mma_fighter"
      ? [normalizeName(subject.details.display)]
      : [],
  );

// "UFC 333: Volkanovski vs Evloev" labels the row "UFC 333" and headlines the
// matchup; the badge already says UFC, so Fight Nights drop it.
const cardHeading = (card: MmaEvent, followed: readonly string[]) => {
  const [event, matchup] = card.title.split(/:\s*(.*)/s);
  if (!event || !matchup) {
    return { title: card.title, label: undefined, headliners: [] };
  }

  return {
    title: matchup,
    label: card.category === "fight_night" ? "Fight Night" : event.trim(),
    headliners: matchup.split(/\s+vs\.?\s+/i).map((name) => ({
      name,
      followed: followed.some((fighter) => matchesName(fighter, name)),
    })),
  };
};

const suffixes = new Set(["jr", "jr.", "sr", "sr.", "ii", "iii", "iv"]);
const particles = new Set([
  "da",
  "de",
  "del",
  "della",
  "di",
  "dos",
  "van",
  "von",
]);

// Lineups list surnames, keeping "Jr." and "Della"-style particles attached.
// Family-name-first names come out wrong until the catalog carries surnames.
const surname = (name: string) => {
  const words = name.trim().split(/\s+/);
  const word = (index: number) => words[index]?.toLowerCase() ?? "";
  let start = words.length - 1;
  if (start > 0 && suffixes.has(word(start))) start -= 1;
  while (start > 1 && particles.has(word(start - 1))) start -= 1;
  return words.slice(start).join(" ");
};

const placements = [
  ["main", "Main card"],
  ["prelims", "Prelims"],
] as const;

// Billing order: the main card, then the prelims, each from its own start.
// The main event keeps the title's corner order; other fights stay alphabetical.
const cardSections = (
  card: NarrowedEventWithParticipants<"mma_card">,
  headliners: readonly Fighter[],
  timeFormat: Intl.DateTimeFormat,
) => {
  const billing = (title: string) => {
    const index = headliners.findIndex(({ name }) => matchesName(title, name));
    return index === -1 ? headliners.length : index;
  };
  const fights = mmaFights(
    card.participants.map((participant) => participant.details),
  );
  return placements.flatMap(([placement, name]) => {
    const placed = fights.filter((fight) => fight.placement === placement);
    if (placed.length === 0) return [];

    return [
      {
        name,
        time: timeFormat.format(
          DateTime.toDateUtc(card.details.timings[placement]),
        ),
        fights: placed.map((fight) => ({
          id: fight.id,
          fighters: fight.fighters
            .toSorted((a, b) => billing(a.title) - billing(b.title))
            .map((fighter) => surname(fighter.title)),
        })),
      },
    ];
  });
};

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
          (card): ScheduleRow[] => {
            const followed = followedFighters(subjects);
            const heading = cardHeading(card.details, followed);
            return [
              {
                ...common,
                _tag: "mma_card",
                ...heading,
                sections: cardSections(card, heading.headliners, timeFormat),
              },
            ];
          },
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
                label: undefined,
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
