import { Match } from "effect";

import type { Subject } from "../subjects/schema.js";

/**
 * Subjects with the same key are alternatives: only one can be selected.
 * UFC Numbered and All share "mma_tracking:ufc"; teams and fighters return
 * undefined because they can be selected independently.
 */
const exclusiveSelectionGroup = (subject: Subject): string | undefined =>
  Match.value(subject.details).pipe(
    Match.tag("mma_tracking", (details) =>
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

/**
 * Clicking a selected subject removes it. Clicking an unselected subject adds it,
 * replacing any alternative in its exclusive group while retaining other picks.
 * For example, choosing All replaces Numbered but keeps followed fighters/teams.
 */
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
