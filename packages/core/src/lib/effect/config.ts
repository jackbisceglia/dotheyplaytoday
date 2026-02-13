import { PlatformConfigProvider } from "@effect/platform";
import { Effect, Layer } from "effect";

export function createConfigProviderFromDotEnv(path: string) {
  const Provider = PlatformConfigProvider.fromDotEnv(path);

  const ProviderLayer = Provider.pipe(
    Effect.map(Layer.setConfigProvider),
    Layer.unwrapEffect,
  );

  return ProviderLayer;
}
