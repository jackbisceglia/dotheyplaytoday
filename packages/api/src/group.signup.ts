import type { HttpServerRequest } from "@effect/platform/HttpServerRequest";
import { HttpApiBuilder, HttpApiError } from "@effect/platform";
import { Api } from "@dtpt/core/lib/contracts/api";
import {
  SignupResponse,
  type SignupRequest,
} from "@dtpt/core/lib/contracts/signup";
import {} from "@dtpt/core/modules/database-new/service";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { Users } from "@dtpt/core/modules/users/service";
import { Array, Effect, Option } from "effect";

import { SignupWriteRateLimiter } from "./rate-limiter.js";

const getClientIdentity = (request: HttpServerRequest) =>
  Option.getOrElse(request.remoteAddress, () => "unknown");

const signup = (payload: SignupRequest) =>
  Effect.gen(function* () {
    const users = yield* Users;
    const subscriptions = yield* Subscriptions;

    const existingUser = yield* users.getByEmail(payload.email);
    const topicIds = yield* subscriptions.validateTopicIds(payload.topicIds);
    const user = yield* users.upsert({
      email: payload.email,
      timezone: payload.timezone,
    });
    const nextSubscriptions = yield* subscriptions.replaceForUser({
      userId: user.id,
      topicIds,
      schedule: {
        type: "fixed",
        sendAtSecondsLocal: payload.sendAtSecondsLocal,
      },
    });
    const nextTopicIds = nextSubscriptions.map(
      (subscription) => subscription.topicId,
    );

    if (!Array.isNonEmptyReadonlyArray(nextTopicIds)) {
      return yield* Effect.fail(new HttpApiError.InternalServerError());
    }

    return SignupResponse.make({
      status: Option.isSome(existingUser) ? "updated" : "created",
      email: user.email,
      timezone: user.timezone,
      schedule: {
        type: "fixed",
        sendAtSecondsLocal: payload.sendAtSecondsLocal,
      },
      topicIds: nextTopicIds,
    });
  }).pipe(
    Effect.catchTags({
      DataReadError: () => Effect.fail(new HttpApiError.InternalServerError()),
      DataValidationError: () =>
        Effect.fail(new HttpApiError.InternalServerError()),
      DataWriteError: () => Effect.fail(new HttpApiError.InternalServerError()),
    }),
  );

export const SignupGroupLayer = HttpApiBuilder.group(
  Api,
  "signup",
  (handlers) =>
    handlers.handle(
      "submit",
      Effect.fn("SignupGroup.submit")(function* (input) {
        const rateLimiter = yield* SignupWriteRateLimiter;

        yield* rateLimiter.use(getClientIdentity(input.request));

        return yield* signup(input.payload);
      }),
    ),
);
