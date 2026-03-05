// AI Gen'd, minorly reviewed for code quality
import { Command } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Effect, Layer } from "effect";

import { DotEnvConfigProvider } from "../lib/env.js";
import { InspectCommand } from "./inspect.js";

const ToolsCommand = Command.make("tools", {}).pipe(
  Command.withSubcommands([InspectCommand]),
);

const Tools = Command.run(ToolsCommand, {
  name: "jobs:tools",
  version: "0.0.0",
});

function main() {
  Tools(process.argv).pipe(
    Effect.provide(
      DotEnvConfigProvider.pipe(Layer.provideMerge(NodeContext.layer)),
    ),
    NodeRuntime.runMain,
  );
}

if (import.meta.main) {
  main();
}

export default main;
