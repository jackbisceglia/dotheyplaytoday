import { Schema } from "effect";

import { SportLeagueId } from "../../subjects/variants/sport.schema.js";

export type SportEvent = typeof SportEvent.Type;
export const SportEvent = Schema.TaggedStruct("sports_game", {
  leagueId: SportLeagueId,
});
