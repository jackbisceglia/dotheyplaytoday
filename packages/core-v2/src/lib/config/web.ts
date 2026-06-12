import { Config, Effect, Option } from "effect";

import { buildServiceUrl } from "../url.js";

export type WebConfig = Config.Success<typeof WebConfig>;
export const WebConfig = Config.all({
  port: Config.port("WEB_PORT").pipe(Config.option),
  url: Config.string("VITE_WEB_URL").pipe(Config.option),
});

export const WebUrl = Effect.gen(function* () {
  const config = yield* WebConfig;
  const url = buildServiceUrl(
    Option.getOrUndefined(config.url),
    Option.getOrUndefined(config.port),
  );

  if (url !== undefined) {
    return url;
  }

  return yield* Effect.die("WEB_PORT or VITE_WEB_URL is required");
});
