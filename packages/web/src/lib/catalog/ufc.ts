import type { Subject } from "@dtpt/core/modules/subjects/schema";
import type { MmaFighterSubject } from "@dtpt/core/modules/subjects/variants/mma.schema";
import { Predicate } from "effect";

type Fighter = Subject & { readonly details: MmaFighterSubject };

export function getVisibleUfcFighters(
  subjects: readonly Subject[],
  search: string,
) {
  const query = search.trim().toLowerCase();
  return subjects
    .filter(
      (subject): subject is Fighter =>
        Predicate.isTagged(subject.details, "mma_fighter") &&
        (query
          ? subject.details.display.toLowerCase().includes(query)
          : subject.details.p4p !== null && subject.details.p4p <= 10),
    )
    .toSorted((a, b) =>
      query
        ? a.details.display.localeCompare(b.details.display)
        : (a.details.p4p ?? Infinity) - (b.details.p4p ?? Infinity) ||
          a.details.display.localeCompare(b.details.display),
    );
}
