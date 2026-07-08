import { Config, DateTime, Effect, Option } from "effect";
import { Command, Flag } from "effect/unstable/cli";
import { HttpClient, HttpClientRequest } from "effect/unstable/http";

import { JobsCliRuntime } from "../runtime.js";
import { NotifyOptions } from "./index.js";

const NotifyWorkerDevPort = Config.port("NOTIFY_WORKER_DEV_PORT").pipe(
  Config.withDefault(8788),
);

const Flags = {
  dryRun: Flag.boolean("dry-run").pipe(
    Flag.withSchema(NotifyOptions.fields.dryRun),
  ),
  force: Flag.boolean("force").pipe(
    Flag.withSchema(NotifyOptions.fields.force),
  ),
  now: Flag.string("now").pipe(
    Flag.withSchema(NotifyOptions.fields.now),
    Flag.optional,
    Flag.withDescription("Run as if the job started at this ISO UTC instant"),
  ),
  user: Flag.string("user").pipe(
    Flag.withSchema(NotifyOptions.fields.user),
    Flag.optional,
    Flag.withDescription("Process only recipients for this email address"),
  ),
} as const;

const NotifyCommand = Command.make(
  "notify",
  {
    dryRun: Flags.dryRun,
    force: Flags.force,
    now: Flags.now,
    user: Flags.user,
  },
  Effect.fn("Notify.Cli")(function* (opts) {
    const now = Option.getOrUndefined(opts.now);
    const user = Option.getOrUndefined(opts.user);
    const port = yield* NotifyWorkerDevPort;
    const notifyWorkerDevUrl = `http://localhost:${String(port)}/local/notify`;

    const client = HttpClient.filterStatusOk(yield* HttpClient.HttpClient);

    yield* client.execute(
      HttpClientRequest.post(notifyWorkerDevUrl).pipe(
        HttpClientRequest.bodyJsonUnsafe({
          dryRun: opts.dryRun,
          force: opts.force,
          ...(now && { now: DateTime.formatIso(now) }),
          ...(user && { user }),
        }),
      ),
    );
  }),
).pipe(
  Command.withDescription("Run the notify job on the local NotifyWorker"),
);

const NotifyCli = Command.run(NotifyCommand, { version: "0.0.0" });

export async function main() {
  await JobsCliRuntime.runPromise(NotifyCli).finally(JobsCliRuntime.dispose);
}

if (import.meta.main) {
  await main();
}
