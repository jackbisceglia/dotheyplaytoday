import { Schema, Struct } from "effect";
import {
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

export class SignupRateLimited extends Schema.TaggedErrorClass<SignupRateLimited>()(
  "SignupRateLimited",
  {},
  { httpApiStatus: 429 },
) {}

export const UnsubscribeRequest = Schema.Struct({ token: UnsubscribeToken });

export const UnsubscribeResponse = Schema.Struct({ ok: Schema.Literal(true) });

export class UnsubscribeRateLimited extends Schema.TaggedErrorClass<UnsubscribeRateLimited>()(
  "UnsubscribeRateLimited",
  {},
  { httpApiStatus: 429 },
) {}

export const UserGroup = HttpApiGroup.make("user")
  .add(
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
      ],
    }),
    HttpApiEndpoint.post("unsubscribe", "/unsubscribe", {
      payload: UnsubscribeRequest,
      success: UnsubscribeResponse,
      error: [HttpApiError.InternalServerError, UnsubscribeRateLimited],
    }),
  )
  .prefix("/user");
