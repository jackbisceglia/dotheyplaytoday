import * as Cloudflare from "alchemy/Cloudflare";
import { createDatabaseLayerFromHyperdriveResource } from "@dtpt/core/lib/database/service";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { Platform } from "alchemy/Http/Platform";
import { IdLayer } from "@dtpt/core/lib/id/service";
import { EventsLayer } from "@dtpt/core/modules/events/service";
import { SubjectsLayer } from "@dtpt/core/modules/subjects/service";
import { SubscriptionsLayer } from "@dtpt/core/modules/subscriptions/service";
import { UsersLayer } from "@dtpt/core/modules/users/service";
import { Context, Effect, Layer, pipe } from "effect";
import * as HttpRouter from "effect/unstable/http/HttpRouter";
import { createAuthLayerFromHyperdriveResource } from "./auth/auth.js";
import { HttpApiLayer } from "./index.js";
import { RateLimiter } from "./rate-limit/service.js";

const ApiBaseLayer = pipe(
  EventsLayer,
  Layer.provideMerge(
    Layer.mergeAll(SubjectsLayer, SubscriptionsLayer, UsersLayer),
  ),
  Layer.provideMerge(IdLayer),
  Layer.provide(CloudflareCryptoLayer),
);

export const makeApiFetch = Effect.fn("Api.makeFetch")(function* (
  hyperdrive: Cloudflare.Hyperdrive.ConnectClient,
) {
  const DatabaseLayer = createDatabaseLayerFromHyperdriveResource(hyperdrive);
  const AuthLayer = createAuthLayerFromHyperdriveResource(hyperdrive);
  const ApiServicesLayer = AuthLayer.pipe(
    Layer.provideMerge(ApiBaseLayer.pipe(Layer.provideMerge(DatabaseLayer))),
  );

  const ApiWorkerLayer = HttpApiLayer.pipe(
    Layer.provide([ApiServicesLayer, Platform]),
  );

  const rateLimiter = yield* RateLimiter;

  // Compile with init services only: HttpApiBuilder captures its build context.
  const context = (yield* Effect.context<RateLimiter>()).pipe(
    Context.omit(Cloudflare.WorkerExecutionContext),
  );
  const handler = yield* Effect.cached(
    Effect.scoped(HttpRouter.toHttpEffect(ApiWorkerLayer)).pipe(
      Effect.provideService(RateLimiter, rateLimiter),
      Effect.updateContext((_: Context.Context<never>) => context),
      Effect.orDie,
    ),
  );

  return Effect.flatMap(Effect.uninterruptible(handler), (handle) => handle);
});
