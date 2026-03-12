import { HttpApiError } from "@effect/platform";
import {
  SignupResponse,
  SignupTopicLimitExceeded,
  SignupTopicNotFound,
  type SignupRequest,
} from "@dtpt/core/lib/contracts/signup";
import { Subscriptions } from "@dtpt/core/modules/subscriptions/service";
import { Users } from "@dtpt/core/modules/users/service";
import { Array, Effect, Option } from "effect";

export const submitSignupApi = Effect.fn("api.submitSignup")(
  function* (payload: SignupRequest) {
    const users = yield* Users;
    const subscriptions = yield* Subscriptions;

    const existingUser = yield* users.getByEmail(payload.email);
    const user = yield* users.upsert({
      email: payload.email,
      timezone: payload.timezone,
    });
    const nextSubscriptions = yield* subscriptions.replaceForUser({
      userId: user.id,
      topicIds: payload.topicIds,
      schedule: {
        type: "fixed",
        sendAtSecondsLocal: payload.sendAtSecondsLocal,
      },
    });
    const topicIds = nextSubscriptions.map(
      (subscription) => subscription.topicId,
    );

    if (!Array.isNonEmptyArray(topicIds)) {
      return yield* new HttpApiError.InternalServerError();
    }

    return SignupResponse.make({
      status: Option.isSome(existingUser) ? "updated" : "created",
      email: user.email,
      timezone: user.timezone,
      schedule: {
        type: "fixed",
        sendAtSecondsLocal: payload.sendAtSecondsLocal,
      },
      topicIds,
    });
  },
  Effect.catchTags({
    SubscriptionTopicLimitExceeded: ({ count, limit }) =>
      SignupTopicLimitExceeded.make({ count, limit }),
    SubscriptionTopicNotFound: ({ topicId }) =>
      SignupTopicNotFound.make({ topicId }),
  }),
  Effect.mapError(() => new HttpApiError.InternalServerError()),
);
