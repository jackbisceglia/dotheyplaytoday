export const isTaggedAs =
  <const TTag extends PropertyKey>(tag: TTag) =>
  <TValue extends { readonly _tag: PropertyKey }>(
    value: TValue,
  ): value is Extract<TValue, { readonly _tag: TTag }> =>
    value._tag === tag;
