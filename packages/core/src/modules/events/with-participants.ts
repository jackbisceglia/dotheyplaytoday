import { Predicate, Schema } from "effect";

import type { ExtractFromTag } from "../../lib/types.js";
import { Participant, type ParticipantDetails } from "./participants/schema.js";
import { Event } from "./schema.js";

export type EventWithParticipants = typeof EventWithParticipants.Type;
export const EventWithParticipants = Schema.Struct({
  ...Event.fields,
  participants: Schema.Array(Participant),
});

export type NarrowedEventWithParticipants<
  Tag extends EventWithParticipants["_tag"],
> = Omit<EventWithParticipants, "details" | "participants"> & {
  readonly details: ExtractFromTag<EventWithParticipants["details"], Tag>;
  readonly participants: readonly (Omit<Participant, "details"> & {
    readonly details: ExtractFromTag<ParticipantDetails, Tag>;
  })[];
};

export const isEventWithParticipants =
  <Tag extends EventWithParticipants["_tag"]>(tag: Tag) =>
  (event: EventWithParticipants): event is NarrowedEventWithParticipants<Tag> =>
    event._tag === event.details._tag &&
    Predicate.isTagged(event.details, tag) &&
    event.participants.every(
      (participant) =>
        participant._tag === participant.details._tag &&
        Predicate.isTagged(participant.details, tag),
    );
