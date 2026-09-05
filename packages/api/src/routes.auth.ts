import { Effect } from "effect";
import {
  HttpRouter,
  HttpServerRequest,
  HttpServerResponse,
} from "effect/unstable/http";

import { Auth } from "./auth/auth.js";
import { AuthBasePath } from "./auth/config.js";

export const AuthRoutesLayer = HttpRouter.use(
  Effect.fn("Auth.routes")(function* (router) {
    const auth = yield* Auth;
    yield* router.add(
      "*",
      `${AuthBasePath}/*`,
      Effect.fn("BetterAuth.handler")(function* (request) {
        const webRequest = yield* HttpServerRequest.toWeb(request).pipe(
          Effect.orDie,
        );
        const response = yield* Effect.promise(() => auth.handler(webRequest));
        return HttpServerResponse.fromWeb(response);
      }),
    );
  }),
);
