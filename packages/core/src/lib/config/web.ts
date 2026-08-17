import { Stack } from "alchemy";
import { Config, ConfigProvider, Effect, Layer } from "effect";

import { getServiceDomain, url } from "../alchemy/domain.js";
import { isDevStage } from "../alchemy/stage.js";
import { buildServiceUrl } from "../url.js";

export type WebConfig = Config.Success<typeof WebConfig>;
export const WebConfig = Config.all({
  baseUrl: Config.string("VITE_WEB_URL_BASE"),
  port: Config.port("VITE_WEB_URL_PORT").pipe(Config.option),
});

export const WebConfigAlchemy = Layer.unwrap(
  Effect.gen(function* () {
    const stack = yield* Stack;
    const baseUrl = isDevStage(stack.stage)
      ? url("localhost", "http")
      : url(getServiceDomain("web", stack.stage));

    return ConfigProvider.layerAdd(
      ConfigProvider.fromUnknown({ VITE_WEB_URL_BASE: baseUrl }),
      { asPrimary: true },
    );
  }),
);

export const WebUrl = Effect.gen(function* () {
  const config = yield* WebConfig;

  return buildServiceUrl(config.baseUrl, config.port);
}).pipe(Effect.orDie);
