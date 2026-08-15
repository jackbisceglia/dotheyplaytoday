import { Effect } from "effect";

import { DatabaseTransactionError, mapTransactionError } from "./errors.js";
import type { Database } from "./service.js";

export const withTransaction = (database: Database) => {
  function transaction<A, E, R>(
    operation: string,
    effect: Effect.Effect<A, E, R>,
  ): Effect.Effect<A, E | DatabaseTransactionError, R>;
  function transaction<A, E, R>(
    operation: string,
    metadata: Readonly<Record<string, unknown>>,
    effect: Effect.Effect<A, E, R>,
  ): Effect.Effect<A, E | DatabaseTransactionError, R>;
  function transaction<A, E, R>(
    ...args:
      | readonly [operation: string, effect: Effect.Effect<A, E, R>]
      | readonly [
          operation: string,
          metadata: Readonly<Record<string, unknown>>,
          effect: Effect.Effect<A, E, R>,
        ]
  ): Effect.Effect<A, E | DatabaseTransactionError, R> {
    if (args.length === 2) {
      const [operation, effect] = args;

      return database
        .transaction(() => effect)
        .pipe(mapTransactionError(operation));
    }

    const [operation, metadata, effect] = args;

    return database
      .transaction(() => effect)
      .pipe(mapTransactionError(operation, metadata));
  }

  return transaction;
};
