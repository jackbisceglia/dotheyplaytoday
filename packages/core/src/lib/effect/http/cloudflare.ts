import { Effect, Layer } from "effect";
import * as Etag from "effect/unstable/http/Etag";
import * as HttpPlatform from "effect/unstable/http/HttpPlatform";

/** Platform services required by a fileless Effect HttpApi on Cloudflare. */
const HttpPlatformStub = Layer.succeed(HttpPlatform.HttpPlatform, {
  fileResponse: () => Effect.die("HttpPlatform.fileResponse not supported"),
  fileWebResponse: () =>
    Effect.die("HttpPlatform.fileWebResponse not supported"),
});

export const CloudflareHttpApiPlatformLayer = Layer.mergeAll(
  Etag.layer,
  HttpPlatformStub,
);
