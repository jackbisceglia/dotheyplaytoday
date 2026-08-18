import * as Alchemy from "alchemy";
import { AlchemyContext, Stage } from "alchemy";
import * as Output from "alchemy/Output";
import * as Cloudflare from "alchemy/Cloudflare";
import * as AlchemyPlanetscale from "alchemy/Planetscale";
import { Effect, Layer } from "effect";

import ApiWorker from "./packages/api/dist/worker.js";
import {
  DatabaseHyperdrive,
  Planetscale,
} from "./packages/core/dist/lib/database/clients/postgres/resource.js";
import { SeedDev, SeedProduction } from "./packages/data/dist/seed/action.js";
import {
  CatalogSeedVersion,
  SeedStrategy,
} from "./packages/data/dist/seed/config.js";
import NotifyJobWorker from "./packages/jobs/dist/notify/worker.js";
import Web, { bindWebUrl } from "./packages/web/resource.ts";

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
    const seedTarget = Output.interpolate`${planetscale.database.id}/${planetscale.role.branch}`;

    if (stage === "production") {
      yield* SeedProduction("SeedProduction", {
        target: seedTarget,
        version: CatalogSeedVersion,
      });
    } else if (context.dev && seedStrategy !== "skip") {
      yield* SeedDev("SeedDev", {
        target: seedTarget,
        version: Date.now().toString(),
      });
    }

    const web = yield* Web;
    const apiWorker = yield* ApiWorker;
    const notifyJobWorker = yield* NotifyJobWorker;

    yield* bindWebUrl(apiWorker, web);
    yield* bindWebUrl(notifyJobWorker, web);

    return {
      databaseId: planetscale.database.id,
      databaseName: planetscale.database.name,
      branchName: planetscale.role.branch,
      hyperdriveId: hyperdrive.hyperdriveId,
      hyperdriveCachingDisabled: hyperdrive.Props.caching?.disabled,
      apiWorkerName: apiWorker.workerName,
      apiWorkerUrl: apiWorker.url,
      webWorkerName: web.workerName,
      webWorkerUrl: web.url,
      notifyJobWorkerName: notifyJobWorker.workerName,
      notifyJobWorkerUrl: notifyJobWorker.url,
    };
  }),
);
