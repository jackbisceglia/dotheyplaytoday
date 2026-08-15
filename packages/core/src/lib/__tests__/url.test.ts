import { Stack } from "alchemy";
import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, Effect, Layer, Option } from "effect";

import { ApiUrl, ServerBoundPort } from "../config/api.js";
import { WebConfig, WebConfigAlchemy, WebUrl } from "../config/web.js";
import { buildServiceUrl } from "../url.js";

const webConfigAlchemy = (stage: string, env: Record<string, string>) => {
  const EnvLayer = ConfigProvider.layer(ConfigProvider.fromUnknown(env));
  if (stage === "production") {
    return WebConfig.pipe(Effect.provide(EnvLayer));
  }
  const StackLayer = Layer.succeed(Stack, {
    name: "dotheyplaytoday",
    stage,
    resources: {},
    bindings: {},
    actions: {},
  });

  return WebConfig.pipe(
    Effect.provide(
      WebConfigAlchemy.pipe(Layer.provide(Layer.merge(EnvLayer, StackLayer))),
    ),
  );
};

describe("url config", () => {
  it("builds service urls from base urls and optional ports", () => {
    expect(buildServiceUrl("https://example.com", Option.none())).toBe(
      "https://example.com",
    );

    expect(buildServiceUrl("https://example.com/path/", Option.none())).toBe(
      "https://example.com",
    );

    expect(buildServiceUrl("http://localhost", Option.some(3000))).toBe(
      "http://localhost:3000",
    );

    expect(buildServiceUrl("https://example.com", Option.some(443))).toBe(
      "https://example.com",
    );
  });

  it.effect(
    "builds localhost api and web urls from PUBLIC URL bases and ports",
    () =>
      Effect.gen(function* () {
        const apiUrl = yield* ApiUrl;
        const webUrl = yield* WebUrl;

        expect(apiUrl).toBe("http://localhost:3001");
        expect(webUrl).toBe("http://localhost:3000");
      }).pipe(
        Effect.provide(
          ConfigProvider.layer(
            ConfigProvider.fromEnv({
              env: {
                PUBLIC_API_URL_BASE: "http://localhost",
                PUBLIC_API_URL_PORT: "3001",
                PUBLIC_WEB_URL_BASE: "http://localhost",
                PUBLIC_WEB_URL_PORT: "3000",
              },
            }),
          ),
        ),
      ),
  );

  it.effect("uses public url bases without ports", () =>
    Effect.gen(function* () {
      const apiUrl = yield* ApiUrl;
      const webUrl = yield* WebUrl;

      expect(apiUrl).toBe("https://api.example.com");
      expect(webUrl).toBe("https://example.com");
    }).pipe(
      Effect.provide(
        ConfigProvider.layer(
          ConfigProvider.fromEnv({
            env: {
              PUBLIC_API_URL_BASE: "https://api.example.com",
              PUBLIC_WEB_URL_BASE: "https://example.com",
            },
          }),
        ),
      ),
    ),
  );

  it.effect("uses localhost in development and deployment config otherwise", () =>
    Effect.gen(function* () {
      const devConfig = yield* webConfigAlchemy("dev_jack", {
        PUBLIC_WEB_URL_PORT: "4321",
      });
      const productionConfig = yield* webConfigAlchemy("production", {
        PUBLIC_WEB_URL_BASE: "https://web-worker.example.workers.dev",
      });

      expect(devConfig.baseUrl).toBe("http://localhost");
      expect(Option.getOrUndefined(devConfig.port)).toBe(4321);
      expect(productionConfig.baseUrl).toBe(
        "https://web-worker.example.workers.dev",
      );
      expect(Option.isNone(productionConfig.port)).toBe(true);
    }),
  );

  it.effect("requires api and web URL bases", () =>
    Effect.gen(function* () {
      const apiExit = yield* ApiUrl.pipe(Effect.exit);
      const webExit = yield* WebUrl.pipe(Effect.exit);

      expect(apiExit._tag).toBe("Failure");
      expect(webExit._tag).toBe("Failure");
    }).pipe(
      Effect.provide(
        ConfigProvider.layer(
          ConfigProvider.fromEnv({
            env: {
              PUBLIC_API_URL_PORT: "3001",
              PUBLIC_WEB_URL_PORT: "3000",
            },
          }),
        ),
      ),
    ),
  );

  it.effect("ignores legacy URL and port names", () =>
    Effect.gen(function* () {
      const apiExit = yield* ApiUrl.pipe(Effect.exit);
      const webExit = yield* WebUrl.pipe(Effect.exit);

      expect(apiExit._tag).toBe("Failure");
      expect(webExit._tag).toBe("Failure");
    }).pipe(
      Effect.provide(
        ConfigProvider.layer(
          ConfigProvider.fromEnv({
            env: {
              API_PORT: "3001",
              WEB_PORT: "3000",
              VITE_API_URL_BASE: "https://api.example.com",
              VITE_API_URL_PORT: "3001",
              VITE_WEB_URL_BASE: "https://example.com",
              VITE_WEB_URL_PORT: "3000",
              VITE_API_URL: "https://api.example.com",
              VITE_WEB_URL: "https://example.com",
            },
          }),
        ),
      ),
    ),
  );

  it.effect("binds the server with PUBLIC_API_URL_PORT", () =>
    Effect.gen(function* () {
      const configuredPort = yield* ServerBoundPort;

      expect(configuredPort).toBe(4001);
    }).pipe(
      Effect.provide(
        ConfigProvider.layer(
          ConfigProvider.fromEnv({
            env: {
              PUBLIC_API_URL_BASE: "http://localhost",
              PUBLIC_API_URL_PORT: "4001",
            },
          }),
        ),
      ),
    ),
  );

  it.effect(
    "defaults the server bind port when PUBLIC_API_URL_PORT is absent",
    () =>
      Effect.gen(function* () {
        const configuredPort = yield* ServerBoundPort;

        expect(configuredPort).toBe(8080);
      }).pipe(
        Effect.provide(
          ConfigProvider.layer(
            ConfigProvider.fromEnv({
              env: {
                PUBLIC_API_URL_BASE: "https://api.example.com",
              },
            }),
          ),
        ),
      ),
  );
});
