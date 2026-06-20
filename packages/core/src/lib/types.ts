export type WithOptionalKeys<T, TKey extends keyof T> = Omit<T, TKey> &
  Partial<Pick<T, TKey>>;

export type ExtractFromDiscriminator<
  TUnion,
  TKey extends keyof TUnion,
  TValue extends TUnion[TKey],
> = Extract<TUnion, Readonly<Record<TKey, TValue>>>;

export type ExtractFromTag<
  TUnion extends { readonly _tag: PropertyKey },
  TTag extends TUnion["_tag"],
> = ExtractFromDiscriminator<TUnion, "_tag", TTag>;
