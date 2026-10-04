import { Effect, Layer } from "effect";
import * as Etag from "effect/unstable/http/Etag";
import * as HttpPlatform from "effect/unstable/http/HttpPlatform";

/** Platform services required by a fileless Effect HttpApi on Cloudflare. */
const HttpPlatformStub = Layer.succeed(HttpPlatform.HttpPlatform, {
  platform: "web",
  compression: {
    algorithms: new Set<HttpPlatform.CompressionAlgorithm>(),
    compressResponse: () => Effect.die("Compression is not configured"),
  },
  fileResponse: () => Effect.die("HttpPlatform.fileResponse not supported"),
  fileWebResponse: () =>
    Effect.die("HttpPlatform.fileWebResponse not supported"),
});

export const CloudflareHttpApiPlatformLayer = Layer.mergeAll(
  Etag.layer,
  HttpPlatformStub,
);
