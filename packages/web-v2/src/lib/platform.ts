import { ConfigProvider, Layer, ManagedRuntime } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

// TODO: Move into core-v2 when v1/v2 env loading is unified.
function createConfigProviderFromViteEnv(viteEnv: unknown) {
  return ConfigProvider.layer(ConfigProvider.fromUnknown(viteEnv));
}

export const ViteEnvConfigProvider = createConfigProviderFromViteEnv(
  import.meta.env,
);

export const RuntimeClient = ManagedRuntime.make(
  Layer.provideMerge(FetchHttpClient.layer, ViteEnvConfigProvider),
);
