import { DateTime } from "effect";

export type LocalDate = ReturnType<typeof DateTime.formatIsoDate>;

export const localDateFromUtc = (
  utc: DateTime.Utc,
  timezone: DateTime.TimeZone.Named,
) => DateTime.formatIsoDate(DateTime.setZone(utc, timezone));

export const isSameLocalDate = (
  left: DateTime.Utc,
  right: DateTime.Utc,
  timezone: DateTime.TimeZone.Named,
) => localDateFromUtc(left, timezone) === localDateFromUtc(right, timezone);
