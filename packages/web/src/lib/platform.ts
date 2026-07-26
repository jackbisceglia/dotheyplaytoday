import { createConfigProviderFromViteEnv } from "@dtpt/core/lib/config/providers/vite";
import { Layer, ManagedRuntime } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

export const ViteEnvConfigProvider = createConfigProviderFromViteEnv(
  import.meta.env,
);

export const RuntimeClient = ManagedRuntime.make(
  ViteEnvConfigProvider.pipe(Layer.provideMerge(FetchHttpClient.layer)),
);
