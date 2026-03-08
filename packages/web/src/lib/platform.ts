import { FetchHttpClient } from "@effect/platform";
import { createConfigProviderFromViteEnv } from "@dtpt/core/lib/effect/config";
import { Layer, ManagedRuntime } from "effect";

export const ViteEnvConfigProvider = createConfigProviderFromViteEnv(
  import.meta.env,
);

export const RuntimeClient = ViteEnvConfigProvider.pipe(
  Layer.provideMerge(FetchHttpClient.layer),
  ManagedRuntime.make,
);
