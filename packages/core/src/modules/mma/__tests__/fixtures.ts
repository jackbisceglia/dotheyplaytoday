import { DateTime, Schema } from "effect";

import { EventWithParticipants } from "../../events/joined.js";
import { Subject } from "../../subjects/schema.js";

export const fighterA = Schema.decodeUnknownSync(Subject)({
  id: "10000000-0000-4000-8000-000000000001",
  _tag: "mma_fighter",
  details: {
    _tag: "mma_fighter",
    leagueId: "ufc",
    display: "Fighter A",
    profileUrl: "https://www.ufc.com/athlete/a",
  },
});
export const fighterB = Schema.decodeUnknownSync(Subject)({
  ...fighterA,
  id: "10000000-0000-4000-8000-000000000002",
  details: { ...fighterA.details, display: "Fighter B" },
});
export const numbered = Schema.decodeUnknownSync(Subject)({
  id: "10000000-0000-4000-8000-000000000003",
  _tag: "mma_tracking",
  details: {
    _tag: "mma_tracking",
    leagueId: "ufc",
    display: "Numbered UFC events",
    scope: "numbered",
  },
});
export const all = Schema.decodeUnknownSync(Subject)({
  ...numbered,
  id: "10000000-0000-4000-8000-000000000004",
  details: { ...numbered.details, display: "All UFC events", scope: "all" },
});
export const card = Schema.decodeUnknownSync(EventWithParticipants)({
  id: "20000000-0000-4000-8000-000000000001",
  sourceId: "mma_card:ufc:20000000-0000-4000-8000-000000000001",
  _tag: "mma_card",
  startsAt: "2026-10-03T23:00:00.000Z",
  availability: "active",
  participants: [fighterA, fighterB].map((subject) => ({
    id: subject.id,
    eventId: "20000000-0000-4000-8000-000000000001",
    _tag: "mma_card",
    details: {
      _tag: "mma_card",
      subjectId: subject.id,
      title: subject.details.display,
      fightId: "fight-1",
      placement: "main",
    },
  })),
  details: {
    _tag: "mma_card",
    leagueId: "ufc",
    title: "UFC test",
    category: "numbered",
    venue: { title: "Test Arena", location: "Test City" },
    timings: {
      prelims: "2026-10-03T23:00:00.000Z",
      main: "2026-10-04T02:00:00.000Z",
    },
  },
});
export const ny = DateTime.zoneMakeNamedUnsafe("America/New_York");
