import {
  EventId,
  EventInsert,
  EventSourceId,
  EventAvailability,
} from "@dtpt/core/modules/events/schema";
import { MmaEvent } from "@dtpt/core/modules/events/variants/mma.schema";
import { SubjectId } from "@dtpt/core/modules/subjects/schema";
import { MmaFighterSubject } from "@dtpt/core/modules/subjects/variants/mma.schema";
import { Schema } from "effect";

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
    }),
  ),
});
export type MmaImportInput = Schema.Codec.Encoded<typeof MmaImport>;
