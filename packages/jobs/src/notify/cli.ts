import { EmailAddressFromString } from "@dtpt/core/modules/users/schema";
import { Effect, Option, Schema } from "effect";
import { Command, Flag } from "effect/unstable/cli";
import { HttpClient, HttpClientRequest } from "effect/unstable/http";

import { JobsCliRuntime } from "../runtime.js";
import { NotifyOptions } from "./index.js";
import { Trigger } from "./worker.js";

const DryRunFlag = Flag.boolean("dry-run").pipe(Flag.withDefault(false));
const ForceFlag = Flag.boolean("force").pipe(Flag.withDefault(false));
const NowFlag = Flag.string("now").pipe(
  Flag.withSchema(Schema.DateTimeUtcFromString),
  Flag.optional,
  Flag.withDescription("Run as if the job started at this ISO UTC instant"),
);
const UserFlag = Flag.string("user").pipe(
  Flag.withSchema(EmailAddressFromString),
  Flag.optional,
  Flag.withDescription("Process only recipients for this email address"),
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
    const now = Option.getOrUndefined(opts.now);
    const userEmail = Option.getOrUndefined(opts.user);
    const triggerUrl = Trigger.getLocalUrl();

    const client = HttpClient.filterStatusOk(yield* HttpClient.HttpClient);
    const request = yield* HttpClientRequest.post(triggerUrl).pipe(
      HttpClientRequest.schemaBodyJson(NotifyOptions)({
        dryRun: opts.dryRun,
        force: opts.force,
        ...(now && { now }),
        ...(userEmail && { userEmail }),
      }),
    );

    const response = yield* client.execute(request);

    yield* Effect.logInfo("notify: triggered", {
      url: triggerUrl,
      status: response.status,
    });
  }),
).pipe(Command.withDescription("Trigger a notify job on NotifyJobWorker"));

const NotifyCli = Command.run(NotifyCommand, { version: "0.0.0" });

export async function main() {
  await JobsCliRuntime.runPromise(NotifyCli).finally(() =>
    JobsCliRuntime.dispose(),
  );
}

if (import.meta.main) {
  await main();
}
