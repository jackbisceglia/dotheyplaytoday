import type { Subject } from "../subjects/schema.js";

// Coverage is one hierarchical choice; replacing it never changes fighter picks.
export const toggleSubject = (
  selected: readonly Subject[],
  subject: Subject,
): readonly Subject[] => {
  if (selected.some((pick) => pick.id === subject.id)) {
    return selected.filter((pick) => pick.id !== subject.id);
  }
  const retained =
    subject.details._tag === "mma_coverage"
      ? selected.filter((pick) => pick.details._tag !== "mma_coverage")
      : selected;
  return [...retained, subject];
};

export const hasSingleMmaCoverage = (subjects: readonly Subject[]) =>
  subjects.filter((subject) => subject.details._tag === "mma_coverage")
    .length <= 1;
