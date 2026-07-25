import { randomUUID } from "node:crypto";

import * as Cloudflare from "alchemy/Cloudflare";
import * as Planetscale from "alchemy/Planetscale";
import * as Test from "alchemy/Test/Vitest";
import { describe, expect, it } from "vitest";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import Stack from "../alchemy.run.js";
import { ProductionBranchName } from "../packages/core/dist/lib/database/clients/postgres/resource.js";

const enabled = process.env.RUN_DATABASE_SMOKE === "1";

if (!enabled) {
  describe.skip("PlanetScale PostgreSQL smoke", () => {
    it("requires RUN_DATABASE_SMOKE=1 and provider credentials", () => {
      expect(enabled).toBe(false);
    });
  });
} else {
  const smokeStagePrefix = "smoke-postgres-";
  const smokeStage =
    process.env.DATABASE_SMOKE_STAGE ?? `${smokeStagePrefix}${randomUUID()}`;

  if (!smokeStage.startsWith(smokeStagePrefix)) {
    throw new Error(
      `DATABASE_SMOKE_STAGE must start with "${smokeStagePrefix}"`,
    );
  }

  const { test, beforeAll, afterAll, deploy, destroy } = Test.make({
    providers: Layer.merge(Cloudflare.providers(), Planetscale.providers()),
    state: Cloudflare.state(),
    stage: smokeStage,
  });

  const stack = beforeAll(deploy(Stack), { timeout: 1_800_000 });

  afterAll(destroy(Stack), { timeout: 1_800_000 });

  test(
    "Worker reaches migrated PostgreSQL through uncached Hyperdrive",
    Effect.gen(function* () {
      const output = yield* stack;

      expect(output.databaseId).toBeTypeOf("string");
      expect(output.databaseName).toBeTypeOf("string");
      expect(output.branchName).toBeTypeOf("string");
      expect(output.branchName).not.toBe(ProductionBranchName);
      expect(output.hyperdriveId).toBeTypeOf("string");
      expect(output.hyperdriveCachingDisabled).toBe(true);
      expect(output.apiWorkerUrl).toBeTypeOf("string");

      if (typeof output.apiWorkerUrl !== "string") {
        return yield* Effect.die("Smoke stack did not expose an API URL");
      }

      const response = yield* Test.getWhenReady(
        `${output.apiWorkerUrl.replace(/\/+$/, "")}/api/subjects`,
      );

      // A 200 response proves the Worker started and queried the migrated
      // subjects table. A missing migration or failed Hyperdrive connection
      // returns a 5xx and is retried until this assertion times out.
      expect(response.status).toBe(200);
    }),
    { timeout: 120_000 },
  );
}
