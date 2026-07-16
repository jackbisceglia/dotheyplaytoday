import { nbaCollection } from "../sports/nba/index.js";
import { nflCollection } from "../sports/nfl/index.js";
import { mlbCollection } from "../sports/mlb/index.js";
import { worldCupCollection } from "../sports/world-cup/index.js";

export const SeedCollections = [
  nbaCollection,
  nflCollection,
  mlbCollection,
  worldCupCollection,
] as const;
