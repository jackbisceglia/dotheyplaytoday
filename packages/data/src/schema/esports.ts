import {
  EventInsert,
  EventSourceId,
  ParticipantInsert,
  SubjectInsert,
} from "@dtpt/core";
import { EsportsParticipant } from "@dtpt/core/modules/events/participants/variants/esports.schema";
import { EsportsMatch } from "@dtpt/core/modules/events/variants/esports.schema";
import { EsportsTeamSubject } from "@dtpt/core/modules/subjects/variants/esports.schema";
import { HashSet, Schema } from "effect";

import { SeedCollectionId } from "./seed.js";

export type EsportsSubjectSeed = typeof EsportsSubjectSeed.Type;
export const EsportsSubjectSeed = Schema.Struct({
  ...SubjectInsert.fields,
  _tag: Schema.Literal("esports_team"),
  details: EsportsTeamSubject,
  feedIds: Schema.Array(EventSourceId),
});

export type EsportsEventSeed = typeof EsportsEventSeed.Type;
export const EsportsEventSeed = Schema.Struct({
  ...EventInsert.fields,
  _tag: Schema.Literal("esports_match"),
  details: EsportsMatch,
  participants: Schema.Array(
    ParticipantInsert.mapFields(
      ({ eventId: _eventId, id: _id, ...fields }) => ({
        ...fields,
        _tag: Schema.Literal("esports_match"),
        details: EsportsParticipant,
      }),
    ),
  ).check(
    Schema.isLengthBetween(2, 2),
    Schema.makeFilter(function hasDistinctTeams(participants) {
      const set = HashSet.fromIterable(
        participants.map((p) => p.details.title),
      );

      if (HashSet.size(set) !== 2) {
        return "Esports match seeds must include two different teams";
      }

      return undefined;
    }),
  ),
});

export type EsportsSeed = typeof EsportsSeed.Type;
export const EsportsSeed = Schema.Struct({
  id: SeedCollectionId,
  subjects: Schema.Array(EsportsSubjectSeed),
  events: Schema.Array(EsportsEventSeed),
});

export type EsportsSeedEncoded = typeof EsportsSeedEncoded.Type;
export const EsportsSeedEncoded = Schema.toEncoded(EsportsSeed);
