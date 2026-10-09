import { Schema } from "effect";

import { SubjectId } from "../../../subjects/schema.js";

export type MmaParticipant = typeof MmaParticipant.Type;
export const MmaParticipant = Schema.TaggedStruct("mma_card", {
  subjectId: SubjectId,
  title: Schema.NonEmptyString,
  fightId: Schema.NonEmptyString,
  placement: Schema.Literals(["early", "prelims", "main"]),
});
