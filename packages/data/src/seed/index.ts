import { nbaCollection } from "../sports/nba/index.js";
import { nflCollection } from "../sports/nfl/index.js";
import { mlbCollection } from "../sports/mlb/index.js";

export const SeedCollections = [
  nbaCollection,
  nflCollection,
  mlbCollection,
] as const;
