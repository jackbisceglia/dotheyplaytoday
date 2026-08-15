import { Stack } from "alchemy";
import { Config, ConfigProvider, Effect, Layer } from "effect";

import { url } from "../alchemy/domain.js";
import { isDevStage } from "../alchemy/stage.js";
import { buildServiceUrl } from "../url.js";

export type WebConfig = Config.Success<typeof WebConfig>;
export const WebConfig = Config.all({
  baseUrl: Config.string("PUBLIC_WEB_URL_BASE"),
  port: Config.port("PUBLIC_WEB_URL_PORT").pipe(Config.option),
});

export const WebConfigAlchemy = Layer.unwrap(
  Effect.gen(function* () {
    const stack = yield* Stack;
    if (!isDevStage(stack.stage)) return Layer.empty;

    const BaseUrlSuccessProvider = ConfigProvider.fromUnknown({
      PUBLIC_WEB_URL_BASE: url("localhost", "http"),
    });

    return ConfigProvider.layerAdd(BaseUrlSuccessProvider, {
      asPrimary: true,
    });
  }),
);

export const WebUrl = Effect.gen(function* () {
  const config = yield* WebConfig;

  return buildServiceUrl(config.baseUrl, config.port);
}).pipe(Effect.orDie);
