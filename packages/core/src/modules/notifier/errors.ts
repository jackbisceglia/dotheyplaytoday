import { Schema } from "effect";

export class NotifierError extends Schema.TaggedErrorClass<NotifierError>()(
  "NotifierError",
  {
    layer: Schema.String,
    message: Schema.String,
    cause: Schema.optional(Schema.Defect()),
  },
) {}
