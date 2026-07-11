import { Config, Effect, Option } from "effect";

import { buildServiceUrl } from "../url.js";
import { unwrapAlchemyRedactedValue } from "./value.js";

export type WebConfig = Config.Success<typeof WebConfig>;
export const WebConfig = Config.all({
  baseUrl: Config.string("PUBLIC_WEB_URL_BASE").pipe(
    Config.map(unwrapAlchemyRedactedValue),
  ),
  port: Config.string("PUBLIC_WEB_URL_PORT").pipe(
    Config.map(unwrapAlchemyRedactedValue),
    Config.map(Number),
    Config.option,
  ),
});

export const WebUrl = Effect.gen(function* () {
  const config = yield* WebConfig;

  if (
    Option.isSome(config.port) &&
    (!Number.isInteger(config.port.value) ||
      config.port.value < 1 ||
      config.port.value > 65_535)
  ) {
    return yield* Effect.die("Web configuration error: invalid port");
  }

  return buildServiceUrl(config.baseUrl, config.port);
}).pipe(
  Effect.catchTags({
    ConfigError: (error) =>
      Effect.die(`Web configuration error: ${error.message}`),
  }),
);
