import * as Alchemy from "alchemy";
import { AlchemyContext, Stage } from "alchemy";
import * as Output from "alchemy/Output";
import * as Cloudflare from "alchemy/Cloudflare";
import * as AlchemyPlanetscale from "alchemy/Planetscale";
import * as Stripe from "alchemy/Stripe";
import { Config, Effect, Layer } from "effect";

import ApiWorker, { bindApiUrl } from "./packages/api/dist/worker.js";
import { bindBillingResources } from "./packages/api/src/billing/resource.ts";
import { Domain } from "./packages/core/dist/lib/alchemy/domain/resource.js";
import {
  DatabaseHyperdrive,
  Planetscale,
} from "./packages/core/dist/lib/database/clients/postgres/resource.js";
import { SeedDev, SeedProduction } from "./packages/data/dist/seed/action.js";
import { CatalogSeedVersion } from "./packages/data/dist/seed/config.js";
import NotifyJobWorker from "./packages/jobs/dist/notify/worker.js";
import OpsWorker from "./packages/jobs/dist/ops/worker.js";
import Web, { bindWebUrl } from "./packages/web/resource.ts";

export default Alchemy.Stack(
  "dotheyplaytoday",
  {
    providers: Layer.unwrap(
      Config.Boolean("BILLING_ENABLED").pipe(
        Config.withDefault(false),
        Effect.orDie,
        Effect.map((enabled) =>
          Layer.provideMerge(
            Cloudflare.providers(),
            enabled
              ? Layer.merge(AlchemyPlanetscale.providers(), Stripe.providers())
              : AlchemyPlanetscale.providers(),
          ),
        ),
      ),
    ),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const context = yield* AlchemyContext;
    const stage = yield* Stage;

    yield* Domain;

    const planetscale = yield* Planetscale;
    const hyperdrive = yield* DatabaseHyperdrive;
    const DatabaseTarget = Output.interpolate`${planetscale.database.id}/${planetscale.role.branch}`;

    if (stage === "production") {
      yield* SeedProduction("SeedProduction", {
        target: DatabaseTarget,
        version: CatalogSeedVersion,
      });
    } else if (context.dev) {
      yield* SeedDev("SeedDev", {});
    }

    const web = yield* Web;
    const apiWorker = yield* ApiWorker;
    const notifyJobWorker = yield* NotifyJobWorker;
    const opsWorker = yield* OpsWorker;

    if (
      yield* Config.Boolean("BILLING_ENABLED").pipe(Config.withDefault(false))
    ) {
      yield* bindBillingResources(apiWorker, stage);
    }

    // Move these reverse dependencies into Worker props once Website.Vite
    // supports separate definition and implementation declarations.
    yield* bindApiUrl(apiWorker, apiWorker);
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
      opsWorkerName: opsWorker.workerName,
    };
  }),
);
