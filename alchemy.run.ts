import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

import { D1DatabaseResource } from "@dtpt/core/lib/database/clients/d1/resource";
import NotifyWorker from "./packages/jobs/src/notify/worker.ts";

export default Alchemy.Stack(
  "dotheyplaytoday",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const database = yield* D1DatabaseResource;
    const notifyWorker = yield* NotifyWorker;

    return {
      databaseName: database.databaseName,
      notifyWorkerName: notifyWorker.workerName,
      notifyWorkerUrl: notifyWorker.url,
    };
  }),
);
