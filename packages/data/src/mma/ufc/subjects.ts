import { SubjectId } from "@dtpt/core/modules/subjects/schema";
import type { MmaSeedEncoded } from "../../schema/mma.js";

import { getFighterFeedIds, getTrackingFeedIds } from "./events.js";

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
