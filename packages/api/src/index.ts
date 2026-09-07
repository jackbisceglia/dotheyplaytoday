import { Api } from "@dtpt/core/contracts/api";
import { WebUrl } from "@dtpt/core/lib/config/web";
import { Effect, Layer } from "effect";
import { HttpRouter } from "effect/unstable/http";
import { HttpApiBuilder } from "effect/unstable/httpapi";

import { AuthGroupLayer } from "./routes.auth.js";
import { FeedbackGroupLayer } from "./routes.feedback.js";
import { PingGroupLayer } from "./routes.ping.js";
import { SubjectsGroupLayer } from "./routes.subjects.js";
import { UserBaseGroupLayer } from "./routes.user.js";
import { UserSubscriptionGroupLayer } from "./routes.user.subscription.js";

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

const UserGroupLayer = Layer.merge(
  UserBaseGroupLayer,
  UserSubscriptionGroupLayer,
);

export const HttpApiLayer = Layer.mergeAll(
  HttpApiBuilder.layer(Api).pipe(
    Layer.provide([
      UserGroupLayer,
      AuthGroupLayer,
      PingGroupLayer,
      FeedbackGroupLayer,
      SubjectsGroupLayer,
    ]),
  ),
  CorsLayer,
);
