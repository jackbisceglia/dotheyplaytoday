import { nbaCollection } from "../sports/nba/index.js";
import { nflCollection } from "../sports/nfl/index.js";
import { mlbCollection } from "../sports/mlb/index.js";
import { nhlCollection } from "../sports/nhl/index.js";
import { ncaamCollection } from "../sports/ncaam/index.js";

import { ufcCollection } from "../mma/ufc/index.js";

export const SeedCollections = [
  nbaCollection,
  nflCollection,
  mlbCollection,
  nhlCollection,
  ufcCollection,
  ncaamCollection,
] as const;

/** Retains a collection's subjects while excluding its event graph. */
const omitEvents = <Collection extends (typeof SeedCollections)[number]>(
  collection: Collection,
) => ({
  ...collection,
  subjects: collection.subjects.map((subject) => ({
    ...subject,
    feedIds: [],
  })),
  events: [],
});

export const DevSeedCollections = [
  nbaCollection, // Only use the full NBA collection in development.
  omitEvents(nflCollection),
  omitEvents(mlbCollection),
  omitEvents(nhlCollection),
  omitEvents(ufcCollection),
  omitEvents(ncaamCollection),
] as const;
