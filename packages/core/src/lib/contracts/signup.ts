import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
  HttpApiSchema,
} from "@effect/platform";
import { Schema } from "effect";

import { FixedSchedule } from "../../modules/subscriptions/schema.js";
import { Topic } from "../../modules/topics/schema.js";
import { EmailAddress, User } from "../../modules/users/schema.js";

export class SignupTopicLimitExceeded extends Schema.TaggedError<SignupTopicLimitExceeded>()(
  "SignupTopicLimitExceeded",
  {
    limit: Schema.Int,
    count: Schema.Int,
  },
  HttpApiSchema.annotations({ status: 400 }),
) {}

export class SignupTopicNotFound extends Schema.TaggedError<SignupTopicNotFound>()(
  "SignupTopicNotFound",
  {
    topicId: Schema.String,
  },
  HttpApiSchema.annotations({ status: 400 }),
) {}

export class SignupRateLimited extends Schema.TaggedError<SignupRateLimited>()(
  "SignupRateLimited",
  {
    message: Schema.String,
  },
  HttpApiSchema.annotations({ status: 429 }),
) {}

export type SignupRequest = typeof SignupRequest.Type;
export const SignupRequest = Schema.Struct({
  email: EmailAddress,
  timezone: User.fields.timezone,
  sendAtSecondsLocal: FixedSchedule.fields.sendAtSecondsLocal,
  topicIds: Schema.NonEmptyArray(Topic.fields.id),
});

export type SignupResponse = typeof SignupResponse.Type;
export const SignupResponse = Schema.Struct({
  status: Schema.Literal("created", "updated"),
  email: EmailAddress,
  timezone: User.fields.timezone,
  schedule: FixedSchedule,
  topicIds: Schema.NonEmptyArray(Topic.fields.id),
});

export const SignupGroup = HttpApiGroup.make("signup").add(
  HttpApiEndpoint.post("submit")`/signup`
    .setPayload(SignupRequest)
    .addSuccess(SignupResponse)
    .addError(HttpApiError.BadRequest)
    .addError(SignupTopicLimitExceeded)
    .addError(SignupTopicNotFound)
    .addError(SignupRateLimited),
);
