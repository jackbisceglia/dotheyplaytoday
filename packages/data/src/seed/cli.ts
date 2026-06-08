import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as NodeServices from "@effect/platform-node/NodeServices";
import { Effect, Layer } from "effect";
import { Command, Prompt } from "effect/unstable/cli";

import { DotEnvConfigProvider } from "../lib/env.js";
import { seedCatalog, summarizeCatalog } from "./catalog.js";
import { reset } from "./reset.js";
import { SeedRuntimeLayer } from "./runtime.js";
import { seedUsers, summarizeUsers } from "./users.js";

const ConfirmProduction = Prompt.text({
  message: "Type yes to run production seed:",
  validate: (value) =>
    value.trim().toLowerCase() === "yes"
      ? Effect.succeed(value)
      : Effect.fail("Cannot execute production seed, confirmation rejected"),
});

const DevCommand = Command.make("dev").pipe(
  Command.withHandler(
    Effect.fn("Seed.Dev")(function* () {
      yield* reset();

      const collections = yield* seedCatalog();
      yield* Effect.log(summarizeCatalog(collections));

      const users = yield* seedUsers();
      yield* Effect.log(summarizeUsers(users));
    }),
  ),
);

const ProdCommand = Command.make("prod").pipe(
  Command.withHandler(
    Effect.fn("Seed.Prod")(function* () {
      yield* ConfirmProduction;
      const collections = yield* seedCatalog();
      yield* Effect.log(summarizeCatalog(collections));
    }),
  ),
);

const SeedCli = Command.run(
  Command.make("seed").pipe(Command.withSubcommands([DevCommand, ProdCommand])),
  { version: "0.0.0" },
);

function main() {
  SeedCli.pipe(
    Effect.catchTag("SeedDuplicateEventSourceIdError", Effect.die),
    Effect.provide(
      SeedRuntimeLayer.pipe(
        Layer.provideMerge(
          DotEnvConfigProvider.pipe(Layer.provideMerge(NodeServices.layer)),
        ),
      ),
    ),
    NodeRuntime.runMain,
  );
}

if (import.meta.main) {
  main();
}

export default main;
