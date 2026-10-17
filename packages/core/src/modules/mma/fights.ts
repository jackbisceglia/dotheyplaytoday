import { Array, Order } from "effect";

import type { MmaParticipant } from "../events/participants/variants/mma.schema.js";

export type MmaFight = ReturnType<typeof mmaFights>[number];

const byTitle = Order.make<MmaParticipant>((a, b) => {
  const compared = a.title.localeCompare(b.title);
  return compared < 0 ? -1 : compared > 0 ? 1 : 0;
});

export const mmaFights = (participants: readonly MmaParticipant[]) =>
  Object.entries(Array.groupBy(participants, (fighter) => fighter.fightId))
    .toSorted(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([id, fighters]) => ({
      id,
      placement: fighters[0].placement,
      fighters: Array.sort(fighters, byTitle),
    }));

const normalizeName = (value: string) => value.trim().toLowerCase();

// Card titles name fighters by surname: "Volkanovski" names Alexander Volkanovski.
const matchesName = (fullName: string, name: string) =>
  ` ${normalizeName(fullName)}`.endsWith(` ${normalizeName(name)}`);

/**
 * "UFC 333: Volkanovski vs Evloev" splits into its event name and the main
 * event's surnames in corner order. Titles without a matchup yield undefined.
 */
export const mmaCardTitle = (title: string) => {
  const [event, matchup] = title.split(/:\s*(.*)/s);
  if (!event || !matchup) return undefined;

  return {
    event: event.trim(),
    matchup,
    names: matchup.split(/\s+vs\.?\s+/i),
  };
};

/**
 * A card title's surnames stand for its main event's fighters, so a followed
 * undercard namesake never matches a headliner. The main event is the bout
 * matching the most of them, first in billing order, so one whose opponent
 * withdrew still counts. Each name resolves to its main-event fighter's title.
 */
export const mmaMainEvent = (
  names: readonly string[],
  fights: readonly MmaFight[],
) => {
  const matched = (fight: MmaFight) =>
    names.filter((name) =>
      fight.fighters.some((fighter) => matchesName(fighter.title, name)),
    ).length;
  const fight = fights.reduce<MmaFight | undefined>(
    (best, fight) =>
      matched(fight) > (best ? matched(best) : 0) ? fight : best,
    undefined,
  );

  return {
    fight,
    titles: names.map(
      (name) =>
        fight?.fighters.find((fighter) => matchesName(fighter.title, name))
          ?.title,
    ),
  };
};
