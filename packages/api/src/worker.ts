import * as Cloudflare from "alchemy/Cloudflare";
import { Stack } from "alchemy";
import { getManagedServiceDomain } from "@dtpt/core/lib/alchemy/domain";
import { DatabaseHyperdrive } from "@dtpt/core/lib/database/clients/postgres/resource";
import { createDatabaseLayerFromHyperdriveResource } from "@dtpt/core/lib/database/service";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { Platform } from "alchemy/Http/Platform";
import { IdLayer } from "@dtpt/core/lib/id/service";
import { exactOptional } from "@dtpt/core/lib/utils";
import { EmailConfig, ResendConfig } from "@dtpt/core/modules/email/config";
import { EventsLayer } from "@dtpt/core/modules/events/service";
import { SubjectsLayer } from "@dtpt/core/modules/subjects/service";
import { SubscriptionsLayer } from "@dtpt/core/modules/subscriptions/service";
import { UsersLayer } from "@dtpt/core/modules/users/service";
import { Context, Effect, Layer, pipe, Scope } from "effect";
import * as HttpRouter from "effect/unstable/http/HttpRouter";
import { createAuthLayerFromHyperdriveResource } from "./auth/auth.js";
import { AuthConfig } from "./auth/config.js";
import { HttpApiLayer } from "./index.js";
import { RateLimiter, RateLimiterLayer } from "./rate-limit/service.js";

const ApiBaseLayer = pipe(
  EventsLayer,
  Layer.provideMerge(
    Layer.mergeAll(SubjectsLayer, SubscriptionsLayer, UsersLayer),
  ),
  Layer.provideMerge(IdLayer),
  Layer.provide(CloudflareCryptoLayer),
);

const WorkerLayer = Layer.merge(
  Cloudflare.Hyperdrive.ConnectBinding,
  RateLimiterLayer,
);

const getApiDomain = (stage: string) => getManagedServiceDomain("api", stage);

export default class ApiWorker extends Cloudflare.Worker<ApiWorker>()(
  "ApiWorker",
  Effect.gen(function* () {
    const stack = yield* Stack;
    const domain = getApiDomain(stack.stage);

    return {
      main: import.meta.url,
      compatibility: { date: "2026-06-02", flags: ["nodejs_compat"] },
      dev: { port: 8080, strictPort: true },
      ...exactOptional(domain, (domain) => ({ domain })),
    };
  }),
  Effect.gen(function* () {
    // Resources
    const hyperdrive = yield* Cloudflare.Hyperdrive.Connect(DatabaseHyperdrive);

    // Read deferred auth/email config during init so Alchemy binds it to the Worker.
    yield* AuthConfig;
    yield* EmailConfig;
    yield* ResendConfig;

    // HttpApiLayer reads WebConfig at runtime from the Stack's late binding.
    // Layers
    const DatabaseLayer = createDatabaseLayerFromHyperdriveResource(hyperdrive);
    const AuthLayer = createAuthLayerFromHyperdriveResource(hyperdrive).pipe(
      Layer.provide(IdLayer.pipe(Layer.provide(CloudflareCryptoLayer))),
      Layer.orDie,
    );
    const ApiServicesLayer = ApiBaseLayer.pipe(Layer.provideMerge(DatabaseLayer));

    const ApiWorkerLayer = HttpApiLayer(AuthLayer).pipe(
      Layer.provide([ApiServicesLayer, Platform]),
    );

    const rateLimiter = yield* RateLimiter;

    // Build the router once, on first request (URL bindings resolve at
    // runtime). HttpApiBuilder captures its build context, so build from
    // init services rather than the first request's execution context.
    const context = (yield* Effect.context<RateLimiter>()).pipe(
      Context.omit(Cloudflare.WorkerExecutionContext),
    );
    const scope = yield* Scope.make();
    const handler = yield* Effect.cached(
      HttpRouter.toHttpEffect(ApiWorkerLayer).pipe(
        Scope.provide(scope),
        Effect.updateContext((_: Context.Context<never>) => context),
        Effect.orDie,
      ),
    );

    return {
      // An interrupted first caller must not cache its interruption.
      fetch: Effect.flatMap(
        Effect.uninterruptible(handler),
        (handle) => handle,
      ).pipe(Effect.provideService(RateLimiter, rateLimiter)),
    };
  }).pipe(Effect.provide(WorkerLayer)),
) {}

/**
 * Binds the API's resolved public URL into a Worker's environment.
 * @returns {Effect.Effect<void>}
 */
export const bindApiUrl = (worker: Cloudflare.Worker, api: Cloudflare.Worker) =>
  worker.bind("ApiUrl", {
    bindings: [
      {
        type: "plain_text",
        name: "VITE_API_URL_BASE",
        text: api.url.as<string>(),
      },
    ],
  });
