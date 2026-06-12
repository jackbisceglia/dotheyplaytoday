import { Effect, Match, Option } from "effect";

import { WebConfig } from "./config/web.js";
import { StringParts } from "./string.js";

const toLocalHost = (port: number) => `http://localhost:${port.toString()}`;

export const buildServiceUrl = (
  url: Option.Option<string>,
  port: Option.Option<number>,
) =>
  Match.value({ url, port }).pipe(
    Match.when({ url: Option.isSome }, function (config) {
      return config.url;
    }),
    Match.when({ port: Option.isSome }, function (config) {
      return Option.map(config.port, toLocalHost);
    }),
    Match.orElse(() => Option.none()),
  );

export const WebUrl = Effect.gen(function* () {
  const config = yield* WebConfig;

  return yield* buildServiceUrl(config.url, config.port);
}).pipe(
  Effect.catchTag("NoSuchElementError", () =>
    Effect.die("WEB_PORT or VITE_WEB_URL is required"),
  ),
);

export const buildUnsubscribeUrl = Effect.fn("Url.buildUnsubscribe")(function* (
  unsubscribeToken: string,
) {
  const url = yield* WebUrl;

  const normalizedUrl = url.replace(/\/+$/, "");
  const encodedToken = encodeURIComponent(unsubscribeToken);

  return StringParts()
    .add(normalizedUrl)
    .add("unsubscribe")
    .add(encodedToken)
    .make("/");
});
