import {
  EventInsert,
  EventSourceId,
  ParticipantInsert,
  SubjectInsert,
} from "@dtpt/core-v2";
import { Schema } from "effect";

import { SeedCollectionId } from "./seed.js";

export type SportSubjectSeed = typeof SportSubjectSeed.Type;
export const SportSubjectSeed = Schema.Struct({
  ...SubjectInsert.fields,
  feedIds: Schema.Array(EventSourceId),
});

export type SportEventSeed = typeof SportEventSeed.Type;
export const SportEventSeed = Schema.Struct({
  ...EventInsert.fields,
  participants: Schema.Array(
    ParticipantInsert.mapFields(
      ({ eventId: _eventId, id: _id, ...fields }) => fields,
    ),
  ),
});

export type SportsSeed = typeof SportsSeed.Type;
export const SportsSeed = Schema.Struct({
  id: SeedCollectionId,
  subjects: Schema.Array(SportSubjectSeed),
  events: Schema.Array(SportEventSeed),
});
