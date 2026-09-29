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

export const SubjectSelection = Schema.NonEmptyArray(SubjectId).check(
  Schema.isMaxLength(SubscriptionPolicy.subject.constraints.max),
);

export const UpdateSubscriptionsRequest = Schema.Struct({
  subjectIds: SubjectSelection,
  schedule: FixedSchedule,
});

export const UpdateSubscriptionsResponse = Schema.Struct({
  ok: Schema.Literal(true),
});

export const SubscriptionGroup = HttpApiGroup.make("subscription")
  .add(
    HttpApiEndpoint.get("list", "/", {
      success: SubscriptionsResponse,
      error: [HttpApiError.Unauthorized, HttpApiError.InternalServerError],
    }),
    HttpApiEndpoint.post("update", "/", {
      payload: UpdateSubscriptionsRequest,
      success: UpdateSubscriptionsResponse,
      error: [
        HttpApiError.BadRequest,
        HttpApiError.Unauthorized,
        HttpApiError.InternalServerError,
      ],
    }),
  )
  .prefix("/subscription");
