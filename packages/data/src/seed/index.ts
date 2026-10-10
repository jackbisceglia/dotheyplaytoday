import { nbaCollection } from "../sports/nba/index.js";
import { nflCollection } from "../sports/nfl/index.js";
import { mlbCollection } from "../sports/mlb/index.js";
import { nhlCollection } from "../sports/nhl/index.js";

import { ufcCollection } from "../mma/ufc/index.js";

export const SeedCollections = [
  nbaCollection,
  nflCollection,
  mlbCollection,
  nhlCollection,
  ufcCollection,
] as const;
