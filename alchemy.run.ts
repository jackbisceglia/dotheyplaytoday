import * as Alchemy from "alchemy";
import { Action, AlchemyContext } from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";

import { createD1HttpBinding } from "./packages/core/dist/lib/database/clients/d1/http-binding.js";
import { createD1DatabaseLayer } from "./packages/core/dist/lib/database/clients/d1/layer.js";
import { D1DatabaseResource } from "./packages/core/dist/lib/database/clients/d1/resource.js";
import {
  runSeed,
  SeedDomainsLayer,
} from "./packages/data/dist/seed/program.js";
import NotifyJobWorker from "./packages/jobs/dist/notify/worker.js";

// TODO(alchemy): once Actions can bind D1 directly, replace the HTTP binding
// with Cloudflare.D1.QueryDatabase(D1DatabaseResource) +
// createD1DatabaseLayerFromResource and drop the accountId/databaseId inputs.
const Seed = Action(
  "Seed",
  Effect.gen(function* () {
    const resolveCredentials = yield* Cloudflare.Credentials;

    return Effect.fn(function* (input: {
      accountId: string;
      databaseId: string;
      version: string;
    }) {
      const credentials = yield* resolveCredentials;
      const headers: Record<string, string> =
        credentials.type === "apiKey"
          ? {
              "X-Auth-Key": Redacted.value(credentials.apiKey),
              "X-Auth-Email": credentials.email,
            }
          : {
              Authorization: `Bearer ${Redacted.value(
                credentials.type === "apiToken"
                  ? credentials.apiToken
                  : credentials.accessToken,
              )}`,
            };

      const DatabaseLayer = createD1DatabaseLayer(
        createD1HttpBinding({
          accountId: input.accountId,
          databaseId: input.databaseId,
          headers,
        }),
      );

      const summary = yield* runSeed("dev").pipe(
        Effect.provide(
          SeedDomainsLayer.pipe(Layer.provideMerge(DatabaseLayer)),
        ),
      );

      yield* Effect.logInfo("seed: completed", {
        version: input.version,
        summary,
      });

      return { summary };
    });
  }),
);

export default Alchemy.Stack(
  "dotheyplaytoday",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const database = yield* D1DatabaseResource;
    const notifyJobWorker = yield* NotifyJobWorker;

    const context = yield* AlchemyContext;
    if (context.dev) {
      yield* Seed("Dev", {
        accountId: database.accountId,
        databaseId: database.databaseId,
        // non-deterministic input so the seed reruns on every dev apply
        version: Date.now().toString(),
      });
    }

    return {
      databaseName: database.databaseName,
      notifyJobWorkerName: notifyJobWorker.workerName,
      notifyJobWorkerUrl: notifyJobWorker.url,
    };
  }),
);
