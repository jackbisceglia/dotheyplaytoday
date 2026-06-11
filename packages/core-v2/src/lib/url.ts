import { Effect, Option } from "effect";

import { WebConfig } from "./config/web.js";
import { StringParts } from "./string.js";

export const WebUrl = Effect.gen(function* () {
  const config = yield* WebConfig;

  return Option.getOrElse(
    config.url,
    () => `http://localhost:${config.port.toString()}`,
  );
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
