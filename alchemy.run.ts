import * as NodePath from "node:path";
import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

const RootDir = import.meta.dirname;
const NotifyCron = "*/15 * * * *";

const Database = Cloudflare.D1Database("Database", {
  migrationsDir: NodePath.join(RootDir, "packages/data/migrations"),
  primaryLocationHint: "wnam",
});

const NotifyWorker = Cloudflare.Worker("NotifyWorker", {
  main: NodePath.join(RootDir, "packages/jobs/src/notify/worker.ts"),
  compatibility: {
    date: "2026-06-20",
  },
  env: {
    Database,
  },
  crons: [NotifyCron],
});

export default Alchemy.Stack(
  "dotheyplaytoday",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const notifyWorker = yield* NotifyWorker;

    return {
      notifyWorkerName: notifyWorker.workerName,
      notifyCron: NotifyCron,
    };
  }),
);
