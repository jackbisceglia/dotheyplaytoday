import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, Effect, Option } from "effect";

import { ApiUrl, ServerBoundPort } from "../config/api.js";
import { WebUrl } from "../config/web.js";
import { buildServiceUrl } from "../url.js";

describe("v2 url config", () => {
  it("builds service urls from explicit urls or localhost ports", () => {
    expect(
      buildServiceUrl({
        url: Option.some("https://example.com"),
        port: Option.some(3000),
      }),
    ).toEqual(Option.some("https://example.com"));

    expect(
      buildServiceUrl({ url: Option.none(), port: Option.some(3000) }),
    ).toEqual(Option.some("http://localhost:3000"));

    expect(
      buildServiceUrl({ url: Option.none(), port: Option.none() }),
    ).toEqual(Option.none());
  });

  it.effect("derives localhost api and web urls from required ports", () =>
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
              API_PORT: "3001",
              WEB_PORT: "3000",
            },
          }),
        ),
      ),
    ),
  );

  it.effect("uses public url overrides without ports", () =>
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
              VITE_API_URL: "https://api.example.com",
              VITE_WEB_URL: "https://example.com",
            },
          }),
        ),
      ),
    ),
  );

  it.effect("requires api and web ports when url overrides are absent", () =>
    Effect.gen(function* () {
      const apiExit = yield* ApiUrl.pipe(Effect.exit);
      const webExit = yield* WebUrl.pipe(Effect.exit);

      expect(apiExit._tag).toBe("Failure");
      expect(webExit._tag).toBe("Failure");
    }).pipe(
      Effect.provide(
        ConfigProvider.layer(
          ConfigProvider.fromEnv({
            env: {},
          }),
        ),
      ),
    ),
  );

  it.effect("binds the server with API_PORT", () =>
    Effect.gen(function* () {
      const configuredPort = yield* ServerBoundPort.pipe(
        Effect.provide(
          ConfigProvider.layer(
            ConfigProvider.fromEnv({ env: { API_PORT: "4001" } }),
          ),
        ),
      );

      expect(configuredPort).toBe(4001);
    }),
  );
});
