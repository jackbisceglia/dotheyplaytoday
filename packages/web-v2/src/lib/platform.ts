import { ConfigProvider, Layer, ManagedRuntime } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

export const ViteEnvConfigProvider = ConfigProvider.layer(
  ConfigProvider.fromUnknown(import.meta.env),
);

export const RuntimeClient = ViteEnvConfigProvider.pipe(
  Layer.provideMerge(FetchHttpClient.layer),
  ManagedRuntime.make,
);
