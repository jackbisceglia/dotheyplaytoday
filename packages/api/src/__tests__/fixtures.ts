import * as PgClient from "@effect/sql-pg/PgClient";
import * as Drizzle from "drizzle-orm/effect-postgres";
import { Effect, Exit, Layer } from "effect";
import { Reactivity } from "effect/unstable/reactivity";
import { vi } from "vitest";

import { relations } from "@dtpt/core/lib/database/definitions/relations";
import { Database } from "@dtpt/core/lib/database/service";

// Runs handler orchestration with domain services mocked. This does not test
// database atomicity. The supplied pool must never execute a query.
export const mockTransactions = (
  acquire: Parameters<typeof PgClient.fromPool>[0]["acquire"],
  onTransaction: (event: "begin" | "commit" | "rollback") => void = () =>
    undefined,
) =>
  Layer.effect(
    Database,
    Effect.gen(function* () {
      const client = yield* PgClient.fromPool({ acquire });
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
