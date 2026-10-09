import { Match } from "effect";

import type { Subject } from "../subjects/schema.js";

const exclusiveSelectionGroup = (subject: Subject): string | undefined =>
  Match.value(subject.details).pipe(
    Match.when({ _tag: "mma_tracking" }, (details) =>
      [details._tag, details.leagueId].join(":"),
    ),
    Match.orElse(() => undefined),
  );

export const hasConflictingSelections = (
  subjects: readonly Subject[],
): boolean => {
  const groups = new Set<string>();

  for (const subject of subjects) {
    const group = exclusiveSelectionGroup(subject);
    if (group === undefined) continue;
    if (groups.has(group)) return true;
    groups.add(group);
  }

  return false;
};

// Toggle independent picks; replace an existing pick in the same exclusive group.
export const toggleSubscriptionSelection = (
  selected: readonly Subject[],
  subject: Subject,
): readonly Subject[] => {
  if (selected.some((pick) => pick.id === subject.id)) {
    return selected.filter((pick) => pick.id !== subject.id);
  }

  const group = exclusiveSelectionGroup(subject);
  const retained =
    group === undefined
      ? selected
      : selected.filter((pick) => exclusiveSelectionGroup(pick) !== group);

  return [...retained, subject];
};
