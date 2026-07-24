import * as Output from "alchemy/Output";
import { CurrentRuntimeContext } from "alchemy/RuntimeContext";
import { Stack } from "alchemy";
import { Config, Effect } from "effect";

import { getServiceDomain, url } from "../alchemy/domain.js";
import { isDevStage } from "../alchemy/stage.js";
import { buildServiceUrl } from "../url.js";

const WebBaseUrlKey = "PUBLIC_WEB_URL_BASE";
const WebPort = Config.port("PUBLIC_WEB_URL_PORT").pipe(Config.option);

export type WebConfig = Config.Success<typeof WebConfig>;
export const WebConfig = Config.all({
  baseUrl: Config.string(WebBaseUrlKey),
  port: WebPort,
});

export const WebConfigAlchemy = Effect.gen(function* () {
  const stack = yield* Stack;
  const runtimeContext = yield* CurrentRuntimeContext;
  const baseUrl = isDevStage(stack.stage)
    ? url("localhost", "http")
    : url(getServiceDomain("web", stack.stage));

  if (runtimeContext === undefined) {
    return yield* Effect.die(
      "WebConfigAlchemy must be resolved during Alchemy worker initialization",
    );
  }

  yield* runtimeContext.set(WebBaseUrlKey, Output.literal(baseUrl));

  return {
    baseUrl,
    port: yield* WebPort,
  } satisfies WebConfig;
});

export const WebUrl = Effect.gen(function* () {
  const config = yield* WebConfig;

  return buildServiceUrl(config.baseUrl, config.port);
}).pipe(
  Effect.catchTags({
    ConfigError: (error) =>
      Effect.die(`Web configuration error: ${error.message}`),
  }),
);
