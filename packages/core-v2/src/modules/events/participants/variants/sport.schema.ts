import { Schema } from "effect";

export const SportParticipantRoles = ["home", "away"] as const;

export type SportParticipant = typeof SportParticipant.Type;
export const SportParticipant = Schema.TaggedStruct("sports_game", {
  role: Schema.Literals(SportParticipantRoles),
  title: Schema.NonEmptyString,
});
