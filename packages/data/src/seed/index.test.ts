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
});
