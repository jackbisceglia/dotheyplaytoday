import { Config, Effect, pipe } from "effect";

import { buildUrl } from "../url.js";

export const ApiConfig = Config.all({
  port: Config.number("VITE_API_PORT").pipe(Config.withDefault(undefined)),
  url: Config.string("VITE_API_URL"),
});

export const ApiUrl = pipe(
  ApiConfig,
  Effect.orDie,
  Effect.map((config) => buildUrl(config.url, config.port)),
);

export const ServerBoundPort = pipe(
  ApiConfig,
  Effect.orDie,
  Effect.map((config) => config.port ?? 8080),
);
