import { Api } from "@dtpt/core/contracts/api";
import { WebUrl } from "@dtpt/core/lib/config/web";
import { Effect, Layer } from "effect";
import { HttpRouter } from "effect/unstable/http";
import { HttpApiBuilder } from "effect/unstable/httpapi";

import { AuthRoutesLayer } from "./routes.auth.js";
import { FeedbackGroupLayer } from "./routes.feedback.js";
import { PingGroupLayer } from "./routes.ping.js";
import { SignupGroupLayer } from "./routes.signup.js";
import { SubjectsGroupLayer } from "./routes.subjects.js";
import { UnsubscribeGroupLayer } from "./routes.unsubscribe.js";

const CorsLayer = Layer.unwrap(
  Effect.gen(function* () {
    const origin = yield* WebUrl;

    return HttpRouter.cors({
      allowedOrigins: [origin],
      allowedMethods: ["GET", "POST", "OPTIONS"],
      credentials: true,
    });
  }),
);

export const HttpApiLayer = Layer.mergeAll(
  HttpApiBuilder.layer(Api).pipe(
    Layer.provide([
      PingGroupLayer,
      FeedbackGroupLayer,
      SignupGroupLayer,
      SubjectsGroupLayer,
      UnsubscribeGroupLayer,
    ]),
  ),
  AuthRoutesLayer,
  CorsLayer,
);
