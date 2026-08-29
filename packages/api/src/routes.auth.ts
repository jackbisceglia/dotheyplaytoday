import { Api } from "@dtpt/core/contracts/api";
import { Effect } from "effect";
import * as HttpServerRequest from "effect/unstable/http/HttpServerRequest";
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse";
import { HttpApiBuilder } from "effect/unstable/httpapi";

import { Auth } from "./auth/auth.js";

export const AuthGroupLayer = HttpApiBuilder.group(Api, "auth", (handlers) =>
  Effect.gen(function* () {
    const makeAuth = yield* Auth.pipe(Effect.orDie);

    const handler = Effect.fn("BetterAuth.handler")(function* (input: {
      readonly request: HttpServerRequest.HttpServerRequest;
    }) {
      const context = yield* Effect.context();
      const request = yield* HttpServerRequest.toWeb(input.request).pipe(
        Effect.orDie,
      );
      const response = yield* Effect.tryPromise(() =>
        makeAuth(context).handler(request),
      ).pipe(Effect.orDie);

      return HttpServerResponse.fromWeb(response);
    });

    return handlers.handleRaw("get", handler).handleRaw("post", handler);
  }),
);
