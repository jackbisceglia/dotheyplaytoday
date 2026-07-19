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
import { Effect, Layer } from "effect";
import * as HttpRouter from "effect/unstable/http/HttpRouter";

import { HttpApiLayer } from "./index.js";
import { RateLimiter, RateLimiterLayer } from "./rate-limit/service.js";

const ApiServicesLayer = Layer.mergeAll(
  SubjectsLayer,
  SubscriptionsLayer,
  UsersLayer,
).pipe(
  Layer.provide(IdLayer),
  Layer.provide(CloudflareCryptoLayer),
);

export default class ApiWorker extends Cloudflare.Worker<ApiWorker>()(
  "ApiWorker",
  {
    main: import.meta.url,
    compatibility: { date: "2026-06-02", flags: ["nodejs_compat"] },
  },
  Effect.gen(function* () {
    const database = yield* Cloudflare.D1.QueryDatabase(D1DatabaseResource);

    yield* WebConfig;

    // fetch rebuilds its layers per request; the rate limiter is built once
    // here so its in-memory windows persist across requests.
    const rateLimiter = yield* RateLimiter;

    const DatabaseLayer = createD1DatabaseLayerFromResource(database);
    const ApiServicesLive = ApiServicesLayer.pipe(
      Layer.provideMerge(DatabaseLayer),
    );
    const WorkerApiLayer = HttpApiLayer.pipe(
      Layer.provide(ApiServicesLive),
      Layer.provide(CloudflareHttpApiPlatformLayer),
    );

    return {
      fetch: Effect.gen(function* () {
        const handler = yield* HttpRouter.toHttpEffect(WorkerApiLayer).pipe(
          Effect.orDie,
        );

        return yield* handler;
      }).pipe(Effect.provideService(RateLimiter, rateLimiter)),
    };
  }).pipe(
    Effect.provide(
      Layer.merge(Cloudflare.D1.QueryDatabaseBinding, RateLimiterLayer),
    ),
  ),
) {}
