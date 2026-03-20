type DocumentIndexes<TValue> = Record<
  string,
  { key: (value: TValue) => string }
>;

export type Document<
  TId,
  TIndexes extends DocumentIndexes<never> | undefined = undefined,
> = {
  name: string;
  key: (id: TId) => string;
} & (TIndexes extends undefined
  ? { indexes?: undefined }
  : { indexes: TIndexes });

export function defineDocument<
  TId,
  TIndexes extends DocumentIndexes<never> | undefined,
>(definition: Document<TId, TIndexes>) {
  return definition;
}

export const toDocumentKey = (...segments: string[]) => segments.join(":");
