import { Config, Effect, pipe } from "effect";

import { buildUrl } from "../url.js";

export const WebConfig = Config.all({
  port: Config.number("VITE_WEB_PORT").pipe(Config.withDefault(3000)),
  url: Config.string("VITE_WEB_URL").pipe(
    Config.withDefault("http://localhost"),
  ),
});

export const WebUrl = pipe(
  WebConfig,
  Effect.orDie,
  Effect.map((config) => buildUrl(config.url, config.port)),
);
