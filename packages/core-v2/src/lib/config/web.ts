import { Config, Effect, Option } from "effect";

import { buildServiceUrl } from "../service-url.js";

export type WebConfig = Config.Success<typeof WebConfig>;
export const WebConfig = Config.all({
  port: Config.port("WEB_PORT").pipe(Config.option),
  url: Config.string("VITE_WEB_URL").pipe(Config.option),
});

export const WebUrl = Effect.gen(function* () {
  const config = yield* WebConfig;
  const url = buildServiceUrl(config);

  if (Option.isSome(url)) {
    return url.value;
  }

  return yield* Effect.die("WEB_PORT or VITE_WEB_URL is required");
});
