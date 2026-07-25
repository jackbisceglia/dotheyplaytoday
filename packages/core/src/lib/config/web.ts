import { Stack } from "alchemy";
import { Config, ConfigProvider, Effect } from "effect";

import { getServiceDomain, url } from "../alchemy/domain.js";
import { isDevStage } from "../alchemy/stage.js";
import { buildServiceUrl } from "../url.js";

export type WebConfig = Config.Success<typeof WebConfig>;
export const WebConfig = Config.all({
  baseUrl: Config.string("PUBLIC_WEB_URL_BASE"),
  port: Config.port("PUBLIC_WEB_URL_PORT").pipe(Config.option),
});

export const WebConfigAlchemy = Effect.gen(function* () {
  const stack = yield* Stack;
  const baseUrl = isDevStage(stack.stage)
    ? url("localhost", "http")
    : url(getServiceDomain("web", stack.stage));

  return yield* WebConfig.pipe(
    Effect.provide(
      ConfigProvider.layerAdd(
        ConfigProvider.fromUnknown({ PUBLIC_WEB_URL_BASE: baseUrl }),
        { asPrimary: true },
      ),
    ),
  );
});

export const WebUrl = Effect.gen(function* () {
  const config = yield* WebConfig;

  return buildServiceUrl(config.baseUrl, config.port);
}).pipe(
  Effect.catchTags({
    ConfigError: (error) =>
      Effect.die(`Web configuration error: ${error.message}`),
  }),
);
