import * as Alchemy from "alchemy";
import { AlchemyContext } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

import { D1DatabaseResource } from "./packages/core/dist/lib/database/clients/d1/resource.js";
import Seed from "./packages/data/dist/seed/action.js";
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

    const context = yield* AlchemyContext;
    if (context.dev) {
      yield* Seed("Dev", {
        accountId: database.accountId,
        databaseId: database.databaseId,
        // Actions rerun only when input diffs; a fresh timestamp seeds on every dev apply
        appliedAt: Date.now().toString(),
      });
    }

    return {
      databaseName: database.databaseName,
      notifyJobWorkerName: notifyJobWorker.workerName,
      notifyJobWorkerUrl: notifyJobWorker.url,
    };
  }),
);
