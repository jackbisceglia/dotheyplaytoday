import { createConfigProviderFromDotEnv } from "@dtpt/core/lib/effect/config";

export const DotEnvConfigProvider =
  createConfigProviderFromDotEnv("../../.env");
