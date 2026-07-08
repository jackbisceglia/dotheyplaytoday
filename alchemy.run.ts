import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

import { Database } from "./packages/jobs/src/notify/database.ts";
import NotifyWorker, { NotifyCron } from "./packages/jobs/src/notify/worker.ts";

export default Alchemy.Stack(
  "dotheyplaytoday",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const database = yield* Database;
    const notifyWorker = yield* NotifyWorker;

    return {
      databaseName: database.databaseName,
      notifyCron: NotifyCron,
      notifyWorkerName: notifyWorker.workerName,
      notifyWorkerUrl: notifyWorker.url,
    };
  }),
);
