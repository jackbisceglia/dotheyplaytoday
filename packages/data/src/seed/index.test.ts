import { DateTime } from "effect";
import { describe, expect, it } from "vitest";

import { buildDevSeed, devSeedWindow } from "./dev.js";
import { SeedCollections } from "./index.js";

const productionById = new Map(
  SeedCollections.map((collection) => [collection.id, collection]),
);

const sourceIds = (collections: ReturnType<typeof buildDevSeed>) =>
  new Set(
    collections.flatMap((collection) =>
      collection.events.map((event) => event.sourceId),
    ),
  );

describe("development seed collections", () => {
  const now = new Date("2026-10-21T12:00:00Z");
  const window = devSeedWindow(now);
  const collections = buildDevSeed(now);

  it("keeps every production subject", () => {
    expect(collections).toHaveLength(SeedCollections.length);

    for (const collection of collections) {
      const production = productionById.get(collection.id);

      if (!production) {
        throw new Error(`Missing production collection ${collection.id}`);
      }

      expect(collection.subjects.map((subject) => subject.id)).toEqual(
        production.subjects.map((subject) => subject.id),
      );
    }
  });

  it("keeps only production events inside the window", () => {
    const productionSourceIds = sourceIds([...SeedCollections]);
    const eventCount = collections.reduce(
      (total, collection) => total + collection.events.length,
      0,
    );

    expect(eventCount).toBeGreaterThan(0);
    expect(eventCount).toBeLessThan(150);

    for (const collection of collections) {
      for (const event of collection.events) {
        expect(productionSourceIds.has(event.sourceId)).toBe(true);
        expect(DateTime.toEpochMillis(DateTime.makeUnsafe(event.startsAt)))
          .toBeGreaterThanOrEqual(DateTime.toEpochMillis(window.from));
        expect(DateTime.toEpochMillis(DateTime.makeUnsafe(event.startsAt)))
          .toBeLessThan(DateTime.toEpochMillis(window.to));
      }
    }
  });

  it("trims feed edges to retained events", () => {
    for (const collection of collections) {
      const retained = new Set(
        collection.events.map((event) => event.sourceId),
      );

      for (const subject of collection.subjects) {
        for (const sourceId of subject.feedIds) {
          expect(retained.has(sourceId)).toBe(true);
        }
      }
    }
  });

  it("derives the window from the provided instant", () => {
    const later = buildDevSeed(new Date("2026-10-28T12:00:00Z"));

    expect(sourceIds(collections)).not.toEqual(sourceIds(later));
  });
});
