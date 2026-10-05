import { Schema, Struct } from "effect";
import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from "effect/unstable/httpapi";

import { FixedSchedule } from "../modules/subscriptions/schema.js";
import { plans } from "../modules/billing/policy.js";
import {
  EmailAddressFromString,
  UnsubscribeToken,
  User,
} from "../modules/users/schema.js";

import { EventsGroup } from "./events.js";
import { SubjectSelection, SubscriptionGroup } from "./subscription.js";

export const UserResponse = User.mapFields(Struct.pick(["email", "timezone"]));

export const SignupRequest = Schema.Struct({
  email: EmailAddressFromString,
  timezone: Schema.TimeZoneNamedFromString,
  schedule: FixedSchedule,
  subjectIds: SubjectSelection.check(Schema.isMaxLength(plans.free.teamLimit)),
});

export const SignupResponse = Schema.Struct({
  ok: Schema.Literal(true),
});

export class DuplicateSignup extends Schema.TaggedError<DuplicateSignup>()(
  "DuplicateSignup",
  {},
  { httpApiStatus: 409 },
) {}

export class SignupRateLimited extends Schema.TaggedError<SignupRateLimited>()(
  "SignupRateLimited",
  {},
  { httpApiStatus: 429 },
) {}

export const UnsubscribeRequest = Schema.Struct({
  token: Schema.optional(UnsubscribeToken),
});

export const UnsubscribeResponse = Schema.Struct({ ok: Schema.Literal(true) });

export class UnsubscribeRateLimited extends Schema.TaggedError<UnsubscribeRateLimited>()(
  "UnsubscribeRateLimited",
  {},
  { httpApiStatus: 429 },
) {}

export const UserApi = HttpApi.make("user")
  .add(
    HttpApiGroup.make("user").add(
      HttpApiEndpoint.get("get", "/", {
        success: UserResponse,
        error: [HttpApiError.Unauthorized, HttpApiError.InternalServerError],
      }),
      HttpApiEndpoint.post("create", "/", {
        payload: SignupRequest,
        success: SignupResponse,
        error: [
          HttpApiError.BadRequest,
          HttpApiError.InternalServerError,
          SignupRateLimited,
          DuplicateSignup,
        ],
      }),
      HttpApiEndpoint.post("unsubscribe", "/unsubscribe", {
        payload: UnsubscribeRequest,
        success: UnsubscribeResponse,
        error: [
          HttpApiError.Unauthorized,
          HttpApiError.InternalServerError,
          UnsubscribeRateLimited,
        ],
      }),
    ),
  )
  .add(SubscriptionGroup)
  .add(EventsGroup)
  .prefix("/user");
