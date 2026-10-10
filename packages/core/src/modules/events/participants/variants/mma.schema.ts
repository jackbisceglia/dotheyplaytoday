import { Schema } from "effect";

export type MmaParticipant = typeof MmaParticipant.Type;
export const MmaParticipant = Schema.TaggedStruct("mma_card", {
  title: Schema.NonEmptyString,
  fightId: Schema.NonEmptyString,
  placement: Schema.Literals(["prelims", "main"]),
});
