import { SubjectId } from "@dtpt/core/modules/subjects/schema";
import type { MmaTrackingSubject } from "@dtpt/core/modules/subjects/variants/mma.schema";

import { MmaSeedEncoded } from "../schema/mma.js";

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
        prelims: "2026-10-03T20:00:00.000Z",
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

// Allocated once; never derive identity from names, URLs, opponents or dates.
export const UfcCoverageIds = {
  numbered: SubjectId.make("f6309178-43b3-463a-8880-000000000001"),
  all: SubjectId.make("f6309178-43b3-463a-8880-000000000002"),
} as const;

type UfcSubjectSeed = MmaSeedEncoded["subjects"][number];

export const Fighters = {
  NataliaSilva: {
    id: "c759cf80-2526-432b-8010-000000000001",
    _tag: "mma_fighter",
    details: {
      _tag: "mma_fighter",
      leagueId: "ufc",
      display: "Natalia Silva",
      profileUrl: "https://www.ufc.com/athlete/natalia-silva",
    },
    feedIds: getFighterFeedIds("c759cf80-2526-432b-8010-000000000001"),
  },
  WangCong: {
    id: "c759cf80-2526-432b-8010-000000000002",
    _tag: "mma_fighter",
    details: {
      _tag: "mma_fighter",
      leagueId: "ufc",
      display: "Wang Cong",
      profileUrl: "https://www.ufc.com/athlete/wang-cong",
    },
    feedIds: getFighterFeedIds("c759cf80-2526-432b-8010-000000000002"),
  },
  BrendanAllen: {
    id: "c759cf80-2526-432b-8010-000000000003",
    _tag: "mma_fighter",
    details: {
      _tag: "mma_fighter",
      leagueId: "ufc",
      display: "Brendan Allen",
      profileUrl: "https://www.ufc.com/athlete/brendan-allen",
    },
    feedIds: getFighterFeedIds("c759cf80-2526-432b-8010-000000000003"),
  },
  ChristianLeroyDuncan: {
    id: "c759cf80-2526-432b-8010-000000000004",
    _tag: "mma_fighter",
    details: {
      _tag: "mma_fighter",
      leagueId: "ufc",
      display: "Christian Leroy Duncan",
      profileUrl: "https://www.ufc.com/athlete/christian-leroy-duncan",
    },
    feedIds: getFighterFeedIds("c759cf80-2526-432b-8010-000000000004"),
  },
} as const satisfies Record<string, UfcSubjectSeed>;

export const Tracking = {
  Numbered: {
    id: UfcCoverageIds.numbered,
    _tag: "mma_tracking",
    details: {
      _tag: "mma_tracking",
      leagueId: "ufc",
      display: "Numbered UFC events",
      scope: "numbered",
    },
    feedIds: getTrackingFeedIds("numbered"),
  },
  All: {
    id: UfcCoverageIds.all,
    _tag: "mma_tracking",
    details: {
      _tag: "mma_tracking",
      leagueId: "ufc",
      display: "All UFC events",
      scope: "all",
    },
    feedIds: getTrackingFeedIds("all"),
  },
} as const satisfies Record<string, UfcSubjectSeed>;

export const subjects = [
  ...Object.values(Fighters),
  ...Object.values(Tracking),
];

export const ufcCollection = MmaSeedEncoded.make({
  id: "mma.ufc",
  subjects,
  events,
});
