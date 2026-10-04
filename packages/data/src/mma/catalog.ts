import { SubjectId } from "@dtpt/core/modules/subjects/schema";

// Allocated once; never derive identity from names, URLs, opponents or dates.
export const UfcCoverageIds = {
  numbered: SubjectId.make("f6309178-43b3-463a-8880-000000000001"),
  all: SubjectId.make("f6309178-43b3-463a-8880-000000000002"),
} as const;

export const ufcCoverageSubjects = [
  {
    id: UfcCoverageIds.numbered,
    _tag: "mma_coverage",
    details: {
      _tag: "mma_coverage",
      leagueId: "ufc",
      display: "Numbered UFC events",
      coverage: "numbered",
    },
  },
  {
    id: UfcCoverageIds.all,
    _tag: "mma_coverage",
    details: {
      _tag: "mma_coverage",
      leagueId: "ufc",
      display: "All UFC events",
      coverage: "all",
    },
  },
] as const;
