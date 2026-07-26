import { ConfigProvider } from "effect";

/**
 * Installs a config provider backed by Cloudflare's Worker `env` object.
 */
export const createConfigProviderFromCloudflareEnv = (env: unknown) =>
  ConfigProvider.layer(ConfigProvider.fromUnknown(env));
