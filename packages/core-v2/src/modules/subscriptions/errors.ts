import { Schema } from "effect";

import { SubjectId } from "../subjects/schema.js";

export class InvalidSubjectSelection extends Schema.TaggedErrorClass<InvalidSubjectSelection>()(
  "InvalidSubjectSelection",
  { invalidIds: Schema.Array(SubjectId) },
) {}

export class SubjectCapacityReached extends Schema.TaggedErrorClass<SubjectCapacityReached>()(
  "SubjectCapacityReached",
  { limit: Schema.Int, received: Schema.Int },
) {}
