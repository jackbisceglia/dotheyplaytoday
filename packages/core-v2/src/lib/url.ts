import { Effect, Option } from "effect";

import { WebConfig } from "./config/web.js";
import { StringParts } from "./string.js";

export function buildServiceUrl(url: string | undefined, port: number | undefined) {
  if (url !== undefined) {
    return url;
  }

  if (port !== undefined) {
    return `http://localhost:${port.toString()}`;
  }

  return undefined;
}

export const buildUnsubscribeUrl = Effect.fn("Url.buildUnsubscribe")(function* (
  unsubscribeToken: string,
) {
  const config = yield* WebConfig;
  const url = buildServiceUrl(
    Option.getOrUndefined(config.url),
    Option.getOrUndefined(config.port),
  );

  if (url === undefined) {
    return yield* Effect.die("WEB_PORT or VITE_WEB_URL is required");
  }

  const normalizedUrl = url.replace(/\/+$/, "");
  const encodedToken = encodeURIComponent(unsubscribeToken);

  return StringParts()
    .add(normalizedUrl)
    .add("unsubscribe")
    .add(encodedToken)
    .make("/");
});
