import * as Cloudflare from "alchemy/Cloudflare";
import {
  IdLayer,
  SubjectsLayer,
  SubscriptionsLayer,
  UsersLayer,
  WebConfig,
} from "@dtpt/core";
import { createD1DatabaseLayerFromResource } from "@dtpt/core/lib/database/clients/d1/layer";
import { D1DatabaseResource } from "@dtpt/core/lib/database/clients/d1/resource";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { CloudflareHttpApiPlatformLayer } from "@dtpt/core/lib/effect/http/cloudflare";
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
  },
  Effect.gen(function* () {
    // Cloudflare Resources
    const database = yield* Cloudflare.D1.QueryDatabase(D1DatabaseResource);

    // Configs
    yield* WebConfig;

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
