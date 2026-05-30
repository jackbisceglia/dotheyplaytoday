export type WithOptionalKeys<T, TKey extends keyof T> = Omit<T, TKey> &
  Partial<Pick<T, TKey>>;
