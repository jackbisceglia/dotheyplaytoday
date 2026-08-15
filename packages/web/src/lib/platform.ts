import { ConfigProvider, Layer, ManagedRuntime } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

const legacyApiBase = import.meta.env.PUBLIC_API_URL_BASE ?? "http://localhost";
const legacyApiPort =
  import.meta.env.PUBLIC_API_URL_PORT ??
  (legacyApiBase === "http://localhost" ? "3001" : undefined);
const apiUrl = new URL(
  import.meta.env.VITE_API_URL ??
    `${legacyApiBase}${legacyApiPort === undefined ? "" : `:${legacyApiPort}`}`,
);

export const ViteEnvConfigProvider = ConfigProvider.layer(
  ConfigProvider.fromUnknown({
    PUBLIC_API_URL_BASE: apiUrl.toString().replace(/\/$/, ""),
  }),
);

export const RuntimeClient = ManagedRuntime.make(
  ViteEnvConfigProvider.pipe(Layer.provideMerge(FetchHttpClient.layer)),
);
