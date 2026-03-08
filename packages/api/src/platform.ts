import { NodeContext } from "@effect/platform-node";
import { createConfigProviderFromDotEnv } from "@dtpt/core/lib/effect/config";
import { Layer, ManagedRuntime } from "effect";

export const DotEnvConfigProvider =
  createConfigProviderFromDotEnv("../../.env");

export const RuntimeServer = DotEnvConfigProvider.pipe(
  Layer.provideMerge(NodeContext.layer),
  ManagedRuntime.make,
);
