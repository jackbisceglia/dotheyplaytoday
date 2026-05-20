import { SqlClient } from "effect/unstable/sql/SqlClient";
import { SqlError, UnknownError } from "effect/unstable/sql/SqlError";
import * as Effectable from "effect/Effectable";
import type { Context, Effect as EffectType } from "effect";
import { Effect } from "effect";
import type { DrizzleConfig } from "drizzle-orm";
import { QueryPromise } from "drizzle-orm/query-promise";
import {
  SQLiteDeleteBase,
  SQLiteInsertBase,
  SQLiteSelectBase,
  SQLiteUpdateBase,
} from "drizzle-orm/sqlite-core";
import type { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import { drizzle } from "drizzle-orm/sqlite-proxy";

type RemoteMethod = "all" | "execute" | "get" | "run" | "values";
const EffectTypeId = "~effect/Effect";

let currentQueryContext: Context.Context<never> | undefined;

declare module "drizzle-orm/query-promise" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type
  interface QueryPromise<T> extends EffectType.Effect<T, SqlError> {}
}

declare module "drizzle-orm" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type
  interface QueryPromise<T> extends EffectType.Effect<T, SqlError> {}
}

type EffectQuery<T> = QueryPromise<T> & EffectType.Effect<T, SqlError>;

const QueryEffectPrototype = Effectable.Prototype({
  label: "DrizzleSqliteQuery",
  evaluate(this: EffectQuery<unknown>) {
    return this.asEffect();
  },
});

const copyProperties = (target: object, source: object) => {
  for (const key of Reflect.ownKeys(source)) {
    const descriptor = Object.getOwnPropertyDescriptor(source, key);

    if (descriptor) {
      Object.defineProperty(target, key, descriptor);
    }
  }
};

const patch = (prototype: object) => {
  if (EffectTypeId in prototype) {
    return;
  }

  copyProperties(prototype, QueryEffectPrototype);
  Object.defineProperty(prototype, "asEffect", {
    value<T>(this: QueryPromise<T>) {
      return Effect.context().pipe(
        Effect.flatMap((context) =>
          Effect.tryPromise({
            try: async () => {
              const previous = currentQueryContext;
              currentQueryContext = context;

              try {
                return await this.execute();
              } finally {
                currentQueryContext = previous;
              }
            },
            catch: (cause) =>
              new SqlError({
                reason: new UnknownError({
                  cause,
                  message: "Failed to execute Drizzle query",
                }),
              }),
          }),
        ),
      );
    },
    configurable: true,
    writable: true,
  });
};

patch(QueryPromise.prototype);
patch(SQLiteSelectBase.prototype);
patch(SQLiteInsertBase.prototype);
patch(SQLiteUpdateBase.prototype);
patch(SQLiteDeleteBase.prototype);

const makeRemoteCallback = Effect.gen(function* () {
  const sql = yield* SqlClient;
  const constructionContext = yield* Effect.context();

  return (
    statementSql: string,
    params: unknown[],
    method: RemoteMethod,
  ) => {
    const statement = sql.unsafe(statementSql, params);

    const effect: EffectType.Effect<{ rows: unknown[] }, SqlError> =
      method === "execute"
        ? statement.raw.pipe(Effect.map((header) => ({ rows: [header] })))
        : method === "all" || method === "values"
          ? statement.values.pipe(Effect.map((rows) => ({ rows: [...rows] })))
          : method === "get"
            ? statement.values.pipe(
                Effect.map((rows) => ({ rows: rows[0] as unknown[] })),
              )
          : statement.withoutTransform.pipe(
              Effect.map((rows) => ({ rows: [...rows] })),
            );

    return Effect.runPromiseWith(
      currentQueryContext ?? constructionContext,
    )(effect);
  };
});

export const make = <
  TSchema extends Record<string, unknown> = Record<string, never>,
>(
  config?: Omit<DrizzleConfig<TSchema>, "logger">,
): EffectType.Effect<SqliteRemoteDatabase<TSchema>, never, SqlClient> =>
  Effect.gen(function* () {
    const callback = yield* makeRemoteCallback;

    // sqlite-proxy reads schema from the second overload slot and casing from the third.
    return drizzle(callback, config as never, config);
  });
