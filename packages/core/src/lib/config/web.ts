import { Config, ConfigProvider, Effect } from "effect";

import { buildServiceUrl } from "../url.js";

export type WebConfig = Config.Success<typeof WebConfig>;
export const WebConfig = Config.all({
  baseUrl: Config.string("VITE_WEB_URL_BASE"),
  port: Config.port("VITE_WEB_URL_PORT").pipe(Config.option),
});

// TODO: Restore Alchemy-owned Web domains after custom domains are attached.
// const baseUrl = isDevStage(stack.stage)
//   ? url("localhost", "http")
//   : url(getServiceDomain("web", stack.stage));
// const BaseUrlSuccessProvider = ConfigProvider.fromUnknown({
//   VITE_WEB_URL_BASE: baseUrl,
// });
const BaseUrlSuccessProvider = ConfigProvider.fromUnknown({});

export const WebConfigAlchemy = ConfigProvider.layerAdd(
  BaseUrlSuccessProvider,
  { asPrimary: true },
);

export const WebUrl = Effect.gen(function* () {
  const config = yield* WebConfig;

  return buildServiceUrl(config.baseUrl, config.port);
}).pipe(Effect.orDie);
