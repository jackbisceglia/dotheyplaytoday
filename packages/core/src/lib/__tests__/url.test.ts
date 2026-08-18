import { describe, expect, it } from "@effect/vitest";
import { ConfigProvider, Effect, Option } from "effect";

import { ApiUrl, ServerBoundPort } from "../config/api.js";
import { WebUrl } from "../config/web.js";
import { buildServiceUrl } from "../url.js";

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
    "builds localhost api and web urls from VITE URL bases and ports",
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
                VITE_API_URL_BASE: "http://localhost",
                VITE_API_URL_PORT: "3001",
                VITE_WEB_URL_BASE: "http://localhost",
                VITE_WEB_URL_PORT: "3000",
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
              VITE_API_URL_BASE: "https://api.example.com",
              VITE_WEB_URL_BASE: "https://example.com",
            },
          }),
        ),
      ),
    ),
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
              VITE_API_URL_PORT: "3001",
              VITE_WEB_URL_PORT: "3000",
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
              PUBLIC_API_URL_BASE: "https://api.example.com",
              PUBLIC_API_URL_PORT: "3001",
              PUBLIC_WEB_URL_BASE: "https://example.com",
              PUBLIC_WEB_URL_PORT: "3000",
              VITE_API_URL: "https://api.example.com",
              VITE_WEB_URL: "https://example.com",
            },
          }),
        ),
      ),
    ),
  );

  it.effect("binds the server with VITE_API_URL_PORT", () =>
    Effect.gen(function* () {
      const configuredPort = yield* ServerBoundPort;

      expect(configuredPort).toBe(4001);
    }).pipe(
      Effect.provide(
        ConfigProvider.layer(
          ConfigProvider.fromEnv({
            env: {
              VITE_API_URL_BASE: "http://localhost",
              VITE_API_URL_PORT: "4001",
            },
          }),
        ),
      ),
    ),
  );

  it.effect(
    "defaults the server bind port when VITE_API_URL_PORT is absent",
    () =>
      Effect.gen(function* () {
        const configuredPort = yield* ServerBoundPort;

        expect(configuredPort).toBe(8080);
      }).pipe(
        Effect.provide(
          ConfigProvider.layer(
            ConfigProvider.fromEnv({
              env: {
                VITE_API_URL_BASE: "https://api.example.com",
              },
            }),
          ),
        ),
      ),
  );
});
