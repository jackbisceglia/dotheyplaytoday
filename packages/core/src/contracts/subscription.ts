import { Schema } from "effect";
import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from "effect/unstable/httpapi";

import { SubscriptionWithSubject } from "../modules/subscriptions/schema.js";

export const SubscriptionsResponse = Schema.Array(SubscriptionWithSubject);

export const SubscriptionGroup = HttpApiGroup.make("subscription")
  .add(
    HttpApiEndpoint.get("list", "/", {
      success: SubscriptionsResponse,
      error: [HttpApiError.Unauthorized, HttpApiError.InternalServerError],
    }),
  )
  .prefix("/subscription");
