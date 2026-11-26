import { Array, DateTime, Duration, Predicate } from "effect";

import type { Lines } from "../email/headline.js";
import {
  isEventWithParticipants,
  type EventWithParticipants,
  type NarrowedEventWithParticipants,
} from "../events/joined.js";
import type { NotificationRecipient } from "../subscriptions/service.js";
import type { SportLeagueId } from "../subjects/variants/sport.schema.js";
import type { User } from "../users/schema.js";

/**
 * A one-off email sent to followers of some leagues about one day's games.
 * Each edition is configuration; the selection, rendering, and delivery
 * pipeline is shared.
 */
export type Edition = {
  /** Stable forever: it scopes every recipient's provider idempotency key. */
  readonly id: string;
  /** Followers of at least one team in these leagues receive the edition. */
  readonly audience: { readonly leagueIds: readonly SportLeagueId[] };
  /** Active games in these leagues that start on `date` in `timezone`. */
  readonly events: {
    readonly leagueIds: readonly SportLeagueId[];
    readonly date: string;
    readonly timezone: DateTime.TimeZone.Named;
  };
  readonly presentation: {
    readonly subject: string;
    readonly lines: Lines;
  };
  /**
   * Live delivery is only possible in `[opensAt, closesAt)`. The cron mode
   * defaults to `off`; `dry-run` logs the scheduled tick without sending.
   */
  readonly send: {
    readonly cron: "off" | "dry-run" | "live";
    readonly opensAt: DateTime.Utc;
    readonly closesAt: DateTime.Utc;
  };
};

export type EditionGame = NarrowedEventWithParticipants<"sports_game">;

/** Matches the notify Worker's quarter-hour cron, so exactly one tick runs. */
export const EditionCronTick = Duration.minutes(15);

export const editionIdempotencyKey = (edition: Edition, user: User) =>
  `edition:${edition.id}:${user.id}`;

/** The edition's calendar day as a half-open UTC range. */
export const editionRange = (edition: Edition) => {
  const [year = 0, month = 0, day = 0] = edition.events.date
    .split("-")
    .map(Number);
  const from = DateTime.makeZonedUnsafe(
    { year, month, day },
    { timeZone: edition.events.timezone, adjustForTimeZone: true },
  );

  return {
    from: DateTime.toUtc(from),
    to: DateTime.toUtc(DateTime.add(from, { days: 1 })),
  };
};

export const selectEditionGames = (
  edition: Edition,
  events: readonly EventWithParticipants[],
): readonly EditionGame[] => {
  const { from, to } = editionRange(edition);

  return events
    .filter(isEventWithParticipants("sports_game"))
    .filter(
      (event) =>
        event.availability === "active" &&
        edition.events.leagueIds.includes(event.details.leagueId) &&
        DateTime.isGreaterThanOrEqualTo(event.startsAt, from) &&
        DateTime.isLessThan(event.startsAt, to),
    )
    .toSorted(
      (a, b) =>
        DateTime.toEpochMillis(a.startsAt) -
          DateTime.toEpochMillis(b.startsAt) || a.id.localeCompare(b.id),
    );
};

/** One entry per verified user, however many matching teams they follow. */
export const selectEditionRecipients = (
  edition: Edition,
  recipients: readonly NotificationRecipient[],
): readonly User[] => {
  const matching = recipients.filter(
    ({ user, subscription: { subject } }) =>
      user.emailVerified &&
      Predicate.isTagged(subject.details, "sports_team") &&
      edition.audience.leagueIds.includes(subject.details.league.id),
  );

  return Array.dedupeWith(
    matching.map((recipient) => recipient.user),
    (a, b) => a.id === b.id,
  );
};

export type EditionGate =
  | { readonly _tag: "open" }
  | { readonly _tag: "not-yet-open" }
  | { readonly _tag: "closed" };

export const editionGate = (
  edition: Edition,
  now: DateTime.Utc,
): EditionGate =>
  DateTime.isLessThan(now, edition.send.opensAt)
    ? { _tag: "not-yet-open" }
    : DateTime.isGreaterThanOrEqualTo(now, edition.send.closesAt)
      ? { _tag: "closed" }
      : { _tag: "open" };

/** The single quarter-hour cron tick at or just after `opensAt`. */
export const isEditionCronTick = (edition: Edition, now: DateTime.Utc) =>
  editionGate(edition, now)._tag === "open" &&
  DateTime.isLessThan(
    now,
    DateTime.addDuration(edition.send.opensAt, EditionCronTick),
  );
