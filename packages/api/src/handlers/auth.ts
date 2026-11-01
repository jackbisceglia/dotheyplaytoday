import { Api } from "@dtpt/core/contracts/api";
import { Effect, type Layer } from "effect";
import * as HttpServerRequest from "effect/unstable/http/HttpServerRequest";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";
import { HttpApiBuilder } from "effect/unstable/httpapi";

import { Auth } from "../auth/auth.js";

export const AuthGroupLayer = <R>(authLayer: Layer.Layer<Auth, never, R>) =>
  HttpApiBuilder.group(Api, "auth", (handlers) => {
    const handler = Effect.fn("BetterAuth.handler")(function* (input: {
      readonly request: HttpServerRequest.HttpServerRequest;
    }) {
      const auth = yield* Auth;
      const request = yield* HttpServerRequest.toWeb(input.request).pipe(
        Effect.orDie,
      );
      const response = yield* auth
        .use((client) => client.handler(request))
        .pipe(Effect.orDie);

      return HttpServerResponse.fromWeb(response);
    }, Effect.provide(authLayer));

    return handlers.handleRaw("get", handler).handleRaw("post", handler);
  });
