import { DateTime } from "effect";

import type { MmaEvent } from "../events/variants/mma.schema.js";

export const mmaTimingText = (
  card: MmaEvent,
  timezone: DateTime.TimeZone.Named,
): string => {
  const format = (value: DateTime.Utc) =>
    DateTime.format(DateTime.setZone(value, timezone), {
      locale: "en-US",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });
  const segments = [
    "Early prelims: " + format(card.timings.early),
    "Prelims: " + format(card.timings.prelims),
    "Main card: " + format(card.timings.main),
  ];

  return segments.join(" · ");
};
