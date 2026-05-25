import { Schema } from "effect";

import { SportLeagueId } from "../subjects/sports.js";

export type SportEvent = typeof SportEvent.Type;
export const SportEvent = Schema.TaggedStruct("sports_game", {
  leagueId: SportLeagueId,
});

export type SportParticipant = typeof SportParticipant.Type;
export const SportParticipant = Schema.TaggedStruct("sports_game", {
  role: Schema.Literals(["home", "away"]),
  title: Schema.NonEmptyString,
});
