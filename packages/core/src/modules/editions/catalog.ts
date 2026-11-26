import { DateTime } from "effect";

import type { Edition } from "./edition.js";

const eastern = DateTime.zoneMakeNamedUnsafe("America/New_York");

/**
 * Thanksgiving 2026: Bears @ Lions 1:00, Eagles @ Cowboys 4:30, and
 * Chiefs @ Bills 8:20 PM ET. The 2 PM ET slot lands after the first kickoff;
 * live sends close at the second.
 */
export const ThanksgivingFootball2026 = {
  id: "thanksgiving-football-2026",
  audience: { leagueIds: ["nfl"] },
  events: { leagueIds: ["nfl"], date: "2026-11-26", timezone: eastern },
  presentation: {
    subject: "Thanksgiving football is on",
    lines: ["Thanksgiving", "football."],
  },
  send: {
    cron: "off",
    opensAt: DateTime.makeUnsafe("2026-11-26T19:00:00Z"),
    closesAt: DateTime.makeUnsafe("2026-11-26T21:30:00Z"),
  },
} as const satisfies Edition;

export const Editions: readonly Edition[] = [ThanksgivingFootball2026];

export const findEdition = (id: string) =>
  Editions.find((edition) => edition.id === id);
