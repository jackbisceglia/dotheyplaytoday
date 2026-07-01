/// <reference types="@cloudflare/workers-types" />

import { createConfigProviderFromCloudflareEnv } from "@dtpt/core/lib/config/providers";
import { createD1DatabaseLayer } from "@dtpt/core/lib/database/d1";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { IdLayer } from "@dtpt/core/lib/id/service";
import { EmailChannelLayer } from "@dtpt/core/modules/channels/email/service";
import { EventsLayer } from "@dtpt/core/modules/events/service";
import { SubscriptionsLayer } from "@dtpt/core/modules/subscriptions/service";
import { DateTime, Effect, Layer, ManagedRuntime, pipe } from "effect";

import { notify } from "./index.js";

export type NotifyWorkerEnv = {
  readonly Database: D1Database;
};

const NotifyWorkerLayer = pipe(
  Layer.mergeAll(SubscriptionsLayer, EventsLayer, EmailChannelLayer),
  Layer.provide(IdLayer),
  Layer.provideMerge(CloudflareCryptoLayer),
);

export default {
  async scheduled(controller, env) {
    const DatabaseLayer = createD1DatabaseLayer(env.Database);
    const ConfigProviderLayer = createConfigProviderFromCloudflareEnv(env);
    const runtime = ManagedRuntime.make(
      pipe(
        NotifyWorkerLayer,
        Layer.provideMerge(DatabaseLayer),
        Layer.provideMerge(ConfigProviderLayer),
      ),
    );
    const now = DateTime.makeUnsafe(new Date(controller.scheduledTime));
    const worker = Effect.gen(function* () {
      yield* Effect.logInfo("notify worker: scheduled", {
        cron: controller.cron,
        scheduledTime: DateTime.formatIso(now),
      });

      yield* notify({ now });
    });

    await runtime.runPromise(worker).finally(() => runtime.dispose());
  },
} satisfies ExportedHandler<NotifyWorkerEnv>;
