import { Effect, Layer } from "effect";
import * as Etag from "effect/unstable/http/Etag";
import * as HttpPlatform from "effect/unstable/http/HttpPlatform";

/** Platform services required by a fileless Effect HttpApi on Cloudflare. */
export const makeCloudflareHttpApiPlatformLayer = () => {
  const HttpPlatformStub = Layer.succeed(HttpPlatform.HttpPlatform, {
    fileResponse: () => Effect.die("HttpPlatform.fileResponse not supported"),
    fileWebResponse: () =>
      Effect.die("HttpPlatform.fileWebResponse not supported"),
  });

  return Layer.mergeAll(Etag.layer, HttpPlatformStub);
};
