import * as PgClient from "@effect/sql-pg/PgClient";
import { makeTestPgClient } from "@dtpt/core/lib/database/__tests__/fixtures";
import * as Drizzle from "drizzle-orm/effect-postgres";
import { Effect, Exit, Layer, Stream } from "effect";
import { Reactivity } from "effect/unstable/reactivity";
import type { Pool } from "pg";
import { vi } from "vitest";

import { relations } from "@dtpt/core/lib/database/definitions/relations";
import { Database } from "@dtpt/core/lib/database/service";

// Runs handler orchestration with domain services mocked. This does not test
// database atomicity. The supplied pool must never execute a query.
export const mockTransactions = (
  acquire: Effect.Effect<Pool>,
  onTransaction: (event: "begin" | "commit" | "rollback") => void = () =>
    undefined,
) =>
  Layer.effect(
    Database,
    Effect.gen(function* () {
      yield* acquire;
      const unexpected = () => Effect.die("Unexpected SQL in handler test");
      const client = yield* makeTestPgClient({
        execute: unexpected,
        executeValues: unexpected,
        executeValuesUnprepared: unexpected,
        executeUnprepared: unexpected,
        executeRaw: unexpected,
        executeStream: () => Stream.die("Unexpected SQL stream"),
      });
      vi.spyOn(client, "withTransaction").mockImplementation((effect) =>
        Effect.suspend(() => {
          onTransaction("begin");
          return effect.pipe(
            Effect.onExit((exit) =>
              Effect.sync(() => {
                onTransaction(Exit.isSuccess(exit) ? "commit" : "rollback");
              }),
            ),
          );
        }),
      );

      return yield* Drizzle.makeWithDefaults({ relations }).pipe(
        Effect.provideService(PgClient.PgClient, client),
      );
    }).pipe(Effect.provide(Reactivity.layer)),
  );
