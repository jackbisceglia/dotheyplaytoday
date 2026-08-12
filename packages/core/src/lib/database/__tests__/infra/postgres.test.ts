import { NodeCrypto } from "@effect/platform-node";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Planetscale from "alchemy/Planetscale";
import * as Test from "alchemy/Test/Vitest";
import { Crypto, Data, Effect, Layer, Schedule } from "effect";
import * as HttpClient from "effect/unstable/http/HttpClient";
import { describe, expect, it } from "vitest";

import AppStack from "../../../../../../../alchemy.run.js";

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

  const stack = beforeAll(deploy(AppStack), { timeout: 1_800_000 });

  afterAll(destroy(AppStack), { timeout: 1_800_000 });

  test(
    "Worker reaches migrated PostgreSQL through uncached Hyperdrive",
    Effect.gen(function* () {
      const output = yield* stack;

      expect(output.databaseId).toBeTypeOf("string");
      expect(output.databaseName).toBeTypeOf("string");
      expect(output.branchName).toBeTypeOf("string");
      expect(output.branchName).not.toBe("production");
      expect(output.hyperdriveId).toBeTypeOf("string");
      expect(output.hyperdriveCachingDisabled).toBe(true);
      expect(output.apiWorkerUrl).toBeTypeOf("string");

      if (typeof output.apiWorkerUrl !== "string") {
        return yield* Effect.die("Infrastructure stack has no API URL");
      }

      const client = yield* HttpClient.HttpClient;
      const subjectsUrl = new URL("/api/subjects", output.apiWorkerUrl).href;
      const response = yield* client.get(subjectsUrl).pipe(
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

      expect(response.status, body).toBe(200);
      expect(JSON.parse(body)).toBeInstanceOf(Array);
    }),
    { timeout: 180_000 },
  );
}
