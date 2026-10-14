import { describe, expect, it } from "vitest";

import { DevSeedCollections, SeedCollections } from "./index.js";

describe("development seed collections", () => {
  it("includes every subject but only NBA events and feed edges", () => {
    const productionById = new Map(
      SeedCollections.map((collection) => [collection.id, collection]),
    );

    for (const collection of DevSeedCollections) {
      const production = productionById.get(collection.id);

      if (!production) {
        throw new Error(`Missing production collection ${collection.id}`);
      }

      expect(collection.subjects).toHaveLength(production.subjects.length);

      if (collection.id === "sports.nba") {
        expect(collection.events).toHaveLength(production.events.length);
        expect(collection.subjects.some((subject) => subject.feedIds.length > 0))
          .toBe(true);
      } else {
        expect(collection.events).toHaveLength(0);
        expect(collection.subjects.every((subject) => subject.feedIds.length === 0))
          .toBe(true);
      }
    }
  });

  it("has globally unique subject and event identifiers across collections", () => {
    const subjectIds = SeedCollections.flatMap((collection) =>
      collection.subjects.map((subject) => subject.id),
    );
    const eventIds = SeedCollections.flatMap((collection) =>
      collection.events.map((event) => event.id),
    );
    const sourceIds = SeedCollections.flatMap((collection) =>
      collection.events.map((event) => event.sourceId),
    );

    expect(new Set(subjectIds).size).toBe(subjectIds.length);
    expect(new Set(eventIds).size).toBe(eventIds.length);
    expect(new Set(sourceIds).size).toBe(sourceIds.length);
  });
});
