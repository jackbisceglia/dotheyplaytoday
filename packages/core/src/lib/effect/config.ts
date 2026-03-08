import { PlatformConfigProvider } from "@effect/platform";
import { ConfigProvider, Layer } from "effect";

export function createConfigProviderFromDotEnv(path: string) {
  return PlatformConfigProvider.layerDotEnvAdd(path);
}

export function createConfigProviderFromViteEnv(
  viteEnv: Parameters<typeof ConfigProvider.fromJson>[0],
) {
  return ConfigProvider.fromJson(viteEnv).pipe(Layer.setConfigProvider);
}
