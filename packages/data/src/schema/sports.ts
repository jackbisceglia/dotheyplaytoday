import {
  EventInsert,
  EventSourceId,
  ParticipantInsert,
  SubjectInsert,
} from "@dtpt/core-v2";
import { HashSet, Schema } from "effect";

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
  ).check(
    Schema.isLengthBetween(2, 2),
    Schema.makeFilter(function hasValidRoles(participants) {
      const set = HashSet.fromIterable(participants.map((p) => p.details.role));

      if (!HashSet.has(set, "home") || !HashSet.has(set, "away")) {
        return "Sports game seeds must include both a home participant and an away participant";
      }

      return undefined;
    }),
  ),
});

export type SportsSeed = typeof SportsSeed.Type;
export const SportsSeed = Schema.Struct({
  id: SeedCollectionId,
  subjects: Schema.Array(SportSubjectSeed),
  events: Schema.Array(SportEventSeed),
});

export type SportsSeedEncoded = typeof SportsSeedEncoded.Type;
export const SportsSeedEncoded = Schema.toEncoded(SportsSeed);
