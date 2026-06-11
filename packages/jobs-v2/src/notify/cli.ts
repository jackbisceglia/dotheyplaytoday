import {
  ConsoleChannelLayer,
  EmailAddressFromString,
  EmailChannelLayer,
} from "@dtpt/core-v2";
import { Effect, Option, Schema } from "effect";
import { Command, Flag } from "effect/unstable/cli";

import { JobsRuntime } from "../runtime.js";
import { notify } from "./index.js";

const UserFlag = Flag.string("user").pipe(
  Flag.withSchema(EmailAddressFromString),
  Flag.optional,
  Flag.withDescription("Process only recipients for this email address"),
);

const NowFlag = Flag.string("now").pipe(
  Flag.withSchema(Schema.DateTimeUtcFromString),
  Flag.optional,
  Flag.withDescription("Override the run time as an ISO UTC instant"),
);

const NotifyCommand = Command.make(
  "notify",
  {
    dryRun: Flag.boolean("dry-run").pipe(Flag.withDefault(false)),
    force: Flag.boolean("force").pipe(Flag.withDefault(false)),
    now: NowFlag,
    user: UserFlag,
  },
  Effect.fn("Notify.Cli")(function* (opts) {
    const userEmail = Option.getOrUndefined(opts.user);
    const now = Option.getOrUndefined(opts.now);

    const ChannelLayer = opts.dryRun ? ConsoleChannelLayer : EmailChannelLayer;

    return yield* notify({
      dryRun: opts.dryRun,
      force: opts.force,
      ...(now && { now }),
      ...(userEmail && { userEmail }),
    }).pipe(Effect.provide(ChannelLayer));
  }),
).pipe(Command.withDescription("Run the v2 notify job"));

const NotifyCli = Command.run(NotifyCommand, { version: "0.0.0" });

export async function main() {
  await JobsRuntime.runPromise(NotifyCli).finally(() => JobsRuntime.dispose());
}

if (import.meta.main) {
  await main();
}
