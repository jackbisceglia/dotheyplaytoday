import { ConfigProvider } from "effect";

export const DotEnvConfigProvider = ConfigProvider.layer(
  ConfigProvider.fromDotEnv({ path: "../../.env" }),
);
