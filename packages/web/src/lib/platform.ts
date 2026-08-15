import { createConfigProviderFromViteEnv } from "@dtpt/core/lib/config/providers";
import { Layer, ManagedRuntime } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

const apiEnv =
  import.meta.env.VITE_API_URL === undefined
    ? import.meta.env
    : {
        PUBLIC_API_URL_BASE: import.meta.env.VITE_API_URL,
      };

export const ViteEnvConfigProvider = createConfigProviderFromViteEnv(apiEnv);

export const RuntimeClient = ManagedRuntime.make(
  ViteEnvConfigProvider.pipe(Layer.provideMerge(FetchHttpClient.layer)),
);
