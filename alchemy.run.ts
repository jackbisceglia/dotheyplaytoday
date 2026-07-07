import path from "node:path";
import { fileURLToPath } from "node:url";

import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";

const RootDir = fileURLToPath(new URL(".", import.meta.url));
const NotifyCron = "*/15 * * * *";
const NotifyWorkerDevPort = 8788;

export default Alchemy.Stack(
  "dotheyplaytoday",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const context = yield* Alchemy.AlchemyContext;

    const database = yield* Cloudflare.D1Database("Database", {
      migrationsDir: path.join(RootDir, "packages/data/migrations"),
      primaryLocationHint: "wnam",
    });

    const notifyWorker = yield* Cloudflare.Worker("NotifyWorker", {
      main: path.join(RootDir, "packages/jobs/src/notify/worker.ts"),
      compatibility: {
        date: "2026-06-02",
        flags: ["nodejs_compat"],
      },
      crons: [NotifyCron],
      dev: { port: NotifyWorkerDevPort },
      env: {
        Database: database,
        PUBLIC_WEB_URL_BASE: Config.string("PUBLIC_WEB_URL_BASE"),
        RESEND_API_KEY: Config.redacted("RESEND_API_KEY"),
        RESEND_FROM_EMAIL: Config.string("RESEND_FROM_EMAIL"),
        ENVIRONMENT: context.dev ? "development" : "production",
      },
    });

    return {
      databaseName: database.databaseName,
      notifyCron: NotifyCron,
      notifyWorkerName: notifyWorker.workerName,
      notifyWorkerUrl: notifyWorker.url,
    };
  }),
);
