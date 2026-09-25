import { Schema } from "effect";
import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from "effect/unstable/httpapi";

import { SubjectId } from "../modules/subjects/schema.js";
import { SubscriptionPolicy } from "../modules/subscriptions/policy.js";
import {
  FixedSchedule,
  SubscriptionWithSubject,
} from "../modules/subscriptions/schema.js";

export const SubscriptionsResponse = Schema.Array(SubscriptionWithSubject);

export const UpdateSubscriptionsRequest = Schema.Struct({
  subjectIds: Schema.NonEmptyArray(SubjectId).check(
    Schema.isMaxLength(SubscriptionPolicy.subject.constraints.max),
  ),
  schedule: FixedSchedule,
});

export const SubscriptionGroup = HttpApiGroup.make("subscription")
  .add(
    HttpApiEndpoint.get("list", "/", {
      success: SubscriptionsResponse,
      error: [HttpApiError.Unauthorized, HttpApiError.InternalServerError],
    }),
    HttpApiEndpoint.post("update", "/", {
      payload: UpdateSubscriptionsRequest,
      success: Schema.Struct({ ok: Schema.Literal(true) }),
      error: [
        HttpApiError.BadRequest,
        HttpApiError.Unauthorized,
        HttpApiError.InternalServerError,
      ],
    }),
  )
  .prefix("/subscription");
