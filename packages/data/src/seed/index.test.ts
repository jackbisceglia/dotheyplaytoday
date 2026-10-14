import { describe, expect, it } from "vitest";

import { SeedCollections } from "./index.js";

describe("production seed collections", () => {
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
