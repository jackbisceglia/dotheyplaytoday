import * as NodeServices from "@effect/platform-node/NodeServices";
import { DateTime, Effect, Layer, ManagedRuntime, Option, pipe } from "effect";
import { Command, Flag } from "effect/unstable/cli";
import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
} from "effect/unstable/http";

import { NotifyRunOptions } from "./index.js";

const NotifyWorkerDevUrl = "http://localhost:8788/local/notify";

const NotifyCliRuntime = ManagedRuntime.make(
  pipe(
    FetchHttpClient.layer,
    Layer.provideMerge(NodeServices.layer),
  ),
);

const UserFlag = Flag.string("user").pipe(
  Flag.withSchema(NotifyRunOptions.fields.user.schema),
  Flag.optional,
  Flag.withDescription("Process only recipients for this email address"),
);

const NowFlag = Flag.string("now").pipe(
  Flag.withSchema(NotifyRunOptions.fields.now.schema),
  Flag.optional,
  Flag.withDescription("Override the run time as an ISO UTC instant"),
);

const DryRunFlag = Flag.boolean("dry-run").pipe(
  Flag.withSchema(NotifyRunOptions.fields.dryRun),
);

const ForceFlag = Flag.boolean("force").pipe(
  Flag.withSchema(NotifyRunOptions.fields.force),
);

const NotifyCommand = Command.make(
  "notify",
  {
    dryRun: DryRunFlag,
    force: ForceFlag,
    now: NowFlag,
    user: UserFlag,
  },
  Effect.fn("Notify.Cli")(function* (opts) {
    const userEmail = Option.getOrUndefined(opts.user);
    const now = Option.getOrUndefined(opts.now);
    const body = {
      dryRun: opts.dryRun,
      force: opts.force,
      ...(now && { now: DateTime.formatIso(now) }),
      ...(userEmail && { user: userEmail }),
    };

    const client = HttpClient.filterStatusOk(yield* HttpClient.HttpClient);
    const response = yield* client.execute(
      HttpClientRequest.post(NotifyWorkerDevUrl).pipe(
        HttpClientRequest.bodyJsonUnsafe(body),
      ),
    );

    yield* Effect.log("notify: ok", { response: yield* response.text });
  }),
).pipe(
  Command.withDescription(
    "Run the notify job on the local NotifyWorker (requires `pnpm dev:infra`)",
  ),
);

const NotifyCli = Command.run(NotifyCommand, { version: "0.0.0" });

export async function main() {
  await NotifyCliRuntime.runPromise(NotifyCli).finally(() =>
    NotifyCliRuntime.dispose(),
  );
}

if (import.meta.main) {
  await main();
}
