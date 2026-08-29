import { Effect, Redacted } from "effect";
import { Pool } from "pg";

/**
 * Opens Better Auth's Promise-native PostgreSQL pool in the current Worker
 * execution scope. The pool stays separate from application persistence and
 * is closed automatically when the scope ends.
 */
export const openAuthPool = <E, R>(
  connectionString: Effect.Effect<Redacted.Redacted, E, R>,
) =>
  Effect.gen(function* () {
    const url = Redacted.value(yield* connectionString);

    return yield* Effect.acquireRelease(
      Effect.sync(() => new Pool({ connectionString: url, max: 1 })),
      (pool) => Effect.promise(() => pool.end()),
    );
  });
