import { DateTime } from "effect";

import { StringParts } from "../../../../../../lib/string.js";
import type { EventWithParticipants } from "../../../../../events/service.js";
import type { SportParticipant } from "../../../../../events/participants/variants/sport.schema.js";
import type { User } from "../../../../../users/schema.js";
import type { EmailEventRenderer } from "../registry.js";

const formatEventStart = (
  startsAt: EventWithParticipants["startsAt"],
  timezone: User["timezone"],
) =>
  DateTime.format(DateTime.setZone(startsAt, timezone), {
    locale: "en-US",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });

const roles = (event: EventWithParticipants) => {
  const findParticipant = (role: SportParticipant["role"]) =>
    event.participants.find((participant) => participant.details.role === role);

  const home = findParticipant("home");
  const away = findParticipant("away");

  if (!home || !away) throw new Error("Expected sports_game event to have home and away teams");

  return { getHome: () => home, getAway: () => away };
};

const formatSportsGameTitle = (event: EventWithParticipants) => {
  const participants = roles(event);

  return `${participants.getAway().details.title} at ${participants.getHome().details.title}`;
};

export const SportsGameEmailEventRenderer = (function (input) {
  return StringParts()
    .add(formatSportsGameTitle(input.event))
    .add(formatEventStart(input.event.startsAt, input.timezone))
    .make("\n");
}) satisfies EmailEventRenderer<"sports_game">;
