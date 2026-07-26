import * as Alchemy from "alchemy";
import { AlchemyContext, Stage } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Planetscale from "alchemy/Planetscale";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import ApiWorker from "./packages/api/dist/worker.js";
import { WebConfigAlchemy } from "./packages/core/dist/lib/config/web.js";
import {
  DatabaseHyperdrive,
  DatabaseHyperdriveCachingDisabled,
  PlanetScalePostgres,
  ProductionDatabaseStage,
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
    providers: Layer.merge(Cloudflare.providers(), Planetscale.providers()),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const context = yield* AlchemyContext;
    const stage = yield* Stage;
    const seedStrategy = yield* SeedStrategy;

    const { database, branchName } = yield* PlanetScalePostgres;
    const hyperdrive = yield* DatabaseHyperdrive;
    const apiWorker = yield* ApiWorker;
    const notifyJobWorker = yield* NotifyJobWorker;

    if (stage === ProductionDatabaseStage) {
      yield* SeedProduction("SeedProduction", { version: CatalogSeedVersion });
    } else if (context.dev && seedStrategy !== "skip") {
      yield* SeedDev("SeedDev", { version: Date.now().toString() });
    }

    return {
      databaseId: database.id,
      databaseName: database.name,
      branchName,
      hyperdriveId: hyperdrive.hyperdriveId,
      hyperdriveCachingDisabled: DatabaseHyperdriveCachingDisabled,
      apiWorkerName: apiWorker.workerName,
      apiWorkerUrl: apiWorker.url,
      notifyJobWorkerName: notifyJobWorker.workerName,
      notifyJobWorkerUrl: notifyJobWorker.url,
    };
  }).pipe(Effect.provide(WebConfigAlchemy)),
);
