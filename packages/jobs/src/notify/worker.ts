import * as Cloudflare from "alchemy/Cloudflare";
import * as Output from "alchemy/Output";
import { Stack } from "alchemy/Stack";
import { Boolean, Effect, Layer, Option, pipe, Result } from "effect";
import * as HttpServerRequest from "effect/unstable/http/HttpServerRequest";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";

import { isDevStage } from "@dtpt/core/lib/alchemy/stage";
import { getServiceDomain } from "@dtpt/core/lib/alchemy/domain";
import { WebConfigAlchemy } from "@dtpt/core/lib/config/web";
import { D1DatabaseResource } from "@dtpt/core/lib/database/clients/d1/resource";
import { createD1DatabaseLayerFromResource } from "@dtpt/core/lib/database/service";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { IdLayer } from "@dtpt/core/lib/id/service";
import { ConsoleChannelLayer } from "@dtpt/core/modules/channels/console/service";
import { ResendConfig } from "@dtpt/core/modules/channels/email/clients/config";
import { EmailChannelLayer } from "@dtpt/core/modules/channels/email/service";
import { EventsLayer } from "@dtpt/core/modules/events/service";
import { SubscriptionsLayer } from "@dtpt/core/modules/subscriptions/service";
import { notify, NotifyOptions } from "./index.js";

const NotifySchedule = "*/15 * * * *";

export const Trigger = {
  path: "/test/notify",
  port: 8788,
  getLocalUrl: () =>
    `http://localhost:${Trigger.port.toString()}${Trigger.path}`,
} as const;

const NotifyDomainsLayer = pipe(
  Layer.mergeAll(SubscriptionsLayer, EventsLayer),
  Layer.provide(IdLayer),
  Layer.provide(CloudflareCryptoLayer),
);

export default Cloudflare.Worker(
  "NotifyJobWorker",
  {
    main: import.meta.url,
    compatibility: { date: "2026-06-02", flags: ["nodejs_compat"] },
    dev: { port: Trigger.port, strictPort: true },
    domain: new Output.EffectExpr(Output.VoidExpr, () =>
      Stack.useSync((stack) => getServiceDomain("jobs", stack.stage)),
    ),
  },
  Effect.gen(function* () {
    // Resources
    const stack = yield* Stack;
    const database = yield* Cloudflare.D1.QueryDatabase(D1DatabaseResource);

    // Configs
    yield* ResendConfig;
    yield* WebConfigAlchemy;

    // Layers
    const DatabaseLayer = createD1DatabaseLayerFromResource(database);
    const NotifyLayer = NotifyDomainsLayer.pipe(Layer.provide(DatabaseLayer));

    yield* Cloudflare.Workers.cron(
      NotifySchedule,
      Effect.fn(
        function* () {
          yield* Effect.logInfo("notify job: scheduled");

          yield* notify({}).pipe(
            Effect.provide(Layer.merge(NotifyLayer, EmailChannelLayer)),
          );
        },
        Effect.tapCause((cause) =>
          Effect.logError("notify job: cron failed", cause),
        ),
      ),
    );

    return {
      fetch: Effect.gen(function* () {
        const request = yield* HttpServerRequest.HttpServerRequest;

        const url = HttpServerRequest.toURL(request);
        const pathname = Option.getOrUndefined(url)?.pathname;

        if (!isDevStage(stack.stage)) {
          return HttpServerResponse.empty({ status: 401 });
        }

        if (request.method !== "POST" || pathname !== Trigger.path) {
          return HttpServerResponse.empty({ status: 404 });
        }

        const bodyResult = yield* Effect.result(
          HttpServerRequest.schemaBodyJson(NotifyOptions),
        );

        if (Result.isFailure(bodyResult)) {
          return yield* bodyResult.failure;
        }

        const body = bodyResult.success;
        const NotifyRunLayer = Layer.merge(
          NotifyLayer,
          Boolean.match(body.dryRun, {
            onFalse: () => EmailChannelLayer,
            onTrue: () => ConsoleChannelLayer,
          }),
        );

        yield* notify(body).pipe(Effect.provide(NotifyRunLayer));

        return yield* HttpServerResponse.json({ ok: true });
      }).pipe(
        Effect.tapCause((cause) =>
          Effect.logError("notify job: fetch failed", cause),
        ),
        Effect.catchTag("SchemaError", (error) =>
          HttpServerResponse.json({ error: error.message }, { status: 400 }),
        ),
        Effect.catchCause(() =>
          Effect.succeed(HttpServerResponse.empty({ status: 500 })),
        ),
      ),
    };
  }).pipe(
    Effect.provide(
      Layer.merge(
        Cloudflare.D1.QueryDatabaseBinding,
        Cloudflare.Workers.CronEventSourceLive,
      ),
    ),
  ),
);
