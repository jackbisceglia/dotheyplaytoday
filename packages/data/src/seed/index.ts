import { codCollection } from "../esports/cod/index.js";
import { nbaCollection } from "../sports/nba/index.js";
import { nflCollection } from "../sports/nfl/index.js";
import { mlbCollection } from "../sports/mlb/index.js";
import { nhlCollection } from "../sports/nhl/index.js";

export const SportsCollections = [
  nbaCollection,
  nflCollection,
  mlbCollection,
  nhlCollection,
] as const;

export const EsportsCollections = [codCollection] as const;

export const SeedCollections = [
  ...SportsCollections,
  ...EsportsCollections,
] as const;
