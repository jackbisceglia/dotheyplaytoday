import * as Cloudflare from "alchemy/Cloudflare";
import { Stack } from "alchemy/Stack";
import { Effect, Layer, Option, pipe, Result } from "effect";
import * as HttpServerRequest from "effect/unstable/http/HttpServerRequest";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";

import { isDevStage } from "@dtpt/core/lib/alchemy/stage";
import { WebConfig } from "@dtpt/core/lib/config/web";
import { createD1DatabaseLayer } from "@dtpt/core/lib/database/clients/d1/layer";
import { D1DatabaseResource } from "@dtpt/core/lib/database/clients/d1/resource";
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
  },
  Effect.gen(function* () {
    const database = yield* Cloudflare.D1.QueryDatabase(D1DatabaseResource);

    yield* ResendConfig;
    yield* WebConfig;
    const stack = yield* Stack;

    const DatabaseLayer = Layer.unwrap(
      database.raw.pipe(Effect.map(createD1DatabaseLayer)),
    );
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

        if (
          request.method !== "POST" ||
          pathname !== Trigger.path ||
          !isDevStage(stack.stage)
        ) {
          return HttpServerResponse.empty({ status: 404 });
        }

        const decoded = yield* HttpServerRequest.schemaBodyJson(
          NotifyOptions,
        ).pipe(Effect.result);

        if (Result.isFailure(decoded)) {
          if (decoded.failure._tag === "SchemaError") {
            return yield* HttpServerResponse.json(
              { ok: false, error: decoded.failure.message },
              { status: 400 },
            );
          }

          return yield* decoded.failure;
        }

        const opts = decoded.success;
        const dryRun = opts.dryRun === true;
        const ChannelLayer = dryRun ? ConsoleChannelLayer : EmailChannelLayer;

        yield* notify(opts).pipe(
          Effect.provide(Layer.merge(NotifyLayer, ChannelLayer)),
        );

        return yield* HttpServerResponse.json({
          ok: true,
          dryRun,
        });
      }).pipe(
        Effect.catchCause(
          Effect.fn(function* (cause) {
            yield* Effect.logError("notify job: fetch failed", cause);

            return yield* HttpServerResponse.json(
              { ok: false },
              { status: 500 },
            );
          }),
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
