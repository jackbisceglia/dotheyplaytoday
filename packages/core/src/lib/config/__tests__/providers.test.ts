import { describe, expect, it } from "@effect/vitest";
import * as Cloudflare from "alchemy/Cloudflare";
import { Config, ConfigProvider, Effect, Layer, Redacted } from "effect";

import { createConfigProviderFromAlchemyWorkerEnv } from "../providers.js";
import { WebUrl } from "../web.js";

const workerEnv = (env: Record<string, unknown>) =>
  createConfigProviderFromAlchemyWorkerEnv().pipe(
    Layer.provide(Layer.succeed(Cloudflare.Workers.WorkerEnvironment, env)),
  );

describe("createConfigProviderFromAlchemyWorkerEnv", () => {
  it.effect("decodes Alchemy's serialized Redacted markers", () =>
    Effect.gen(function* () {
      const secret = yield* Config.redacted("RESEND_API_KEY");
      const webUrl = yield* WebUrl;

      expect(Redacted.value(secret)).toBe("re_test_key");
      expect(webUrl).toBe("http://localhost:4321");
    }).pipe(
      Effect.provide(
        workerEnv({
          RESEND_API_KEY: '{"_tag":"Redacted","value":"re_test_key"}',
          PUBLIC_WEB_URL_BASE: '{"_tag":"Redacted","value":"http://localhost"}',
          PUBLIC_WEB_URL_PORT: '{"_tag":"Redacted","value":"4321"}',
        }),
      ),
    ),
  );

  it.effect("passes plain bindings through unchanged", () =>
    Effect.gen(function* () {
      const value = yield* Config.string("PLAIN_BINDING");

      expect(value).toBe('not json {"just" text');
    }).pipe(
      Effect.provide(workerEnv({ PLAIN_BINDING: 'not json {"just" text' })),
    ),
  );

  it.effect("falls back to the ambient provider for missing keys", () =>
    Effect.gen(function* () {
      const value = yield* Config.string("AMBIENT_ONLY");

      expect(value).toBe("from-ambient");
    }).pipe(
      Effect.provide(
        workerEnv({}).pipe(
          Layer.provide(
            ConfigProvider.layer(
              ConfigProvider.fromEnv({ env: { AMBIENT_ONLY: "from-ambient" } }),
            ),
          ),
        ),
      ),
    ),
  );
});
