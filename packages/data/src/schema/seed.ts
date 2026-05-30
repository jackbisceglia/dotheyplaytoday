import { Schema } from "effect";

export type SeedCollectionId = typeof SeedCollectionId.Type;
export const SeedCollectionId = Schema.String.check(
  Schema.isPattern(/^[a-z][a-z0-9_-]*\.[a-z][a-z0-9_-]*$/, {
    identifier: "SeedCollectionId",
    description: "a seed collection id formatted as <family>.<collection>",
  }),
).pipe(Schema.brand("SeedCollectionId"));
