import { Schema } from "effect";

import { EsportsGameId } from "../../subjects/variants/esports.schema.js";

export type EsportsMatch = typeof EsportsMatch.Type;
export const EsportsMatch = Schema.TaggedStruct("esports_match", {
  gameId: EsportsGameId,
});
