/// <reference types="@cloudflare/workers-types" />

import { serialize } from "@dtpt/core/lib/utils";
import { ConsoleChannelLayer } from "@dtpt/core/modules/channels/console/service";
import { EmailChannelLayer } from "@dtpt/core/modules/channels/email/service";
import { DateTime, Effect, Match, Schema } from "effect";

import { makeJobWorkerRuntime } from "../runtime.js";
import {
  decodeNotifyOptions,
  notify,
} from "./index.js";

export type NotifyWorkerEnv = {
  readonly Database: D1Database;
  readonly ENV: "development" | "production";
};

class BadRequest extends Schema.TaggedErrorClass<BadRequest>()(
  "BadRequest",
  { message: Schema.String },
) {}

const makeDateTimeFromController = (time: number) =>
  DateTime.makeUnsafe(new Date(time));

const decodeRequestBody = Effect.fn(
  "NotifyWorker.decodeRequestBody",
)(function* (request: Request) {
  const text = yield* Effect.tryPromise({
    try: () => request.text(),
    catch: (error) => new BadRequest({ message: serialize(error) }),
  });

  const body = yield* Effect.try({
    try: () => (text ? (JSON.parse(text) as unknown) : {}),
    catch: (error) => new BadRequest({ message: serialize(error) }),
  });

  return yield* decodeNotifyOptions(body).pipe(
    Effect.mapError((error) => new BadRequest({ message: error.message })),
  );
});

export default {
  async scheduled(controller, env) {
    const runtime = makeJobWorkerRuntime(env);

    const worker = Effect.gen(function* () {
      const now = makeDateTimeFromController(controller.scheduledTime);

      yield* Effect.logInfo("notify worker: scheduled", {
        cron: controller.cron,
        scheduledTime: DateTime.formatIso(now),
      });

      yield* notify({ now });
    }).pipe(Effect.provide(EmailChannelLayer));

    await runtime.runPromise(worker).finally(runtime.dispose);
  },

  async fetch(request, env) {
    const runtime = makeJobWorkerRuntime(env);

    const worker = Effect.gen(function* () {
      if (env.ENV !== "development") {
        return Response.json({ error: "not found" }, { status: 404 });
      }

      const pathname = new URL(request.url).pathname;

      if (pathname !== "/local/notify") {
        return Response.json({ error: "not found" }, { status: 404 });
      }

      return yield* Match.value(request.method).pipe(
        Match.when("POST", () =>
          Effect.gen(function* () {
            const opts = yield* decodeRequestBody(request);

            const ChannelLayer = Match.value(opts.dryRun).pipe(
              Match.when(true, () => ConsoleChannelLayer),
              Match.orElse(() => EmailChannelLayer),
            );

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
              ...(opts.user && { user: opts.user }),
            }).pipe(Effect.provide(ChannelLayer));

            return Response.json({ ok: true });
          }),
        ),
        Match.orElse(() =>
          Effect.succeed(
            Response.json({ error: "method not allowed" }, { status: 405 }),
          ),
        ),
      );
    }).pipe(
      Effect.catchTag("BadRequest", (error) =>
        Effect.succeed(
          Response.json({ error: error.message }, { status: 400 }),
        ),
      ),
      Effect.catchCause((cause) =>
        Effect.succeed(
          Response.json({ error: serialize(cause) }, { status: 500 }),
        ).pipe(
          Effect.tap(() =>
            Effect.logError("notify worker run failed", { cause }),
          ),
        ),
      ),
    );

    return await runtime.runPromise(worker).finally(runtime.dispose);
  },
} satisfies ExportedHandler<NotifyWorkerEnv>;
