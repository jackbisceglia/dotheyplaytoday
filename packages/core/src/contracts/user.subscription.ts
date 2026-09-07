import { Schema } from "effect";
import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from "effect/unstable/httpapi";

import { SubscriptionWithSubject } from "../modules/subscriptions/schema.js";

export const UserSubscriptionsResponse = Schema.Array(SubscriptionWithSubject);

export const UserSubscriptionGroup = HttpApiGroup.make("userSubscription")
  .add(
    HttpApiEndpoint.get("list", "/", {
      success: UserSubscriptionsResponse,
      error: [HttpApiError.Unauthorized, HttpApiError.InternalServerError],
    }),
  )
  .prefix("/user/subscription");
