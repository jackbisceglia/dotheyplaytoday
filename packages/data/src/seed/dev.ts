import { DateTime } from "effect";

import type { SportsSeedInput } from "./catalog.js";
import { SeedCollections } from "./index.js";

const DevSeedWindowDays = 2;

export type DevSeedWindow = {
  readonly from: DateTime.Utc;
  readonly to: DateTime.Utc;
};

export const devSeedWindow = (now: Date): DevSeedWindow => {
  const from = DateTime.startOf(DateTime.makeUnsafe(now), "day");

  return { from, to: DateTime.add(from, { days: DevSeedWindowDays }) };
};

export const subsetEvents = <Collection extends (typeof SeedCollections)[number]>(
  collection: Collection,
  window: DevSeedWindow,
) => {
  const events = collection.events.filter((event) => {
    const startsAt = DateTime.makeUnsafe(event.startsAt);

    return (
      DateTime.isGreaterThanOrEqualTo(startsAt, window.from) &&
      DateTime.isLessThan(startsAt, window.to)
    );
  });
  const retainedSourceIds = new Set(events.map((event) => event.sourceId));

  return {
    ...collection,
    events,
    subjects: collection.subjects.map((subject) => ({
      ...subject,
      feedIds: subject.feedIds.filter((sourceId) =>
        retainedSourceIds.has(sourceId),
      ),
    })),
  };
};

export const buildDevSeed = (now: Date = new Date()): SportsSeedInput[] =>
  SeedCollections.map((collection) =>
    subsetEvents(collection, devSeedWindow(now)),
  );

export const RollingDevSeedCollections = buildDevSeed();
