import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import * as NodeServices from "@effect/platform-node/NodeServices";
import {
  EventsLayer,
  IdLayer,
  SubjectsLayer,
  SubscriptionsLayer,
  UsersLayer,
} from "@dtpt/core";
import * as CloudflareCredentials from "@distilled.cloud/cloudflare/Credentials";
import { Effect, Layer, ManagedRuntime, pipe, Schema } from "effect";
import { Command, Prompt } from "effect/unstable/cli";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";

import { createD1ApiDatabaseLayer } from "./d1-api.js";
import { runSeed, type SeedRunOptions } from "./run.js";

class SeedCliError extends Schema.TaggedErrorClass<SeedCliError>()(
  "SeedCliError",
  { message: Schema.String },
) {}

const RootDir = fileURLToPath(new URL("../../../..", import.meta.url));
const StackName = "dotheyplaytoday";
const DatabaseFqn = "Database";

const D1ApiLayer = pipe(
  Layer.mergeAll(CloudflareCredentials.fromEnv(), FetchHttpClient.layer),
  Layer.provideMerge(NodeServices.layer),
);

const SeedCliRuntime = ManagedRuntime.make(D1ApiLayer);

const D1Target = Schema.Struct({
  accountId: Schema.String,
  databaseId: Schema.String,
});

const D1ResourceState = Schema.Struct({
  attr: D1Target,
});

const ConfirmProduction = Prompt.text({
  message: "Type yes to run production seed:",
  validate: (value) =>
    value.trim().toLowerCase() === "yes"
      ? Effect.succeed(value)
      : Effect.fail("Cannot execute production seed, confirmation rejected"),
});

const resolveStage = () =>
  process.env.ALCHEMY_STAGE ?? `dev_${process.env.USER ?? "local"}`;

const readD1Target = Effect.fn("Seed.Cli.readD1Target")(function* () {
  const stdout = yield* Effect.try({
    try: () =>
      execFileSync(
        "pnpm",
        [
          "exec",
          "alchemy",
          "state",
          "get",
          "--stack",
          StackName,
          "--stage",
          resolveStage(),
          "--fqn",
          DatabaseFqn,
          "alchemy.run.ts",
        ],
        {
          cwd: RootDir,
          encoding: "utf8",
          env: process.env,
          stdio: ["ignore", "pipe", "pipe"],
        },
      ),
    catch: (error) =>
      new SeedCliError({
        message: `Failed to read Alchemy D1 state: ${String(error)}`,
      }),
  });

  const resource = yield* Effect.try({
    try: () => JSON.parse(stdout) as unknown,
    catch: (error) =>
      new SeedCliError({
        message: `Alchemy D1 state was not JSON: ${String(error)}`,
      }),
  });

  const decoded = yield* Schema.decodeUnknownEffect(D1ResourceState)(
    resource,
  ).pipe(
    Effect.mapError(
      (error) =>
        new SeedCliError({
          message: `Alchemy D1 state is missing accountId/databaseId: ${error.message}`,
        }),
    ),
  );

  return decoded.attr;
});

const runD1Seed = Effect.fn("Seed.Cli.runD1Seed")(function* (
  mode: SeedRunOptions["mode"],
) {
  const target = yield* readD1Target();
  const SeedLayer = pipe(
    Layer.mergeAll(SubjectsLayer, EventsLayer, UsersLayer, SubscriptionsLayer),
    Layer.provideMerge(createD1ApiDatabaseLayer(target)),
    Layer.provide(IdLayer),
  );

  yield* runSeed({ mode }).pipe(Effect.provide(SeedLayer));
});

const DevCommand = Command.make("dev").pipe(
  Command.withHandler(() => runD1Seed("dev")),
);

const ProdCommand = Command.make("prod").pipe(
  Command.withHandler(() =>
    Effect.gen(function* () {
      yield* ConfirmProduction;
      yield* runD1Seed("prod");
    }),
  ),
);

const SeedCli = Command.run(
  Command.make("seed").pipe(Command.withSubcommands([DevCommand, ProdCommand])),
  { version: "0.0.0" },
);

async function main() {
  await SeedCliRuntime.runPromise(SeedCli).finally(() =>
    SeedCliRuntime.dispose(),
  );
}

if (import.meta.main) {
  await main();
}

export default main;
