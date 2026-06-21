/// <reference types="@cloudflare/workers-types" />

import { createD1DatabaseLayer } from "@dtpt/core/lib/database/service";
import { IdLayer } from "@dtpt/core/lib/id/service";
import { EmailChannelLayer } from "@dtpt/core/modules/channels/email/service";
import { EventsLayer } from "@dtpt/core/modules/events/service";
import { SubscriptionsLayer } from "@dtpt/core/modules/subscriptions/service";
import {
  ConfigProvider,
  Crypto,
  DateTime,
  Effect,
  Layer,
  ManagedRuntime,
  pipe,
} from "effect";

import { notify } from "./index.js";

export type NotifyWorkerEnv = {
  readonly Database: D1Database;
  readonly PUBLIC_WEB_URL_BASE: string;
  readonly PUBLIC_WEB_URL_PORT?: string;
  readonly RESEND_API_KEY: string;
  readonly RESEND_FROM_EMAIL: string;
};

const WorkerCryptoLayer = Layer.succeed(
  Crypto.Crypto,
  Crypto.make({
    randomBytes: (size) => crypto.getRandomValues(new Uint8Array(size)),
    digest: (algorithm, data) =>
      Effect.promise(() =>
        crypto.subtle
          .digest(algorithm, data)
          .then((buffer) => new Uint8Array(buffer)),
      ),
  }),
);

const makeRuntime = (env: NotifyWorkerEnv) =>
  ManagedRuntime.make(
    pipe(
      Layer.mergeAll(SubscriptionsLayer, EventsLayer, EmailChannelLayer),
      Layer.provideMerge(createD1DatabaseLayer(env.Database)),
      Layer.provide(IdLayer),
      Layer.provideMerge(WorkerCryptoLayer),
      Layer.provideMerge(ConfigProvider.layer(ConfigProvider.fromUnknown(env))),
    ),
  );

const runScheduledNotify = async (
  controller: ScheduledController,
  env: NotifyWorkerEnv,
) => {
  const runtime = makeRuntime(env);
  const now = DateTime.makeUnsafe(new Date(controller.scheduledTime));

  await runtime
    .runPromise(
      Effect.gen(function* () {
        yield* Effect.logInfo("notify worker: scheduled", {
          cron: controller.cron,
          scheduledTime: DateTime.formatIso(now),
        });

        yield* notify({ now });
      }),
    )
    .finally(() => runtime.dispose());
};

export default {
  scheduled(controller, env, context) {
    context.waitUntil(runScheduledNotify(controller, env));
  },
} satisfies ExportedHandler<NotifyWorkerEnv>;
