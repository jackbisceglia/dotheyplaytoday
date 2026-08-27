import * as Cloudflare from "alchemy/Cloudflare";
import { Effect, Layer } from "effect";

import { DatabaseHyperdrive } from "@dtpt/core/lib/database/clients/postgres/resource";
import { createDatabaseLayerFromHyperdriveResource } from "@dtpt/core/lib/database/service";
import { ResendConfig } from "@dtpt/core/modules/email/config";
import { makeEmailLayerResend } from "@dtpt/core/modules/email/resend";
import { EmailAddress } from "@dtpt/core/modules/users/schema";
import { AdminEmail } from "./config.js";
import { SendFeedbackEmail } from "./feedback/index.js";

const FeedbackScheduleTwiceDailyUtc = "0 0,12 * * *";

const EmailLayerOps = makeEmailLayerResend({
  from: {
    name: "ops, dotheyplaytoday",
    email: EmailAddress.make("ops@dotheyplay.today"),
  },
});

const WorkerLayer = Layer.merge(
  Cloudflare.Hyperdrive.ConnectBinding,
  Cloudflare.Workers.CronEventSourceLive,
);

export default class OpsWorker extends Cloudflare.Worker<OpsWorker>()(
  "OpsWorker",
  {
    main: import.meta.url,
    compatibility: { date: "2026-06-02", flags: ["nodejs_compat"] },
  },
  Effect.gen(function* () {
    const hyperdrive = yield* Cloudflare.Hyperdrive.Connect(DatabaseHyperdrive);

    yield* ResendConfig;
    yield* AdminEmail;

    const DatabaseLayer = createDatabaseLayerFromHyperdriveResource(hyperdrive);
    const OpsLayer = Layer.merge(DatabaseLayer, EmailLayerOps);

    yield* Cloudflare.Workers.cron(
      FeedbackScheduleTwiceDailyUtc,
      Effect.fn(
        function* () {
          yield* Effect.logInfo("feedback job: scheduled");
          yield* SendFeedbackEmail;
        },
        Effect.provide(OpsLayer),
        Effect.tapCause((cause) =>
          Effect.logError("feedback job: cron failed", cause),
        ),
      ),
    );

    return {};
  }).pipe(Effect.provide(WorkerLayer)),
) {}
