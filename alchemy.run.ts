import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

import { D1DatabaseResource } from "./packages/core/dist/lib/database/clients/d1/resource.js";
import NotifyJobWorker from "./packages/jobs/dist/notify/worker.js";

export default Alchemy.Stack(
  "dotheyplaytoday",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const database = yield* D1DatabaseResource;
    const notifyJobWorker = yield* NotifyJobWorker;

    return {
      databaseName: database.databaseName,
      notifyJobWorkerName: notifyJobWorker.workerName,
      notifyJobWorkerUrl: notifyJobWorker.url,
    };
  }),
);
