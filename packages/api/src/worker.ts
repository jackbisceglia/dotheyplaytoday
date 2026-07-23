import * as Cloudflare from "alchemy/Cloudflare";
import * as Output from "alchemy/Output";
import { AlchemyContext, Stack } from "alchemy";
import { getServiceDomain, url } from "@dtpt/core/lib/alchemy/domain";
import { D1DatabaseResource } from "@dtpt/core/lib/database/clients/d1/resource";
import { createD1DatabaseLayerFromResource } from "@dtpt/core/lib/database/service";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { CloudflareHttpApiPlatformLayer } from "@dtpt/core/lib/effect/http/cloudflare";
import { IdLayer } from "@dtpt/core/lib/id/service";
import { SubjectsLayer } from "@dtpt/core/modules/subjects/service";
import { SubscriptionsLayer } from "@dtpt/core/modules/subscriptions/service";
import { UsersLayer } from "@dtpt/core/modules/users/service";
import { Effect, Layer, pipe } from "effect";
import * as HttpRouter from "effect/unstable/http/HttpRouter";

import { HttpApiLayer } from "./index.js";
import { RateLimiter, RateLimiterLayer } from "./rate-limit/service.js";

const ApiBaseLayer = pipe(
  Layer.mergeAll(SubjectsLayer, SubscriptionsLayer, UsersLayer),
  Layer.provide(IdLayer),
  Layer.provide(CloudflareCryptoLayer),
);

const WorkerLayer = Layer.merge(
  Cloudflare.D1.QueryDatabaseBinding,
  RateLimiterLayer,
);

export default class ApiWorker extends Cloudflare.Worker<ApiWorker>()(
  "ApiWorker",
  {
    main: import.meta.url,
    compatibility: { date: "2026-06-02", flags: ["nodejs_compat"] },
    dev: { port: 3001, strictPort: true },
    domain: new Output.EffectExpr(Output.VoidExpr, () =>
      Stack.useSync((stack) => getServiceDomain("api", stack.stage)),
    ),
    // TODO: Use the Alchemy web URL directly instead of threading it through
    // env once the web app is managed by Alchemy.
    env: {
      PUBLIC_WEB_URL_BASE: new Output.EffectExpr(Output.VoidExpr, () =>
        AlchemyContext.useSync((context) =>
          context.dev
            ? url("localhost", "http")
            : url(getServiceDomain("web", "production")),
        ),
      ),
    },
  },
  Effect.gen(function* () {
    // Resources
    const database = yield* Cloudflare.D1.QueryDatabase(D1DatabaseResource);

    // Layers
    const DatabaseLayer = createD1DatabaseLayerFromResource(database);

    const ApiWorkerLayer = HttpApiLayer.pipe(
      Layer.provide(ApiBaseLayer.pipe(Layer.provideMerge(DatabaseLayer))),
      Layer.provide(CloudflareHttpApiPlatformLayer),
    );

    const rateLimiter = yield* RateLimiter;

    return {
      fetch: Effect.gen(function* () {
        const handler = yield* Effect.orDie(
          HttpRouter.toHttpEffect(ApiWorkerLayer),
        );

        return yield* handler;
      }).pipe(Effect.provideService(RateLimiter, rateLimiter)),
    };
  }).pipe(Effect.provide(WorkerLayer)),
) {}
