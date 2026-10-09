import {
  EventId,
  EventInsert,
  EventSourceId,
  EventAvailability,
} from "@dtpt/core/modules/events/schema";
import { ParticipantInsert } from "@dtpt/core/modules/events/participants/schema";
import { MmaParticipant } from "@dtpt/core/modules/events/participants/variants/mma.schema";
import { MmaEvent } from "@dtpt/core/modules/events/variants/mma.schema";
import { SubjectId } from "@dtpt/core/modules/subjects/schema";
import { MmaFighterSubject } from "@dtpt/core/modules/subjects/variants/mma.schema";
import { Array, Schema } from "effect";

export type MmaImport = typeof MmaImport.Type;
export const MmaImport = Schema.Struct({
  fighters: Schema.Array(
    Schema.Struct({
      id: SubjectId,
      details: MmaFighterSubject,
    }),
  ),
  cards: Schema.Array(
    Schema.Struct({
      id: EventId,
      sourceId: EventSourceId.check(Schema.isPattern(/^mma_card:ufc:/)),
      availability: EventAvailability,
      sourceUrl: Schema.NonEmptyString,
      startsAt: EventInsert.fields.startsAt,
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
          const fighters = participants.map(
            (participant) => participant.details,
          );
          if (
            new Set(fighters.map((fighter) => fighter.subjectId)).size !==
            fighters.length
          ) {
            return "A fighter cannot occupy multiple slots on a card";
          }
          const fights = Array.groupBy(fighters, (fighter) => fighter.fightId);
          if (
            Object.values(fights).some(
              (fight) =>
                fight.length > 2 ||
                fight.some(
                  (fighter) => fighter.placement !== fight[0].placement,
                ),
            )
          ) {
            return "Each fight requires one or two participants with matching placement";
          }
          return undefined;
        }),
      ),
    }),
  ),
});
export type MmaImportInput = Schema.Codec.Encoded<typeof MmaImport>;
