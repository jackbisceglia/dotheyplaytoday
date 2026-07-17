import * as Alchemy from "alchemy";
import { AlchemyContext, Stage } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

import { D1DatabaseResource } from "./packages/core/dist/lib/database/clients/d1/resource.js";
import { SeedDev, SeedProduction } from "./packages/data/dist/seed/action.js";
import {
  CatalogSeedVersion,
  SeedStrategy,
} from "./packages/data/dist/seed/config.js";
import NotifyJobWorker from "./packages/jobs/dist/notify/worker.js";

export default Alchemy.Stack(
  "dotheyplaytoday",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const context = yield* AlchemyContext;
    const stage = yield* Stage;
    const seedStrategy = yield* SeedStrategy;

    const database = yield* D1DatabaseResource;
    const notifyJobWorker = yield* NotifyJobWorker;

    if (stage === "production") {
      yield* SeedProduction("SeedProduction", { version: CatalogSeedVersion });
    } else if (context.dev && seedStrategy !== "skip") {
      yield* SeedDev("SeedDev", { version: Date.now().toString() });
    }

    return {
      databaseName: database.databaseName,
      notifyJobWorkerName: notifyJobWorker.workerName,
      notifyJobWorkerUrl: notifyJobWorker.url,
    };
  }),
);
