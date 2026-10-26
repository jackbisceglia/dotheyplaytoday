import * as Cloudflare from "alchemy/Cloudflare";
import { RuntimeContext } from "alchemy/RuntimeContext";
import { ConfigProvider, Effect, Layer, Redacted } from "effect";
import { HttpEffect } from "effect/unstable/http";
import * as HttpRouter from "effect/unstable/http/HttpRouter";
import { Pool } from "pg";
import { expect, it, vi } from "vitest";

import { makeApiFetch } from "../runtime.js";
import { RateLimiter } from "../rate-limit/service.js";

vi.mock("effect/unstable/http/HttpRouter", async (original) => {
  const module =
    await original<typeof import("effect/unstable/http/HttpRouter")>();
  return { ...module, toHttpEffect: vi.fn(module.toHttpEffect) };
});

const config = (web: string) =>
  ConfigProvider.layer(
    ConfigProvider.fromUnknown({
      BETTER_AUTH_SECRET: "test-secret-at-least-thirty-two-characters",
      VITE_API_URL_BASE: "https://api.example.com",
      VITE_WEB_URL_BASE: web,
    }),
  );

it("survives a canceled cold request, reuses init config, and scopes live request resources", async () => {
  let connections = 0;
  const unused = Effect.die("Unexpected binding access");
  const hyperdrive: Cloudflare.Hyperdrive.ConnectClient = {
    connectionString: Effect.sync(() => {
      connections++;
      return Redacted.make("postgres://localhost/unused");
    }),
    raw: unused,
    host: unused,
    port: unused,
    user: unused,
    password: unused,
    database: unused,
  };
  const make = (web: string) =>
    Effect.runPromise(
      makeApiFetch(hyperdrive).pipe(
        Effect.provide([
          config(web),
          Layer.succeed(RateLimiter, { check: () => Effect.void }),
        ]),
      ),
    );
  const entered = Promise.withResolvers<undefined>();
  const release = Promise.withResolvers<undefined>();
  const compile = vi.mocked(HttpRouter.toHttpEffect).getMockImplementation();
  if (!compile) throw new Error("Missing router implementation");
  vi.mocked(HttpRouter.toHttpEffect).mockImplementationOnce((layer) =>
    Effect.andThen(
      Effect.promise(() => {
        entered.resolve(undefined);
        return release.promise;
      }),
      compile(layer),
    ),
  );
  const fetch = await make("https://init.example.com");
  const close = vi.spyOn(Pool.prototype, "end");
  const live = await Effect.runPromise(
    Layer.build(
      Layer.mergeAll(
        config("https://request-must-not-be-captured.example.com"),
        Layer.mock(RuntimeContext, { Type: "test", id: "live", env: {} }),
        Layer.mock(Cloudflare.WorkerExecutionContext, {
          raw: {
            waitUntil: vi.fn(),
            passThroughOnException: vi.fn(),
            props: {},
            get tracing(): never {
              throw new Error("Unused");
            },
          },
          cache: { purge: () => Effect.die("Unused") },
        }),
      ),
    ).pipe(Effect.scoped),
  );
  const web = HttpEffect.toWebHandler(fetch.pipe(Effect.provideContext(live)));
  const run = (path: string, origin = "https://init.example.com") =>
    web(new Request(`https://api.example.com${path}`, { headers: { origin } }));
  const abort = new AbortController();
  const canceled = web(
    new Request("https://api.example.com/api/ping", { signal: abort.signal }),
  );
  await entered.promise;
  const concurrent = run("/api/ping");
  abort.abort();
  release.resolve(undefined);
  expect((await canceled).status).toBe(499);
  const responses = await Promise.all([concurrent, run("/api/ping")]);
  for (const response of responses) {
    expect(response.status).toBe(200);
    expect(response.headers.get("access-control-allow-origin")).toBe(
      "https://init.example.com",
    );
  }
  const preflight = await web(
    new Request("https://api.example.com/api/user", {
      method: "OPTIONS",
      headers: {
        origin: "https://init.example.com",
        "access-control-request-method": "POST",
      },
    }),
  );
  expect(preflight.status).toBe(204);
  expect(preflight.headers.get("access-control-allow-origin")).toBe(
    "https://init.example.com",
  );
  const head = await web(
    new Request("https://api.example.com/api/ping", { method: "HEAD" }),
  );
  expect(head.status).toBe(200);
  expect(await head.text()).toBe("");
  expect((await run("/api/missing")).status).toBe(404);
  expect(
    (await run("/api/ping", "https://untrusted.example.com")).headers.get(
      "access-control-allow-origin",
    ),
  ).toBe("https://init.example.com");
  expect(connections).toBe(0);
  expect(close).not.toHaveBeenCalled();
  expect(HttpRouter.toHttpEffect).toHaveBeenCalledTimes(1);
  const sessions = await Promise.all([
    run("/api/auth/get-session"),
    run("/api/auth/get-session"),
  ]);
  for (const response of sessions) expect(await response.json()).toBeNull();
  expect(connections).toBe(2);
  expect(close).toHaveBeenCalledTimes(2);
  expect((await run("/api/user")).status).toBe(401);
  expect(close).toHaveBeenCalledTimes(3);
  expect(HttpRouter.toHttpEffect).toHaveBeenCalledTimes(1);

  const other = await make("https://other.example.com");
  const response = await HttpEffect.toWebHandler(
    other.pipe(Effect.provideContext(live)),
  )(
    new Request("https://api.example.com/api/ping", {
      headers: { origin: "https://other.example.com" },
    }),
  );
  expect(response.headers.get("access-control-allow-origin")).toBe(
    "https://other.example.com",
  );
  expect(HttpRouter.toHttpEffect).toHaveBeenCalledTimes(2);
  close.mockRestore();
});
