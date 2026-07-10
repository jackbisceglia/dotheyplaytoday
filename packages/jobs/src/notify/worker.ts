import { ALCHEMY_DEV } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { Effect, Layer, pipe } from "effect";
import { HttpServerRequest } from "effect/unstable/http/HttpServerRequest";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";

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
import { notify } from "./index.ts";

const NotifySchedule = "*/15 * * * *";

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
  },
  Effect.gen(function* () {
    const database = yield* Cloudflare.D1.QueryDatabase(D1DatabaseResource);

    yield* ResendConfig;
    yield* WebConfig;
    const isDev = yield* ALCHEMY_DEV;

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
        const request = yield* HttpServerRequest;
        const pathname = new URL(request.url).pathname;

        if (request.method !== "POST") {
          return HttpServerResponse.empty({ status: 404 });
        }
        if (pathname !== "/test/notify") {
          return HttpServerResponse.empty({ status: 404 });
        }
        if (!isDev) {
          return HttpServerResponse.empty({ status: 404 });
        }

        yield* notify({ dryRun: true }).pipe(
          Effect.provide(Layer.merge(NotifyLayer, ConsoleChannelLayer)),
        );

        return HttpServerResponse.text("ok");
      }).pipe(
        Effect.catchCause(
          Effect.fn(function* (cause) {
            yield* Effect.logError("notify job: fetch failed", cause);

            return HttpServerResponse.text("error", { status: 500 });
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
