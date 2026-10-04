import { Api } from "@dtpt/core/contracts/api";
import { WebEsportsUrl, WebUrl } from "@dtpt/core/lib/config/web";
import { Effect, Layer } from "effect";
import { HttpRouter } from "effect/unstable/http";
import { HttpApiBuilder } from "effect/unstable/httpapi";

import { EventsGroupLayer } from "./handlers/events.js";
import { AuthGroupLayer } from "./handlers/auth.js";
import { FeedbackGroupLayer } from "./handlers/feedback.js";
import { PingGroupLayer } from "./handlers/ping.js";
import { SubjectsGroupLayer } from "./handlers/subjects.js";
import { UserGroupLayer } from "./handlers/user.js";
import { SubscriptionGroupLayer } from "./handlers/subscription.js";

const CorsLayer = Layer.unwrap(
  Effect.gen(function* () {
    const origins = [yield* WebUrl, yield* WebEsportsUrl];

    return HttpRouter.cors({
      allowedOrigins: origins,
      allowedMethods: ["GET", "POST", "OPTIONS"],
      credentials: true,
    });
  }),
);

export const HttpApiLayer = Layer.mergeAll(
  HttpApiBuilder.layer(Api).pipe(
    Layer.provide([
      UserGroupLayer,
      EventsGroupLayer,
      SubscriptionGroupLayer,
      AuthGroupLayer,
      PingGroupLayer,
      FeedbackGroupLayer,
      SubjectsGroupLayer,
    ]),
  ),
  CorsLayer,
);
