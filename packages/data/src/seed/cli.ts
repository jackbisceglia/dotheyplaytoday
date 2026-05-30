import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as NodeServices from "@effect/platform-node/NodeServices";
import { Console, Effect, Layer, Number } from "effect";
import { Command, Prompt } from "effect/unstable/cli";

import { SeedCollections } from "./index.js";
import {
  decodeSportsSeedCollections,
  resetDevCatalog,
  seed as importSeed,
} from "./import.js";
import { SeedRuntimeLayer } from "./runtime.js";

type Mode = "dev" | "prod";

const sum = <A>(items: readonly A[], f: (item: A) => number) =>
  Number.sumAll(items.map(f));

const ConfirmProduction = Prompt.text({
  message: "Type yes to run production seed:",
  validate: (value) =>
    value.trim() === "yes"
      ? Effect.succeed(value)
      : Effect.fail(
          "Cannot execute production seed, confirmation rejected",
        ),
});

const seed = Effect.fn("Seed.Run")(function* (mode: Mode) {
  const collections = yield* decodeSportsSeedCollections(SeedCollections);
  yield* importSeed(collections).pipe(
    Effect.catchTag("SeedDuplicateEventSourceIdError", Effect.die),
  );

  // Naive multi-pass counts are good enough for seed output for now.
  const numSubjects = sum(collections, (c) => c.subjects.length);
  const numEvents = sum(collections, (c) => c.events.length);

  const numFeedEdges = sum(collections, (c) =>
    sum(c.subjects, (s) => s.feedIds.length),
  );
  const numParticipants = sum(collections, (c) =>
    sum(c.events, (e) => e.participants.length),
  );

  yield* Console.log(
    [
      `seed:${mode}`,
      `mode=${mode}`,
      `collections=${collections.length.toString()}`,
      `subjects=${numSubjects.toString()}`,
      `events=${numEvents.toString()}`,
      `feedEdges=${numFeedEdges.toString()}`,
      `participants=${numParticipants.toString()}`,
    ].join(" "),
  );
});

const DevCommand = Command.make("dev").pipe(
  Command.withHandler(
    Effect.fn("Seed.Dev")(function* () {
      yield* resetDevCatalog();
      yield* seed("dev");
    }),
  ),
);

const ProdCommand = Command.make("prod").pipe(
  Command.withHandler(
    Effect.fn("Seed.Prod")(function* () {
      yield* ConfirmProduction;
      yield* seed("prod");
    }),
  ),
);

const SeedCli = Command.run(
  Command.make("seed").pipe(Command.withSubcommands([DevCommand, ProdCommand])),
  { version: "0.0.0" },
);

function main() {
  SeedCli.pipe(
    Effect.provide(Layer.mergeAll(SeedRuntimeLayer, NodeServices.layer)),
    NodeRuntime.runMain,
  );
}

if (import.meta.main) {
  main();
}

export default main;
