import { Effect } from "effect";

type RunPromise = <A, E>(effect: Effect.Effect<A, E>) => Promise<A>;

const isObjectLike = (value: unknown): value is object =>
  (typeof value === "object" && value !== null) || typeof value === "function";

const bridgeQuery = (query: object, runPromise: RunPromise): object =>
  new Proxy(query, {
    get(target, property, receiver) {
      if (property === "then" && Effect.isEffect(target)) {
        const promise = runPromise(target as Effect.Effect<unknown, unknown>);
        return promise.then.bind(promise);
      }

      const value = Reflect.get(target, property, receiver) as unknown;

      if (typeof value !== "function") return value;

      return (...args: readonly unknown[]) => {
        const result = Reflect.apply(value, target, args) as unknown;

        return isObjectLike(result) ? bridgeQuery(result, runPromise) : result;
      };
    },
  });

/**
 * Lets Promise-based Drizzle integrations execute this request's Effect
 * Drizzle queries without creating another database client or lifecycle.
 */
export const toPromiseDatabase = <Database extends object>(
  database: Database,
  runPromise: RunPromise,
): Database =>
  new Proxy(database, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver) as unknown;

      if (property === "query" && isObjectLike(value)) {
        return new Proxy(value, {
          get(query, model, queryReceiver) {
            const relationalQuery = Reflect.get(
              query,
              model,
              queryReceiver,
            ) as unknown;

            return isObjectLike(relationalQuery)
              ? bridgeQuery(relationalQuery, runPromise)
              : relationalQuery;
          },
        });
      }

      if (typeof value !== "function") return value;

      return (...args: readonly unknown[]) => {
        const result = Reflect.apply(value, target, args) as unknown;

        return isObjectLike(result) ? bridgeQuery(result, runPromise) : result;
      };
    },
  });
