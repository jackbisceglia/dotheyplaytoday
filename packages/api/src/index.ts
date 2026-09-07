import { Api } from "@dtpt/core/contracts/api";
import { WebUrl } from "@dtpt/core/lib/config/web";
import { Effect, Layer } from "effect";
import { HttpRouter } from "effect/unstable/http";
import { HttpApiBuilder } from "effect/unstable/httpapi";

import { authHandlers } from "./handlers/auth.js";
import { feedbackHandlers } from "./handlers/feedback.js";
import { pingHandlers } from "./handlers/ping.js";
import { subjectsHandlers } from "./handlers/subjects.js";
import { userBaseHandlers } from "./handlers/user.js";
import { userSubscriptionHandlers } from "./handlers/user.subscription.js";

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

const userHandlers = Layer.merge(userBaseHandlers, userSubscriptionHandlers);

export const HttpApiLayer = Layer.mergeAll(
  HttpApiBuilder.layer(Api).pipe(
    Layer.provide([
      userHandlers,
      authHandlers,
      pingHandlers,
      feedbackHandlers,
      subjectsHandlers,
    ]),
  ),
  CorsLayer,
);
