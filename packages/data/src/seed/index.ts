import { nbaCollection } from "../sports/nba/index.js";
import { nflCollection } from "../sports/nfl/index.js";
import { worldCupCollection } from "../sports/world-cup/index.js";

export const SeedCollections = [
  nbaCollection,
  nflCollection,
  worldCupCollection,
] as const;
