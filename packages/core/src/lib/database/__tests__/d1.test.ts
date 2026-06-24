import { describe, expect, it } from "@effect/vitest";
import { Effect } from "effect";

import { createD1DatabaseLayer, Database } from "../service.js";

type D1DatabaseBinding = Parameters<typeof createD1DatabaseLayer>[0];

const binding = {
  prepare(sql: string) {
    return {
      bind() {
        return {
          all() {
            if (sql !== "PRAGMA foreign_keys = ON") {
              throw new Error(`Unexpected D1 statement execution: ${sql}`);
            }

            return Promise.resolve({ results: [] });
          },
        };
      },
    };
  },
} as unknown as D1DatabaseBinding;

describe("createD1DatabaseLayer", () => {
  it.effect("provides the typed Database service from a D1 binding", () =>
    Effect.gen(function* () {
      const database = yield* Database;

      expect(typeof database.select).toBe("function");
      expect(typeof database.query.usersTable.findFirst).toBe("function");
    }).pipe(Effect.provide(createD1DatabaseLayer(binding))),
  );
});
