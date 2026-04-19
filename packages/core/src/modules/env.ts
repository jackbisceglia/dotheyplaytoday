import { createConfigProviderFromDotEnv } from "../lib/effect/config.js";

export const DotEnvConfigProvider =
  createConfigProviderFromDotEnv("../../.env");
