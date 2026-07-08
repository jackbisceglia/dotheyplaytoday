import * as Cloudflare from "alchemy/Cloudflare";
import { Config, DateTime, Effect } from "effect";

import { JobsD1Database } from "../cloudflare.ts";
import {
  createJobsLayer,
  type JobsDatabaseBinding,
} from "../runtime.ts";
import { notify } from "./index.ts";

export const NotifyCron = "*/15 * * * *";

type NotifyWorkerEnv = {
  readonly Database: JobsDatabaseBinding;
};

const makeJobsLayerFromWorkerEnv = Effect.fn(
  "NotifyWorker.makeJobsLayerFromWorkerEnv",
)(function* () {
  const env = yield* Cloudflare.WorkerEnvironment;

  return createJobsLayer({ database: (env as NotifyWorkerEnv).Database });
});

export default Cloudflare.Worker(
  "NotifyWorker",
  {
    main: import.meta.filename,
    compatibility: {
      date: "2026-06-02",
      flags: ["nodejs_compat"],
    },
    env: {
      Database: JobsD1Database,
      PUBLIC_WEB_URL_BASE: Config.string("PUBLIC_WEB_URL_BASE"),
      RESEND_API_KEY: Config.redacted("RESEND_API_KEY"),
      RESEND_FROM_EMAIL: Config.string("RESEND_FROM_EMAIL"),
    },
  },
  Cloudflare.cron(NotifyCron)
    .subscribe((controller) =>
      Effect.gen(function* () {
        const jobsLayer = yield* makeJobsLayerFromWorkerEnv();
        const now = DateTime.makeUnsafe(new Date(controller.scheduledTime));

        yield* Effect.logInfo("notify worker: scheduled", {
          cron: controller.cron,
          scheduledTime: DateTime.formatIso(now),
        });

        yield* notify({ now }).pipe(Effect.provide(jobsLayer));
      }),
    )
    .pipe(Effect.provide(Cloudflare.CronEventSourceLive)),
);
