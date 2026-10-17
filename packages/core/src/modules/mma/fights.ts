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
