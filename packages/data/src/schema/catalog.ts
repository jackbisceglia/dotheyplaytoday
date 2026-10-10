import { Schema } from "effect";

import { SportEventSeed, SportSubjectSeed } from "./sports.js";
import { MmaEventSeed, MmaSubjectSeed } from "./mma.js";
import { SeedCollectionId } from "./seed.js";

export type SeedCollection = typeof SeedCollection.Type;
export const SeedCollection = Schema.Struct({
  id: SeedCollectionId,
  subjects: Schema.Array(Schema.Union([SportSubjectSeed, MmaSubjectSeed])),
  events: Schema.Array(Schema.Union([SportEventSeed, MmaEventSeed])),
}).check(
  Schema.makeFilter(function hasUniqueIds(collection) {
    if (
      new Set(collection.subjects.map((subject) => subject.id)).size !==
        collection.subjects.length ||
      new Set(collection.events.map((event) => event.id)).size !==
        collection.events.length
    ) {
      return "Seed subject and event IDs must be unique within a collection";
    }
    return undefined;
  }),
);

export type SeedCollectionInput = Schema.Codec.Encoded<typeof SeedCollection>;
