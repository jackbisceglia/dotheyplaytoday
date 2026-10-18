import {
  EventInsert,
  EventSourceId,
  ParticipantInsert,
  SubjectInsert,
} from "@dtpt/core";
import { hasMatchingStart } from "@dtpt/core/modules/events/schema";
import { MmaParticipant } from "@dtpt/core/modules/events/participants/variants/mma.schema";
import { MmaEvent } from "@dtpt/core/modules/events/variants/mma.schema";
import {
  MmaFighterSubject,
  MmaTrackingSubject,
} from "@dtpt/core/modules/subjects/variants/mma.schema";
import { Array, Schema } from "effect";

import { SeedCollectionId } from "./seed.js";

export type MmaSubjectSeed = typeof MmaSubjectSeed.Type;
export const MmaSubjectSeed = Schema.Union([
  Schema.Struct({
    ...SubjectInsert.fields,
    _tag: MmaFighterSubject.fields._tag,
    details: MmaFighterSubject,
    feedIds: Schema.Array(EventSourceId),
  }),
  Schema.Struct({
    ...SubjectInsert.fields,
    _tag: MmaTrackingSubject.fields._tag,
    details: MmaTrackingSubject,
    feedIds: Schema.Array(EventSourceId),
  }),
]);

export type MmaEventSeed = typeof MmaEventSeed.Type;
export const MmaEventSeed = Schema.Struct({
  ...EventInsert.fields,
  _tag: MmaEvent.fields._tag,
  sourceId: EventSourceId.check(Schema.isPattern(/^mma_card:ufc:/)),
  sourceUrl: Schema.String.check(
    Schema.isPattern(/^https:\/\/www\.ufc\.com\//),
  ),
  details: MmaEvent,
  participants: Schema.Array(
    ParticipantInsert.mapFields(
      ({ id: _id, eventId: _eventId, ...fields }) => ({
        ...fields,
        _tag: MmaParticipant.fields._tag,
        details: MmaParticipant,
      }),
    ),
  ).check(
    Schema.makeFilter(function hasValidFights(participants) {
      const fighters = participants.map((participant) => participant.details);
      if (
        new Set(fighters.map((fighter) => fighter.title)).size !==
        fighters.length
      ) {
        return "A fighter cannot occupy multiple slots on a card";
      }
      const fights = Array.groupBy(fighters, (fighter) => fighter.fightId);
      if (
        Object.values(fights).some(
          (fight) =>
            fight.length > 2 ||
            fight.some((fighter) => fighter.placement !== fight[0].placement),
        )
      ) {
        return "Each fight requires one or two participants with matching placement";
      }
      return undefined;
    }),
  ),
}).check(hasMatchingStart);

export type MmaSeed = typeof MmaSeed.Type;
export const MmaSeed = Schema.Struct({
  id: SeedCollectionId,
  subjects: Schema.Array(MmaSubjectSeed),
  events: Schema.Array(MmaEventSeed),
});

export type MmaSeedEncoded = typeof MmaSeedEncoded.Type;
export const MmaSeedEncoded = Schema.toEncoded(MmaSeed);
