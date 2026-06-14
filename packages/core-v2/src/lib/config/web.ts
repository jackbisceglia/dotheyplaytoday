import { Config, Effect } from "effect";

import { buildServiceUrl } from "../url.js";

export type WebConfig = Config.Success<typeof WebConfig>;
export const WebConfig = Config.all({
  port: Config.port("VITE_WEB_PORT").pipe(Config.option),
  url: Config.string("VITE_WEB_URL").pipe(Config.option),
});

export const WebUrl = Effect.gen(function* () {
  const config = yield* WebConfig;

  return yield* buildServiceUrl(config.url, config.port);
}).pipe(
  Effect.catchTags({
    ConfigError: () => Effect.die("Unknown web configuration error occurred"),
    NoSuchElementError: () =>
      Effect.die("VITE_WEB_PORT or VITE_WEB_URL is required"),
  }),
);
