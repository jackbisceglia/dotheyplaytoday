import { Config, Effect, Option } from "effect";

export type ApiConfig = Config.Success<typeof ApiConfig>;
export const ApiConfig = Config.all({
  port: Config.port("API_PORT"),
  url: Config.string("VITE_API_URL").pipe(Config.option),
});

export const ApiUrl = Effect.gen(function* () {
  const config = yield* ApiConfig;

  return Option.getOrElse(
    config.url,
    () => `http://localhost:${config.port.toString()}`,
  );
});

export const ServerBoundPort = Effect.gen(function* () {
  const config = yield* ApiConfig;

  return config.port;
});
