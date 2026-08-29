import * as Cloudflare from "alchemy/Cloudflare";
import { Stack } from "alchemy";
import { getManagedServiceDomain } from "@dtpt/core/lib/alchemy/domain";
import { DatabaseHyperdrive } from "@dtpt/core/lib/database/clients/postgres/resource";
import { createDatabaseLayerFromHyperdriveResource } from "@dtpt/core/lib/database/service";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { CloudflareHttpApiPlatformLayer } from "@dtpt/core/lib/effect/http/cloudflare";
import { Id, IdLayer } from "@dtpt/core/lib/id/service";
import { exactOptional } from "@dtpt/core/lib/utils";
import { sendMagicLinkEmail } from "@dtpt/core/modules/email/transactional/magic-link";
import { EmailConfig, ResendConfig } from "@dtpt/core/modules/email/config";
import { SubjectsLayer } from "@dtpt/core/modules/subjects/service";
import { SubscriptionsLayer } from "@dtpt/core/modules/subscriptions/service";
import { UsersLayer } from "@dtpt/core/modules/users/service";
import { Effect, Layer, Redacted, pipe } from "effect";
import * as HttpServerRequest from "effect/unstable/http/HttpServerRequest";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";
import * as HttpRouter from "effect/unstable/http/HttpRouter";
import { createAuth } from "./auth/auth.js";
import { AuthConfig } from "./auth/config.js";
import { createAuthDatabase } from "./auth/database.js";
import { handleAuthRequest, isAuthRequest } from "./auth/handler.js";
import { HttpApiLayer } from "./index.js";
import { RateLimiter, RateLimiterLayer } from "./rate-limit/service.js";

const ApiBaseLayer = pipe(
  Layer.mergeAll(SubjectsLayer, SubscriptionsLayer, UsersLayer),
  Layer.provideMerge(IdLayer),
  Layer.provide(CloudflareCryptoLayer),
);

const WorkerLayer = Layer.merge(
  Cloudflare.Hyperdrive.ConnectBinding,
  Layer.merge(
    RateLimiterLayer,
    IdLayer.pipe(Layer.provide(CloudflareCryptoLayer)),
  ),
);

const getApiDomain = (stage: string) => getManagedServiceDomain("api", stage);

export default class ApiWorker extends Cloudflare.Worker<ApiWorker>()(
  "ApiWorker",
  // TODO: Remove this typecast when upgrading Alchemy to beta.72 or later.
  Effect.gen(function* () {
    const stack = yield* Stack;
    const domain = getApiDomain(stack.stage);

    return {
      main: import.meta.url,
      compatibility: { date: "2026-06-02", flags: ["nodejs_compat"] },
      dev: { port: 8080, strictPort: true },
      ...exactOptional(domain, (domain) => ({ domain })),
    };
  }) as unknown as Cloudflare.WorkerProps,
  Effect.gen(function* () {
    // Resources
    const hyperdrive = yield* Cloudflare.Hyperdrive.Connect(DatabaseHyperdrive);
    const authConfig = yield* AuthConfig;

    // Validate email delivery config before the Worker begins serving requests.
    yield* EmailConfig;
    yield* ResendConfig;

    // HttpApiLayer reads WebConfig at runtime from the Stack's late binding.
    // Layers
    const DatabaseLayer = createDatabaseLayerFromHyperdriveResource(hyperdrive);

    const ApiWorkerLayer = HttpApiLayer.pipe(
      Layer.provide(ApiBaseLayer.pipe(Layer.provideMerge(DatabaseLayer))),
      Layer.provide(CloudflareHttpApiPlatformLayer),
    );

    const rateLimiter = yield* RateLimiter;
    const id = yield* Id;
    const executionContext = yield* Cloudflare.WorkerExecutionContext;

    return {
      fetch: Effect.gen(function* () {
        const serverRequest = yield* HttpServerRequest.HttpServerRequest;
        const webRequest = yield* HttpServerRequest.toWeb(serverRequest).pipe(
          Effect.orDie,
        );

        if (isAuthRequest(webRequest)) {
          const connectionString = Redacted.value(
            yield* hyperdrive.connectionString,
          );
          const backgroundTasks: Promise<unknown>[] = [];
          const authResource = yield* Effect.acquireRelease(
            Effect.sync(() => createAuthDatabase(connectionString)),
            (resource) =>
              Effect.promise(async () => {
                await Promise.allSettled(backgroundTasks);
                await resource.close();
              }).pipe(Effect.ignore),
          );
          const context = yield* Effect.context();
          const defer = (promise: Promise<unknown>) => {
            backgroundTasks.push(promise);
            executionContext.raw.waitUntil(promise);
          };
          const deliver = (
            email: Parameters<typeof sendMagicLinkEmail>[0],
            url: string,
          ) =>
            Effect.runPromiseWith(context)(
              sendMagicLinkEmail(email, url).pipe(
                Effect.provideService(Id, id),
              ),
            );
          const auth = createAuth({
            database: authResource.database,
            config: authConfig,
            deliver,
            defer,
            secureCookies: authConfig.apiOrigin.startsWith("https://"),
          });

          const response = yield* Effect.tryPromise(() =>
            handleAuthRequest(webRequest, auth, authConfig.webOrigin),
          ).pipe(Effect.orDie);

          return HttpServerResponse.fromWeb(response);
        }

        const handler = yield* Effect.orDie(
          HttpRouter.toHttpEffect(ApiWorkerLayer),
        );

        return yield* handler.pipe(Effect.orDie);
      }).pipe(Effect.provideService(RateLimiter, rateLimiter)),
    };
  }).pipe(Effect.provide(WorkerLayer)),
) {}
