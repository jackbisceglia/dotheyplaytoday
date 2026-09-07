import { Schema } from "effect";

import { SubjectId } from "../modules/subjects/schema.js";
import { FixedSchedule } from "../modules/subscriptions/schema.js";
import { EmailAddressFromString } from "../modules/users/schema.js";

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
