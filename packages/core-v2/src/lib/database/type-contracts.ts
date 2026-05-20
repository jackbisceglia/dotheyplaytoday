import type {
  InferInsertModel,
  InferSelectModel,
  Table,
} from "drizzle-orm";
import type { Schema } from "effect";

type Extends<Actual, Expected> = [Actual] extends [Expected] ? true : false;

type Equals<Actual, Expected> =
  Extends<Actual, Expected> extends true
    ? Extends<Expected, Actual>
    : false;

export type Check<T extends true> = T;

type MatchesTableSelect<
  TTable extends Table,
  TSchema extends Schema.Top,
> = Equals<Schema.Codec.Encoded<TSchema>, InferSelectModel<TTable>>;

type MatchesTableInsert<
  TTable extends Table,
  TSchema extends Schema.Top,
> = Equals<Schema.Codec.Encoded<TSchema>, InferInsertModel<TTable>>;

export type TableSchemasMatch<
  TTable extends Table,
  TSelectSchema extends Schema.Top,
  TInsertSchema extends Schema.Top,
> = MatchesTableSelect<TTable, TSelectSchema> extends true
  ? MatchesTableInsert<TTable, TInsertSchema>
  : false;
