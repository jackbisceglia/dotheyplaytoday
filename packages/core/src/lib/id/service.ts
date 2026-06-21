import { Context, Crypto, Effect, Layer, Schema } from "effect";

export type BrandedIdSchema<A> = {
  readonly make: (value: string) => A;
};

export class Id extends Context.Service<
  Id,
  {
    readonly generate: () => Effect.Effect<string>;
    readonly makeFromBrandedSchema: <A>(
      schema: BrandedIdSchema<A>,
    ) => Effect.Effect<A>;
  }
>()("@dtpt/core/Id") {
  static SchemaBranded = <TBrand extends string>(brand: TBrand) =>
    Schema.String.check(Schema.isUUID()).pipe(Schema.brand(brand));
}

export const IdLayer = Layer.effect(
  Id,
  Effect.gen(function* () {
    const crypto = yield* Crypto.Crypto;

    const generate: Id["Service"]["generate"] = Effect.fn("Id.generate")(() =>
      crypto.randomUUIDv4.pipe(Effect.orDie),
    );

    const makeFromBrandedSchema: Id["Service"]["makeFromBrandedSchema"] =
      Effect.fn("Id.makeFromBrandedSchema")((schema) =>
        generate().pipe(Effect.map(schema.make)),
      );

    return Id.of({ generate, makeFromBrandedSchema });
  }),
);
