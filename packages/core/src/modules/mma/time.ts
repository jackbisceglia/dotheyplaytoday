import { DateTime } from "effect";

import type { EventWithParticipants } from "../events/participants/schema.js";
import type { MmaCard } from "../events/variants/mma.schema.js";
import type { Range } from "../subscriptions/time.js";

// Card-level broadcast times only. A bout never has an estimated start time.
export const mmaCardStart = (card: MmaCard): DateTime.Utc | null =>
  [card.earlyPrelimsAt, card.prelimsAt, card.mainCardAt]
    .filter((time) => time !== null)
    .sort((a, b) => DateTime.toEpochMillis(a) - DateTime.toEpochMillis(b))[0] ??
  null;

export const eventLocalDate = (
  event: Pick<EventWithParticipants, "startsAt" | "details">,
  timezone: DateTime.TimeZone.Named,
): string | null =>
  event.startsAt !== null
    ? DateTime.formatIsoDate(DateTime.setZone(event.startsAt, timezone))
    : event.details._tag === "mma_card"
      ? event.details.date
      : null;

export const eventInRange = (
  event: EventWithParticipants,
  range: Range<DateTime.Utc>,
  timezone?: DateTime.TimeZone.Named,
): boolean => {
  if (event.startsAt !== null) {
    return (
      DateTime.isGreaterThanOrEqualTo(event.startsAt, range.from) &&
      DateTime.isLessThan(event.startsAt, range.to)
    );
  }
  if (event.details._tag !== "mma_card" || event.details.date === null) {
    return false;
  }
  const date = (instant: DateTime.Utc) =>
    DateTime.formatIsoDate(
      timezone ? DateTime.setZone(instant, timezone) : instant,
    );
  return (
    event.details.date >= date(range.from) &&
    event.details.date < date(range.to)
  );
};

export const mmaTimingText = (
  card: MmaCard,
  timezone: DateTime.TimeZone.Named,
): string => {
  const format = (value: DateTime.Utc | null) =>
    value === null
      ? "TBD"
      : DateTime.format(DateTime.setZone(value, timezone), {
          locale: "en-US",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        });
  return `Early prelims: ${format(card.earlyPrelimsAt)} · Prelims: ${format(card.prelimsAt)} · Main card: ${format(card.mainCardAt)}. Individual fight times are not scheduled.`;
};
