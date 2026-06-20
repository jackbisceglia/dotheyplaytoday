import { Effect } from "effect";

import { WebUrl } from "./config/web.js";
import { StringParts } from "./string.js";

export const buildUnsubscribeUrl = Effect.fn("Url.buildUnsubscribe")(function* (
  token: string,
) {
  const url = yield* WebUrl;

  const normalizedUrl = url.replace(/\/+$/, "");
  const encodedToken = encodeURIComponent(token);

  return StringParts()
    .add(normalizedUrl)
    .add("unsubscribe")
    .add(encodedToken)
    .make("/");
});
