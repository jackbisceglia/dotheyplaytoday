import * as Alchemy from "alchemy";
import { AlchemyContext, Stage } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as AlchemyPlanetscale from "alchemy/Planetscale";
import { Effect, Layer } from "effect";

import ApiWorker from "./packages/api/dist/worker.js";
import { WebConfigAlchemy } from "./packages/core/dist/lib/config/web.js";
import {
  Database,
  DatabaseHyperdrive,
  Planetscale,
} from "./packages/core/dist/lib/database/clients/postgres/resource.js";
import { SeedDev, SeedProduction } from "./packages/data/dist/seed/action.js";
import {
  CatalogSeedVersion,
  SeedStrategy,
} from "./packages/data/dist/seed/config.js";
import NotifyJobWorker from "./packages/jobs/dist/notify/worker.js";

export default Alchemy.Stack(
  "dotheyplaytoday",
  {
    providers: Layer.merge(
      Cloudflare.providers(),
      AlchemyPlanetscale.providers(),
    ),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const context = yield* AlchemyContext;
    const stage = yield* Stage;
    const seedStrategy = yield* SeedStrategy;

    const planetscale = yield* Planetscale;
    const hyperdrive = yield* DatabaseHyperdrive;
    const apiWorker = yield* ApiWorker;
    const notifyJobWorker = yield* NotifyJobWorker;

    if (stage === "production") {
      yield* SeedProduction("SeedProduction", { version: CatalogSeedVersion });
    } else if (context.dev && seedStrategy !== "skip") {
      yield* SeedDev("SeedDev", { version: Date.now().toString() });
    }

    return {
      databaseId: planetscale.database.id,
      databaseName: planetscale.database.name,
      branchName: planetscale.role.branch,
      hyperdriveId: hyperdrive.hyperdriveId,
      hyperdriveCachingDisabled: hyperdrive.Props.caching?.disabled,
      apiWorkerName: apiWorker.workerName,
      apiWorkerUrl: apiWorker.url,
      notifyJobWorkerName: notifyJobWorker.workerName,
      notifyJobWorkerUrl: notifyJobWorker.url,
    };
  }).pipe(Effect.provide(WebConfigAlchemy)),
);
