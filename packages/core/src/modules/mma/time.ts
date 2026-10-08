import { DateTime } from "effect";

import type { MmaCard } from "../events/variants/mma.schema.js";

export const mmaTimingText = (
  card: MmaCard,
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
    ...(card.timings.earlyPrelims
      ? ["Early prelims: " + format(card.timings.earlyPrelims)]
      : []),
    ...(card.timings.prelims
      ? ["Prelims: " + format(card.timings.prelims)]
      : []),
    "Main card: " + format(card.timings.mainCard),
  ];

  return segments.join(" · ") + ". Individual fight times are not scheduled.";
};
