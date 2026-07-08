import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

import * as NodeServices from "@effect/platform-node/NodeServices";
import { Effect, ManagedRuntime, Schema } from "effect";
import { Command, Prompt } from "effect/unstable/cli";

import { type SeedRunOptions } from "./run.js";

class SeedCliError extends Schema.TaggedErrorClass<SeedCliError>()(
  "SeedCliError",
  { message: Schema.String },
) {}

const SeedCliRuntime = ManagedRuntime.make(NodeServices.layer);
const RootDir = fileURLToPath(new URL("../../../..", import.meta.url));

const ConfirmProduction = Prompt.text({
  message: "Type yes to run production seed:",
  validate: (value) =>
    value.trim().toLowerCase() === "yes"
      ? Effect.succeed(value)
      : Effect.fail("Cannot execute production seed, confirmation rejected"),
});

const resolveStage = () =>
  process.env.ALCHEMY_STAGE ?? `dev_${process.env.USER ?? "local"}`;

const runAlchemySeed = Effect.fn("Seed.Cli.runAlchemySeed")(function* (
  mode: SeedRunOptions["mode"],
) {
  const exitCode = yield* Effect.tryPromise({
    try: () =>
      new Promise<number>((resolve, reject) => {
        const child = spawn(
          "pnpm",
          [
            "exec",
            "alchemy",
            "deploy",
            "alchemy.run.ts",
            "--stage",
            resolveStage(),
            "--yes",
          ],
          {
            cwd: RootDir,
            env: {
              ...process.env,
              DTPT_SEED_MODE: mode,
              DTPT_SEED_RUN_ID: randomUUID(),
            },
            stdio: "inherit",
          },
        );

        child.on("error", reject);
        child.on("close", (code) => {
          resolve(code ?? 1);
        });
      }),
    catch: (error) =>
      new SeedCliError({
        message: `Failed to start Alchemy seed: ${String(error)}`,
      }),
  });

  if (exitCode !== 0) {
    return yield* new SeedCliError({
      message: `Alchemy seed failed with exit code ${exitCode.toString()}`,
    });
  }
});

const DevCommand = Command.make("dev").pipe(
  Command.withHandler(() => runAlchemySeed("dev")),
);

const ProdCommand = Command.make("prod").pipe(
  Command.withHandler(() =>
    Effect.gen(function* () {
      yield* ConfirmProduction;
      yield* runAlchemySeed("prod");
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
