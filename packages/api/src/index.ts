import { HttpApiBuilder, HttpMiddleware, HttpServer } from "@effect/platform";
import { NodeHttpServer } from "@effect/platform-node";
import { ApiUrl, ServerBoundPort } from "@dtpt/core/lib/config/api";
import { WebUrl } from "@dtpt/core/lib/config/web";
import { Api } from "@dtpt/core/lib/contracts/api";
import { Effect, Layer, pipe } from "effect";
import { createServer } from "node:http";

import { PingGroupLayer } from "./group.ping.js";
import { SignupGroupLayer } from "./group.signup.js";
import { ApiRuntime, KvsSelection } from "./platform.js";

const ApiLayer = Api.pipe(
  HttpApiBuilder.api,
  Layer.provide(Layer.mergeAll(PingGroupLayer, SignupGroupLayer)),
);

const NodeHttpLayer = pipe(
  ServerBoundPort,
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

const HttpServerLayer = HttpApiBuilder.serve(HttpMiddleware.xForwardedHeaders);

const Program = HttpServerLayer.pipe(
  Layer.provide(ApiLayer),
  Layer.provide(CorsMiddlewareLayer),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpLayer),
  Layer.launch,
);

export const Main = Effect.gen(function* () {
  const apiUrl = yield* ApiUrl;
  const webUrl = yield* WebUrl;
  const kvs = yield* KvsSelection;

  yield* Effect.logInfo(
    `api: boot url=${apiUrl} corsOrigin=${webUrl} kvs=${kvs}`,
  );
  return yield* Program;
});

if (import.meta.main) {
  await ApiRuntime.runPromise(Main).finally(() => ApiRuntime.dispose());
}
