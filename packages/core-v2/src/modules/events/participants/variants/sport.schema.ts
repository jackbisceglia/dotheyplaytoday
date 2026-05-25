import { Schema } from "effect";

export type SportParticipant = typeof SportParticipant.Type;
export const SportParticipant = Schema.TaggedStruct("sports_game", {
  role: Schema.Literals(["home", "away"]),
  title: Schema.NonEmptyString,
});
