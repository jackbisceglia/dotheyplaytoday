// Import narrowly, never the `@dtpt/core` barrel: the barrel drags in
// node-only modules (e.g. lib/database/node -> config) whose top-level
// `new URL(import.meta.url)` throws when bundled into a workerd Worker.
import { createD1DatabaseLayer } from "@dtpt/core/lib/database/d1";
import { CloudflareCryptoLayer } from "@dtpt/core/lib/effect/crypto/cloudflare";
import { IdLayer } from "@dtpt/core/lib/id/service";
import { EmailChannelLayer } from "@dtpt/core/modules/channels/email/service";
import { EventsLayer } from "@dtpt/core/modules/events/service";
import { SubscriptionsLayer } from "@dtpt/core/modules/subscriptions/service";
import * as Cloudflare from "alchemy/Cloudflare";
import { Config, DateTime, Effect, Layer } from "effect";

import { Database } from "./database.ts";
import { notify } from "./index.ts";

export const NotifyCron = "*/15 * * * *";

// Domain services composed once at worker definition. D1 is layered in per
// invocation from the bound binding (see below); everything else is static.
const DomainLayer = Layer.mergeAll(SubscriptionsLayer, EventsLayer).pipe(
  Layer.provide(IdLayer),
  Layer.provideMerge(CloudflareCryptoLayer),
);

export default Cloudflare.Worker(
  "NotifyWorker",
  {
    main: import.meta.filename,
    compatibility: {
      date: "2026-06-02",
      flags: ["nodejs_compat"],
    },
    env: {
      PUBLIC_WEB_URL_BASE: Config.string("PUBLIC_WEB_URL_BASE"),
      RESEND_API_KEY: Config.redacted("RESEND_API_KEY"),
      RESEND_FROM_EMAIL: Config.string("RESEND_FROM_EMAIL"),
    },
  },
  Effect.gen(function* () {
    // Bind D1 as a capability: no hand-written env type, no reaching into a
    // raw `env.Database`. `db.raw` resolves the underlying binding at runtime.
    const db = yield* Cloudflare.D1Connection.bind(Database);

    const DatabaseLayer = Layer.unwrap(
      Effect.map(db.raw, (binding) => createD1DatabaseLayer(binding)),
    );

    const RunLayer = Layer.mergeAll(DomainLayer, EmailChannelLayer).pipe(
      Layer.provideMerge(DatabaseLayer),
    );

    yield* Cloudflare.cron(NotifyCron).subscribe((controller) =>
      Effect.gen(function* () {
        const now = DateTime.makeUnsafe(new Date(controller.scheduledTime));

        yield* Effect.logInfo("notify worker: scheduled", {
          cron: controller.cron,
          scheduledTime: DateTime.formatIso(now),
        });

        yield* notify({ now });
      }).pipe(Effect.provide(RunLayer)),
    );
  }).pipe(
    Effect.provide(
      Layer.mergeAll(
        Cloudflare.D1ConnectionLive,
        Cloudflare.CronEventSourceLive,
      ),
    ),
  ),
);
