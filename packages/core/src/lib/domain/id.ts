import { Effect, Random, Schema } from "effect";

type BrandedIdSchema<A> = {
  readonly make: (value: string) => A;
};

export const Id = {
  SchemaBranded: <TBrand extends string>(brand: TBrand) =>
    Schema.String.check(Schema.isUUID()).pipe(Schema.brand(brand)),

  createFromBrandedSchema: <A>(schema: BrandedIdSchema<A>): Effect.Effect<A> =>
    Random.nextUUIDv4.pipe(Effect.map((id) => schema.make(id))),
} as const;
