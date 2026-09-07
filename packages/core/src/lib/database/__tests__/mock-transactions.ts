import * as PgClient from "@effect/sql-pg/PgClient";
import * as Drizzle from "drizzle-orm/effect-postgres";
import { Effect, Layer } from "effect";
import { Reactivity } from "effect/unstable/reactivity";
import { vi } from "vitest";

import { relations } from "../definitions/relations.js";
import { Database } from "../service.js";

// Runs handler orchestration with domain services mocked. This does not test
// database atomicity. The supplied pool must never execute a query.
export const mockTransactions = (
  acquire: Parameters<typeof PgClient.fromPool>[0]["acquire"],
) =>
  Layer.effect(
    Database,
    Effect.gen(function* () {
      const client = yield* PgClient.fromPool({ acquire });
      vi.spyOn(client, "withTransaction").mockImplementation(
        (effect) => effect,
      );

      return yield* Drizzle.makeWithDefaults({ relations }).pipe(
        Effect.provideService(PgClient.PgClient, client),
      );
    }).pipe(Effect.provide(Reactivity.layer)),
  );
