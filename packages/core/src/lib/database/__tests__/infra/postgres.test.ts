import { NodeCrypto } from "@effect/platform-node";
import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Planetscale from "alchemy/Planetscale";
import * as Test from "alchemy/Test/Vitest";
import { Crypto, Data, Effect, Layer, Schedule } from "effect";
import * as HttpClient from "effect/unstable/http/HttpClient";
import { describe, expect, it } from "vitest";

import { InfraDatabaseHyperdrive, InfraPlanetscale } from "./resource.js";
import InfraDatabaseWorker from "./worker.js";

const enabled = process.env.RUN_INFRA_TESTS === "1";

class WorkerRouteNotReady extends Data.TaggedError("WorkerRouteNotReady")<{
  readonly status: 404;
}> {}

if (!enabled) {
  describe.skip("PlanetScale PostgreSQL infrastructure", () => {
    it("requires RUN_INFRA_TESTS=1 and provider credentials", () => {
      expect(enabled).toBe(false);
    });
  });
} else {
  const infraStagePrefix = "infra-postgres-";
  const stageId = Effect.runSync(
    Effect.gen(function* () {
      const crypto = yield* Crypto.Crypto;
      return yield* crypto.randomUUIDv4;
    }).pipe(Effect.provide(NodeCrypto.layer)),
  );
  const infraStage =
    process.env.INFRA_TEST_STAGE ?? `${infraStagePrefix}${stageId}`;

  if (!infraStage.startsWith(infraStagePrefix)) {
    throw new Error(`INFRA_TEST_STAGE must start with "${infraStagePrefix}"`);
  }

  const { test, beforeAll, afterAll, deploy, destroy } = Test.make({
    providers: Layer.merge(Cloudflare.providers(), Planetscale.providers()),
    state: Cloudflare.state(),
    stage: infraStage,
  });

  const Stack = Alchemy.Stack(
    "dotheyplaytoday-infra",
    {
      providers: Layer.merge(Cloudflare.providers(), Planetscale.providers()),
      state: Cloudflare.state(),
    },
    Effect.gen(function* () {
      const planetscale = yield* InfraPlanetscale;
      const hyperdrive = yield* InfraDatabaseHyperdrive;
      const worker = yield* InfraDatabaseWorker;

      return {
        databaseId: planetscale.database.id,
        databaseName: planetscale.database.name,
        branchName: planetscale.role.branch,
        migrationHashes: planetscale.database.migrationsHashes,
        hyperdriveId: hyperdrive.hyperdriveId,
        hyperdriveCachingDisabled: hyperdrive.Props.caching?.disabled,
        workerUrl: worker.url,
      };
    }),
  );

  const stack = beforeAll(deploy(Stack), { timeout: 1_800_000 });

  afterAll(destroy(Stack), { timeout: 1_800_000 });

  test(
    "Worker reaches migrated PostgreSQL through uncached Hyperdrive",
    Effect.gen(function* () {
      const output = yield* stack;

      expect(output.databaseId).toBeTypeOf("string");
      expect(output.databaseName).toBeTypeOf("string");
      expect(output.branchName).toBeTypeOf("string");
      expect(Object.keys(output.migrationHashes)).not.toHaveLength(0);
      expect(output.hyperdriveId).toBeTypeOf("string");
      expect(output.hyperdriveCachingDisabled).toBe(true);
      expect(output.workerUrl).toBeTypeOf("string");

      if (typeof output.workerUrl !== "string") {
        return yield* Effect.die("Infrastructure stack has no API URL");
      }

      const client = yield* HttpClient.HttpClient;
      const response = yield* client.get(output.workerUrl).pipe(
        Effect.flatMap((response) =>
          response.status === 404
            ? Effect.fail(new WorkerRouteNotReady({ status: 404 }))
            : Effect.succeed(response),
        ),
        Effect.retry({
          while: (error) => error instanceof WorkerRouteNotReady,
          schedule: Schedule.max([
            Schedule.spaced("1 second"),
            Schedule.recurs(90),
          ]),
        }),
      );
      const body = yield* response.text;

      expect(response.status, body).toBe(204);
    }),
    { timeout: 180_000 },
  );
}
