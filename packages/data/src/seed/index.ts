import { nbaCollection } from "../sports/nba/index.js";
import { nflCollection } from "../sports/nfl/index.js";

export const SeedCollections = [nbaCollection, nflCollection] as const;
