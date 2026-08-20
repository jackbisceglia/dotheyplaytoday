import { Schema } from "effect";
import * as SchemaTransformation from "effect/SchemaTransformation";
import {
  HttpApiEndpoint,
  HttpApiError,
  HttpApiGroup,
  HttpApiSchema,
} from "effect/unstable/httpapi";

import {
  FeedbackRequestText,
  FeedbackType,
} from "../modules/feedback/schema.js";

const FeedbackRequestTextFromString = Schema.String.pipe(
  Schema.decode(SchemaTransformation.trim()),
  Schema.decodeTo(FeedbackRequestText),
);

export const FeedbackRequest = Schema.Struct({
  type: FeedbackType,
  request: FeedbackRequestTextFromString,
});

export class FeedbackRateLimited extends Schema.TaggedErrorClass<FeedbackRateLimited>()(
  "FeedbackRateLimited",
  {},
  { httpApiStatus: 429 },
) {}

export const FeedbackGroup = HttpApiGroup.make("feedback").add(
  HttpApiEndpoint.post("submit", "/feedback", {
    payload: FeedbackRequest,
    success: HttpApiSchema.NoContent,
    error: [HttpApiError.InternalServerError, FeedbackRateLimited],
  }),
);
