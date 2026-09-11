import { Schema, Struct } from "effect";
import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
} from "effect/unstable/httpapi";

import { SubjectId } from "../modules/subjects/schema.js";
import { FixedSchedule } from "../modules/subscriptions/schema.js";
import {
  EmailAddressFromString,
  UnsubscribeToken,
  User,
} from "../modules/users/schema.js";

import { SubscriptionGroup } from "./subscription.js";

export const UserResponse = User.mapFields(Struct.pick(["email", "timezone"]));

export const SignupRequest = Schema.Struct({
  email: EmailAddressFromString,
  timezone: Schema.TimeZoneNamedFromString,
  schedule: FixedSchedule,
  subjectIds: Schema.NonEmptyArray(SubjectId),
});

export const SignupResponse = Schema.Struct({
  ok: Schema.Literal(true),
});

export class DuplicateSignup extends Schema.TaggedErrorClass<DuplicateSignup>()(
  "DuplicateSignup",
  {},
  { httpApiStatus: 409 },
) {}

export class SignupRateLimited extends Schema.TaggedErrorClass<SignupRateLimited>()(
  "SignupRateLimited",
  {},
  { httpApiStatus: 429 },
) {}

export const UnsubscribeRequest = Schema.Struct({
  token: Schema.optional(UnsubscribeToken),
});

export const UnsubscribeResponse = Schema.Struct({ ok: Schema.Literal(true) });

export class UnsubscribeRateLimited extends Schema.TaggedErrorClass<UnsubscribeRateLimited>()(
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
  .prefix("/user");
