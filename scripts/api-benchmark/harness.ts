import { makeApiFetch } from "../../packages/api/src/runtime.ts";
import { RateLimiter } from "../../packages/api/src/rate-limit/service.ts";
import { makeRequestEffect } from "alchemy/Cloudflare/Workers/HttpServer";
import {
  fromExecutionContext,
  WorkerExecutionContext,
} from "alchemy/Cloudflare/Workers/WorkerRuntime";
import { RuntimeContext } from "alchemy/RuntimeContext";
import { ConfigProvider, Effect, Layer, Redacted } from "effect";
import { counters } from "./pg.ts";

const secret = "benchmark-secret-at-least-thirty-two-characters";
const unused = Effect.die("Unexpected benchmark binding");
const hyperdrive = {
  connectionString: Effect.succeed(
    Redacted.make("postgres://unused/benchmark"),
  ),
  raw: unused,
  host: unused,
  port: unused,
  user: unused,
  password: unused,
  database: unused,
};
const config = Layer.mergeAll(
  ConfigProvider.layer(
    ConfigProvider.fromUnknown({
      BETTER_AUTH_SECRET: secret,
      VITE_API_URL_BASE: "https://api.example.com",
      VITE_WEB_URL_BASE: "https://web.example.com",
    }),
  ),
  Layer.succeed(RateLimiter, { check: () => Effect.void }),
  Layer.mock(RuntimeContext, { Type: "benchmark", id: "benchmark", env: {} }),
);
let fetchEffect;
let cookie;
export async function initialize() {
  fetchEffect = await Effect.runPromise(
    makeApiFetch(hyperdrive).pipe(Effect.provide(config)),
  );
}
export async function prepare() {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode("benchmark-token"),
  );
  cookie = `__Secure-better-auth.session_token=${encodeURIComponent(`benchmark-token.${btoa(String.fromCharCode(...new Uint8Array(signature)))}`)}`;
}
let requestNumber = 0;
export async function request(
  path,
  authenticated = false,
  ctx = { waitUntil() {}, passThroughOnException() {}, props: {} },
) {
  const headers = {
    "cf-connecting-ip": `192.0.${Math.floor(requestNumber++ / 20) % 250}.1`,
    origin: "https://web.example.com",
    ...(authenticated ? { cookie } : {}),
  };
  return Effect.runPromise(
    makeRequestEffect(
      new Request(`https://api.example.com${path}`, { headers }),
      fetchEffect,
    ).pipe(
      Effect.provideService(WorkerExecutionContext, fromExecutionContext(ctx)),
      Effect.provide(config),
      Effect.scoped,
    ),
  );
}
export { counters };
let initialized;
export default {
  async fetch(req, _env, ctx) {
    const url = new URL(req.url);
    if (url.pathname === "/__init") {
      await prepare();
      initialized = initialize();
      await initialized;
      return Response.json(counters);
    }
    await initialized;
    if (url.pathname === "/__counters") return Response.json(counters);
    return request(url.pathname, url.searchParams.has("auth"), ctx);
  },
};
