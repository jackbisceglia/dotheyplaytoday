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
import { makeCloudflareHttpApiPlatformLayer } from "@dtpt/core/lib/effect/http/cloudflare";
import { Effect, Layer } from "effect";
import * as HttpRouter from "effect/unstable/http/HttpRouter";

import { ApiRouterLayer } from "./index.js";
import { RateLimiter, RateLimiterLayer } from "./rate-limit/service.js";

const ApiDomainLayer = Layer.mergeAll(
  SubjectsLayer,
  SubscriptionsLayer,
  UsersLayer,
);

const ApiDomainServicesLayer = ApiDomainLayer.pipe(
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
    const rateLimiter = yield* RateLimiter.pipe(
      Effect.provide(RateLimiterLayer),
    );

    const DatabaseLayer = createD1DatabaseLayerFromResource(database);

    return {
      fetch: Effect.gen(function* () {
        const handler = yield* HttpRouter.toHttpEffect(
          ApiRouterLayer.pipe(
            Layer.provide([
              ApiDomainServicesLayer.pipe(Layer.provideMerge(DatabaseLayer)),
              Layer.succeed(RateLimiter, rateLimiter),
            ]),
            Layer.provide(makeCloudflareHttpApiPlatformLayer()),
          ),
        ).pipe(Effect.orDie);

        return yield* handler;
      }),
    };
  }).pipe(Effect.provide(Cloudflare.D1.QueryDatabaseBinding)),
) {}
