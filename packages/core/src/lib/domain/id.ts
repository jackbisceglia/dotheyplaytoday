import { Effect, Schema } from "effect";

type BrandedIdSchema<A> = {
  readonly make: (value: string) => A;
};

type RuntimeCrypto = {
  readonly randomUUID: () => string;
};

const runtimeCrypto = globalThis as typeof globalThis & {
  readonly crypto: RuntimeCrypto;
};

export const Id = {
  SchemaBranded: <TBrand extends string>(brand: TBrand) =>
    Schema.String.check(Schema.isUUID()).pipe(Schema.brand(brand)),

  createFromBrandedSchema: <A>(schema: BrandedIdSchema<A>): Effect.Effect<A> =>
    Effect.sync(() => schema.make(runtimeCrypto.crypto.randomUUID())),
} as const;
