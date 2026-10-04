import { Schema } from "effect";

export class NotifierError extends Schema.TaggedError<NotifierError>()(
  "NotifierError",
  {
    layer: Schema.String,
    message: Schema.String,
    cause: Schema.optional(Schema.Defect()),
  },
) {}
