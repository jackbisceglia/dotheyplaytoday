import * as Alchemy from "alchemy";
import { AlchemyContext } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";

import { D1DatabaseResource } from "./packages/core/dist/lib/database/clients/d1/resource.js";
import Seed from "./packages/data/dist/seed/action.js";
import NotifyJobWorker from "./packages/jobs/dist/notify/worker.js";

const SeedStrategy = Config.string("SEED_STRATEGY").pipe(
  Config.withDefault("dev"),
);

export default Alchemy.Stack(
  "dotheyplaytoday",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const context = yield* AlchemyContext;
    const seedStrategy = yield* SeedStrategy;
    const database = yield* D1DatabaseResource;
    const notifyJobWorker = yield* NotifyJobWorker;

    if (context.dev && seedStrategy !== "skip") {
      yield* Seed("Dev", {
        accountId: database.accountId,
        databaseId: database.databaseId,
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
