import * as Cloudflare from "alchemy/Cloudflare";
import { Stack } from "alchemy";
import { getManagedServiceDomain } from "@dtpt/core/lib/alchemy/domain";
import { DatabaseHyperdrive } from "@dtpt/core/lib/database/clients/postgres/resource";
import { exactOptional } from "@dtpt/core/lib/utils";
import { EmailConfig, ResendConfig } from "@dtpt/core/modules/email/config";
import { Effect, Layer } from "effect";
import { makeApiFetch } from "./runtime.js";
import { AuthConfig } from "./auth/config.js";
import { RateLimiterLayer } from "./rate-limit/service.js";

const WorkerLayer = Layer.merge(
  Cloudflare.Hyperdrive.ConnectBinding,
  RateLimiterLayer,
);

const getApiDomain = (stage: string) => getManagedServiceDomain("api", stage);

export default class ApiWorker extends Cloudflare.Worker<ApiWorker>()(
  "ApiWorker",
  Effect.gen(function* () {
    const stack = yield* Stack;
    const domain = getApiDomain(stack.stage);

    return {
      main: import.meta.url,
      compatibility: { date: "2026-06-02", flags: ["nodejs_compat"] },
      dev: { port: 8080, strictPort: true },
      ...exactOptional(domain, (domain) => ({ domain })),
    };
  }),
  Effect.gen(function* () {
    // Resources
    const hyperdrive = yield* Cloudflare.Hyperdrive.Connect(DatabaseHyperdrive);

    // Read deferred auth/email config during init so Alchemy binds it to the Worker.
    yield* AuthConfig;
    yield* EmailConfig;
    yield* ResendConfig;

    return { fetch: yield* makeApiFetch(hyperdrive) };
  }).pipe(Effect.provide(WorkerLayer)),
) {}

/**
 * Binds the API's resolved public URL into a Worker's environment.
 * @returns {Effect.Effect<void>}
 */
export const bindApiUrl = (worker: Cloudflare.Worker, api: Cloudflare.Worker) =>
  worker.bind("ApiUrl", {
    bindings: [
      {
        type: "plain_text",
        name: "VITE_API_URL_BASE",
        text: api.url.as<string>(),
      },
    ],
  });
