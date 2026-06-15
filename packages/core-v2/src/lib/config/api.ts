import { Config, Effect, Option } from "effect";

import { buildServiceUrl } from "../url.js";

export type ApiConfig = Config.Success<typeof ApiConfig>;
export const ApiConfig = Config.all({
  baseUrl: Config.string("VITE_API_URL_BASE"),
  port: Config.port("VITE_API_URL_PORT").pipe(Config.option),
});

export const ApiUrl = Effect.gen(function* () {
  const config = yield* ApiConfig;

  return buildServiceUrl(config.baseUrl, config.port);
}).pipe(
  Effect.catchTags({
    ConfigError: (error) =>
      Effect.die(`API configuration error: ${error.message}`),
  }),
);

export const ServerBoundPort = Effect.gen(function* () {
  const config = yield* ApiConfig;

  return Option.getOrElse(config.port, () => 8080);
});
