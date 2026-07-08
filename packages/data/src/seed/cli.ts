import * as NodeServices from "@effect/platform-node/NodeServices";
import { Effect, Layer, ManagedRuntime, pipe } from "effect";
import { Command, Prompt } from "effect/unstable/cli";
import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
} from "effect/unstable/http";

import { type SeedRunOptions } from "./run.js";

const SeedWorkerDevUrl = "http://localhost:8788/local/seed";

const SeedCliRuntime = ManagedRuntime.make(
  pipe(FetchHttpClient.layer, Layer.provideMerge(NodeServices.layer)),
);

const ConfirmProduction = Prompt.text({
  message: "Type yes to run production seed:",
  validate: (value) =>
    value.trim().toLowerCase() === "yes"
      ? Effect.succeed(value)
      : Effect.fail("Cannot execute production seed, confirmation rejected"),
});

const postSeed = Effect.fn("Seed.Cli")(function* (
  mode: SeedRunOptions["mode"],
) {
  const client = HttpClient.filterStatusOk(yield* HttpClient.HttpClient);
  const response = yield* client.execute(
    HttpClientRequest.post(SeedWorkerDevUrl).pipe(
      HttpClientRequest.bodyJsonUnsafe({ mode }),
    ),
  );

  yield* Effect.log("seed: ok", { response: yield* response.text });
});

const DevCommand = Command.make("dev").pipe(
  Command.withHandler(() => postSeed("dev")),
);

const ProdCommand = Command.make("prod").pipe(
  Command.withHandler(() =>
    Effect.gen(function* () {
      yield* ConfirmProduction;
      yield* postSeed("prod");
    }),
  ),
);

const SeedCli = Command.run(
  Command.make("seed").pipe(
    Command.withSubcommands([DevCommand, ProdCommand]),
    Command.withDescription(
      "Run the seed on the local NotifyWorker (requires `pnpm dev:infra`)",
    ),
  ),
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
