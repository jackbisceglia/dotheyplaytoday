import { Schema } from "effect";

export type EsportsParticipant = typeof EsportsParticipant.Type;
export const EsportsParticipant = Schema.TaggedStruct("esports_match", {
  title: Schema.NonEmptyString,
});
