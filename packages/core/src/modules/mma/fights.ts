import { Array } from "effect";

import type { MmaParticipant } from "../events/participants/variants/mma.schema.js";

export const mmaFights = (participants: readonly MmaParticipant[]) =>
  Object.entries(Array.groupBy(participants, (fighter) => fighter.fightId))
    .toSorted(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([id, fighters]) => ({
      id,
      placement: fighters[0].placement,
      fighters: fighters.toSorted((a, b) => a.title.localeCompare(b.title)),
    }));
