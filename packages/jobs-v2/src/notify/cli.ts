import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as NodeServices from "@effect/platform-node/NodeServices";
import {
  ConsoleChannelLayer,
  EmailAddress,
  EmailChannelLayer,
} from "@dtpt/core-v2";
import { Effect, Layer, Option, Schema } from "effect";
import * as SchemaTransformation from "effect/SchemaTransformation";
import { Command, Flag } from "effect/unstable/cli";

import { DotEnvConfigProvider } from "../lib/env.js";
import { notify } from "./index.js";
import { NotifyRuntimeLayer } from "./runtime.js";

const UserEmail = Schema.String.pipe(
  Schema.decode(
    SchemaTransformation.trim().compose(SchemaTransformation.toLowerCase()),
  ),
  Schema.decodeTo(EmailAddress),
);

const UserFlag = Flag.string("user").pipe(
  Flag.withSchema(UserEmail),
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

export function main() {
  const RuntimeLayer = NotifyRuntimeLayer.pipe(
    Layer.provideMerge(
      DotEnvConfigProvider.pipe(Layer.provideMerge(NodeServices.layer)),
    ),
  );

  NotifyCli.pipe(Effect.provide(RuntimeLayer), NodeRuntime.runMain);
}

if (import.meta.main) {
  main();
}
