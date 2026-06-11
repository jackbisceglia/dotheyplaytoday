import { Effect, Option } from "effect";

import { WebConfig } from "./config/web.js";
import { StringParts } from "./string.js";

export const WebUrl = Effect.gen(function* () {
  const config = yield* WebConfig;
  const url = Option.getOrUndefined(config.url);
  const port = Option.getOrUndefined(config.port);

  if (url !== undefined) {
    return url;
  }

  if (port !== undefined) {
    return `http://localhost:${port.toString()}`;
  }

  return yield* Effect.die("WEB_PORT or VITE_WEB_URL is required");
});

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
