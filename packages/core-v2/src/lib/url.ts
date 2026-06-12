import { Effect, Option } from "effect";

import { WebConfig } from "./config/web.js";
import { StringParts } from "./string.js";

export function buildServiceUrl(input: {
  readonly port: Option.Option<number>;
  readonly url: Option.Option<string>;
}) {
  return Option.match(input.url, {
    onSome: (url) => Option.some(url),
    onNone: () =>
      Option.match(input.port, {
        onSome: (port) => Option.some(`http://localhost:${port.toString()}`),
        onNone: () => Option.none(),
      }),
  });
}

export const buildUnsubscribeUrl = Effect.fn("Url.buildUnsubscribe")(function* (
  unsubscribeToken: string,
) {
  const config = yield* WebConfig;
  const url = Option.getOrUndefined(buildServiceUrl(config));

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
