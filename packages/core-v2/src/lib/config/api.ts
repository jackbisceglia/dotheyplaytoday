import { Config, Effect } from "effect";

import { buildServiceUrl } from "../service-url.js";

export type ApiConfig = Config.Success<typeof ApiConfig>;
export const ApiConfig = Config.all({
  port: Config.port("API_PORT").pipe(Config.option),
  url: Config.string("VITE_API_URL").pipe(Config.option),
});

export const ApiUrl = Effect.gen(function* () {
  const config = yield* ApiConfig;

  return yield* buildServiceUrl(config.url, config.port);
}).pipe(
  Effect.catchTag(["NoSuchElementError", "ConfigError"], () =>
    Effect.die("API_PORT or VITE_API_URL is required"),
  ),
);

export const ServerBoundPort = Effect.gen(function* () {
  return yield* Config.port("API_PORT");
});
