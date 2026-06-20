import * as NodeHttpServer from "@effect/platform-node/NodeHttpServer";
import { Api, ApiUrl, ServerBoundPort, WebUrl } from "@dtpt/core";
import { Effect, Layer } from "effect";
import { HttpRouter } from "effect/unstable/http";
import { HttpApiBuilder } from "effect/unstable/httpapi";
import { createServer } from "node:http";

import { ApiRuntime } from "./runtime.js";
import { PingGroupLayer } from "./routes.ping.js";
import { SignupGroupLayer } from "./routes.signup.js";
import { SubjectsGroupLayer } from "./routes.subjects.js";
import { UnsubscribeGroupLayer } from "./routes.unsubscribe.js";

const HttpApiLayer = HttpApiBuilder.layer(Api).pipe(
  Layer.provide([
    PingGroupLayer,
    SignupGroupLayer,
    SubjectsGroupLayer,
    UnsubscribeGroupLayer,
  ]),
);

const CorsLayer = Layer.unwrap(
  Effect.gen(function* () {
    const webUrl = yield* WebUrl;

    return HttpRouter.cors({
      allowedOrigins: [webUrl],
      allowedMethods: ["GET", "POST"],
      credentials: false,
    });
  }),
);

const NodeHttpLayer = Layer.unwrap(
  Effect.gen(function* () {
    const port = yield* ServerBoundPort;

    return NodeHttpServer.layer(() => createServer(), { port });
  }),
);

const ServerLayer = HttpRouter.serve(
  Layer.mergeAll(HttpApiLayer, CorsLayer),
).pipe(Layer.provide(NodeHttpLayer));

export const Main = Effect.gen(function* () {
  const apiUrl = yield* ApiUrl;
  const webUrl = yield* WebUrl;

  yield* Effect.logInfo(`api: boot url=${apiUrl} corsOrigin=${webUrl}`);

  return yield* Layer.launch(ServerLayer);
});

export async function main() {
  await ApiRuntime.runPromise(Main).finally(() => ApiRuntime.dispose());
}

if (import.meta.main) {
  await main();
}
