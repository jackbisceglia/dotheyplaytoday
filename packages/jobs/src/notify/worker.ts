/// <reference types="@cloudflare/workers-types" />

import { createConfigProviderFromCloudflareEnv } from "@dtpt/core/lib/config/providers";
import { createD1DatabaseLayer } from "@dtpt/core/lib/database/d1";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { IdLayer } from "@dtpt/core/lib/id/service";
import { serialize } from "@dtpt/core/lib/utils";
import { ConsoleChannelLayer } from "@dtpt/core/modules/channels/console/service";
import { EmailChannelLayer } from "@dtpt/core/modules/channels/email/service";
import { EventsLayer } from "@dtpt/core/modules/events/service";
import { SubjectsLayer } from "@dtpt/core/modules/subjects/service";
import { SubscriptionsLayer } from "@dtpt/core/modules/subscriptions/service";
import { UsersLayer } from "@dtpt/core/modules/users/service";
import { decodeSeedRunOptions, runSeed } from "@dtpt/data/seed/run";
import {
  Boolean,
  DateTime,
  Effect,
  Layer,
  ManagedRuntime,
  pipe,
  Schema,
} from "effect";

import { decodeNotifyRunOptions, notify } from "./index.js";

export type NotifyWorkerEnv = {
  readonly Database: D1Database;
  readonly ENVIRONMENT: "development" | "production";
};

class BadRequest extends Schema.TaggedErrorClass<BadRequest>()("BadRequest", {
  message: Schema.String,
}) {}

const NotifyWorkerLayer = pipe(
  Layer.mergeAll(SubscriptionsLayer, EventsLayer, SubjectsLayer, UsersLayer),
  Layer.provide(IdLayer),
  Layer.provideMerge(CloudflareCryptoLayer),
);

function makeRuntime(env: NotifyWorkerEnv) {
  const DatabaseLayer = createD1DatabaseLayer(env.Database);
  const ConfigProviderLayer = createConfigProviderFromCloudflareEnv(env);

  return ManagedRuntime.make(
    pipe(
      NotifyWorkerLayer,
      Layer.provideMerge(DatabaseLayer),
      Layer.provideMerge(ConfigProviderLayer),
    ),
  );
}

const makeDateTimeFromController = (time: number) =>
  DateTime.makeUnsafe(new Date(time));

const readRequestBody = Effect.fn("NotifyWorker.readRequestBody")(function* (
  request: Request,
) {
  const text = yield* Effect.tryPromise({
    try: () => request.text(),
    catch: (error) => new BadRequest({ message: serialize(error) }),
  });

  return yield* Effect.try({
    try: () => (text ? (JSON.parse(text) as unknown) : {}),
    catch: (error) => new BadRequest({ message: serialize(error) }),
  });
});

const badRequestFromDecode = (error: { readonly message: string }) =>
  new BadRequest({ message: error.message });

const handleLocalNotify = Effect.fn("NotifyWorker.handleLocalNotify")(
  function* (request: Request) {
    const body = yield* readRequestBody(request);
    const opts = yield* decodeNotifyRunOptions(body).pipe(
      Effect.mapError(badRequestFromDecode),
    );

    const ChannelLayer = Boolean.match(opts.dryRun, {
      onFalse: () => EmailChannelLayer,
      onTrue: () => ConsoleChannelLayer,
    });

    yield* Effect.logInfo("notify worker: local", {
      dryRun: opts.dryRun,
      force: opts.force,
      now: opts.now ? DateTime.formatIso(opts.now) : undefined,
      userEmail: opts.user,
    });

    yield* notify({
      dryRun: opts.dryRun,
      force: opts.force,
      ...(opts.now && { now: opts.now }),
      ...(opts.user && { userEmail: opts.user }),
    }).pipe(Effect.provide(ChannelLayer));

    return Response.json({ ok: true });
  },
);

const handleLocalSeed = Effect.fn("NotifyWorker.handleLocalSeed")(function* (
  request: Request,
) {
  const body = yield* readRequestBody(request);
  const opts = yield* decodeSeedRunOptions(body).pipe(
    Effect.mapError(badRequestFromDecode),
  );

  yield* Effect.logInfo("seed worker: local", { mode: opts.mode });

  const summary = yield* runSeed(opts);

  return Response.json({ ok: true, summary });
});

export default {
  async scheduled(controller, env) {
    const runtime = makeRuntime(env);
    const now = makeDateTimeFromController(controller.scheduledTime);

    const Worker = Effect.gen(function* () {
      yield* Effect.logInfo("notify worker: scheduled", {
        cron: controller.cron,
        scheduledTime: DateTime.formatIso(now),
      });

      yield* notify({ now });
    }).pipe(Effect.provide(EmailChannelLayer));

    await runtime.runPromise(Worker).finally(() => runtime.dispose());
  },

  async fetch(request, env) {
    const runtime = makeRuntime(env);
    const Worker = Effect.gen(function* () {
      const isDevelopment = env.ENVIRONMENT === "development";

      if (!isDevelopment) {
        return Response.json({ error: "not found" }, { status: 404 });
      }

      const pathname = new URL(request.url).pathname;

      if (pathname !== "/local/notify" && pathname !== "/local/seed") {
        return Response.json({ error: "not found" }, { status: 404 });
      }

      switch (request.method) {
        case "POST": {
          const handleLocalRequest =
            pathname === "/local/seed" ? handleLocalSeed : handleLocalNotify;

          return yield* handleLocalRequest(request);
        }
        default:
          return Response.json(
            { error: "method not allowed" },
            { status: 405 },
          );
      }
    }).pipe(
      Effect.catchTag("BadRequest", (error) =>
        Effect.succeed(
          Response.json({ error: error.message }, { status: 400 }),
        ),
      ),
      Effect.catchCause((cause) =>
        Effect.gen(function* () {
          yield* Effect.logError("worker: local run failed", { cause });

          return Response.json({ error: serialize(cause) }, { status: 500 });
        }),
      ),
    );

    return await runtime.runPromise(Worker).finally(() => runtime.dispose());
  },
} satisfies ExportedHandler<NotifyWorkerEnv>;
