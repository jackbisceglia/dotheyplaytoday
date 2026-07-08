import * as d1 from "@distilled.cloud/cloudflare/d1";
import { createD1DatabaseLayer } from "@dtpt/core/lib/database/d1";
import * as Context from "effect/Context";
import { Effect, Layer } from "effect";
import type { HttpClient } from "effect/unstable/http/HttpClient";
import type { Credentials } from "@distilled.cloud/cloudflare/Credentials";

type D1ApiTarget = {
  readonly accountId: string;
  readonly databaseId: string;
};

type D1ApiServices = Credentials | HttpClient;
type D1Binding = Parameters<typeof createD1DatabaseLayer>[0];

const firstStatement = <Result>(
  response: { readonly result: readonly Result[] },
  operation: string,
) =>
  Effect.sync(() => {
    const statement = response.result[0];

    if (statement === undefined) {
      throw new Error(`D1 ${operation} returned no statement result`);
    }

    return statement;
  });

const createD1ApiBinding = (
  target: D1ApiTarget,
  context: Context.Context<D1ApiServices>,
) => {
  const runD1 = <A, E>(effect: Effect.Effect<A, E, D1ApiServices>) =>
    Effect.runPromise(effect.pipe(Effect.provide(context)));

  const prepare = (sql: string) => {
    const makeStatement = (params: readonly unknown[]) => ({
      bind: (...values: readonly unknown[]) => makeStatement(values),
      all: async () => {
        const statement = await runD1(
          d1
            .queryDatabase({
              accountId: target.accountId,
              databaseId: target.databaseId,
              sql,
              params: params as string[],
            })
            .pipe(
              Effect.flatMap((response) => firstStatement(response, "query")),
            ),
        );

        if (statement.success === false) {
          throw new Error(`D1 query failed: ${sql}`);
        }

        return {
          results: statement.results ?? [],
          success: true,
          meta: statement.meta ?? {},
        };
      },
      raw: async () => {
        const statement = await runD1(
          d1
            .rawDatabase({
              accountId: target.accountId,
              databaseId: target.databaseId,
              sql,
              params: params as string[],
            })
            .pipe(
              Effect.flatMap((response) => firstStatement(response, "raw")),
            ),
        );

        if (statement.success === false) {
          throw new Error(`D1 raw query failed: ${sql}`);
        }

        return statement.results?.rows ?? [];
      },
    });

    return makeStatement([]);
  };

  return { prepare } as unknown as D1Binding;
};

export const createD1ApiDatabaseLayer = (target: D1ApiTarget) =>
  Layer.unwrap(
    Effect.gen(function* () {
      const context = yield* Effect.context<D1ApiServices>();

      return createD1DatabaseLayer(createD1ApiBinding(target, context));
    }),
  );
