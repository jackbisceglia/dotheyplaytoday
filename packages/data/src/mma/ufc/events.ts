import type { MmaTrackingSubject } from "@dtpt/core/modules/subjects/variants/mma.schema";

import type { MmaSeedEncoded } from "../../schema/mma.js";

type UfcEventSeed = MmaSeedEncoded["events"][number];

export const events: readonly UfcEventSeed[] = [
  {
    _tag: "mma_card",
    id: "b51165b6-7428-4620-a02e-000000000001",
    sourceId: "mma_card:ufc:b51165b6-7428-4620-a02e-000000000001",
    availability: "active",
    sourceUrl: "https://www.ufc.com/event/ufc-332",
    startsAt: "2026-10-03T20:00:00.000Z",
    details: {
      _tag: "mma_card",
      leagueId: "ufc",
      title: "UFC 332: Silva vs Wang",
      category: "numbered",
      venue: { title: "Delta Center", location: "Salt Lake City" },
      timings: {
        early: "2026-10-03T20:00:00.000Z",
        prelims: "2026-10-03T22:00:00.000Z",
        main: "2026-10-04T00:00:00.000Z",
      },
    },
    participants: [
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000001",
          title: "Natalia Silva",
          fightId: "fight-1",
          placement: "main",
        },
      },
      {
        _tag: "mma_card",
        details: {
          _tag: "mma_card",
          subjectId: "c759cf80-2526-432b-8010-000000000002",
          title: "Wang Cong",
          fightId: "fight-1",
          placement: "main",
        },
      },
    ],
  },
  // Allen–Duncan remains pending until all three broadcast times are confirmed.
  // Its allocated card ID is reserved in the catalog runbook.
];

export const getFighterFeedIds = (subjectId: string) =>
  events
    .values()
    .filter((event) =>
      event.participants.some(
        (participant) => participant.details.subjectId === subjectId,
      ),
    )
    .map((event) => event.sourceId)
    .toArray();

export const getTrackingFeedIds = (scope: MmaTrackingSubject["scope"]) =>
  events
    .values()
    .filter((event) => scope === "all" || event.details.category === "numbered")
    .map((event) => event.sourceId)
    .toArray();
