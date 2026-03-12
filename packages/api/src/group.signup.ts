import type { HttpServerRequest } from "@effect/platform/HttpServerRequest";
import { HttpApiBuilder } from "@effect/platform";
import { Api } from "@dtpt/core/lib/contracts/api";
import { Effect, Option } from "effect";

import { SignupWriteRateLimiter } from "./rate-limiter.js";
import { submitSignupApi } from "./signup.js";

const getClientIdentity = (request: HttpServerRequest) =>
  Option.getOrElse(request.remoteAddress, () => "unknown");

export const SignupGroupLayer = HttpApiBuilder.group(
  Api,
  "signup",
  (handlers) =>
    handlers.handle(
      "submit",
      Effect.fn("SignupGroup.submit")(function* (input) {
        const rateLimiter = yield* SignupWriteRateLimiter;

        yield* rateLimiter.use(getClientIdentity(input.request));

        return yield* submitSignupApi(input.payload);
      }),
    ),
);
