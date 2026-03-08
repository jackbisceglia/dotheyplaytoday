import { HttpApiBuilder, HttpServer } from "@effect/platform";
import { NodeHttpServer } from "@effect/platform-node";
import { ApiUrl, DefaultServerPort } from "@dtpt/core/lib/config/api";
import { WebUrl } from "@dtpt/core/lib/config/web";
import { Api } from "@dtpt/core/lib/contracts/api";
import { Effect, Layer, pipe } from "effect";
import { createServer } from "node:http";

import { PingGroupLayer } from "./routes.ping.js";
import { RuntimeServer } from "./platform.js";

const ApiLayer = HttpApiBuilder.api(Api).pipe(Layer.provide(PingGroupLayer));

const NodeHttpLayer = pipe(
  DefaultServerPort,
  Effect.map((port) => NodeHttpServer.layer(createServer, { port })),
  Layer.unwrapEffect,
);

const CorsMiddlewareLayer = pipe(
  WebUrl,
  Effect.map((webUrl) =>
    HttpApiBuilder.middlewareCors({
      allowedOrigins: [webUrl],
      allowedMethods: ["GET", "POST"],
      credentials: false,
    }),
  ),
  Layer.unwrapEffect,
);

const Program = HttpApiBuilder.serve().pipe(
  Layer.provide(ApiLayer),
  Layer.provide(CorsMiddlewareLayer),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpLayer),
  Layer.launch,
);

export const Main = Effect.gen(function* () {
  const apiUrl = yield* ApiUrl;
  const webUrl = yield* WebUrl;

  yield* Effect.logInfo(`api: boot url=${apiUrl} corsOrigin=${webUrl}`);
  return yield* Program;
});

if (import.meta.main) {
  await RuntimeServer.runPromise(Main).finally(() => RuntimeServer.dispose());
}
