import * as Cloudflare from "alchemy/Cloudflare";
import { WebConfig } from "@dtpt/core/lib/config/web";
import { DatabaseHyperdrive } from "@dtpt/core/lib/database/clients/postgres/resource";
import { createPostgresDatabaseLayerFromHyperdrive } from "@dtpt/core/lib/database/service";
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
  Cloudflare.Hyperdrive.ConnectBinding,
  RateLimiterLayer,
);

// TODO: go back to function definition once fix lands
export default class ApiWorker extends Cloudflare.Worker<ApiWorker>()(
  "ApiWorker",
  {
    main: import.meta.url,
    compatibility: { date: "2026-06-02", flags: ["nodejs_compat"] },
    dev: { port: 3001, strictPort: true },
  },
  Effect.gen(function* () {
    // Resources
    const database = yield* Cloudflare.Hyperdrive.Connect(DatabaseHyperdrive);

    // Configs
    yield* WebConfig;

    // Layers
    const DatabaseLayer = createPostgresDatabaseLayerFromHyperdrive(database);

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
