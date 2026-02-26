import { PlatformConfigProvider } from "@effect/platform";

export function createConfigProviderFromDotEnv(path: string) {
  return PlatformConfigProvider.layerDotEnvAdd(path);
}
