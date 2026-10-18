import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { revalidate } from "@solidjs/router";
import { Result } from "effect";

import { getSubjects, type SubjectsResult } from "../subjects.js";
import { SubjectPicker } from "../ui/SubjectPicker.jsx";

export function CatalogPicker(props: {
  readonly subjects: SubjectsResult;
  readonly selected: ReadonlySet<string>;
  readonly rejectedSelectionId: string | undefined;
  readonly onToggle: (subject: Subject) => void;
}) {
  return (
    <>
      {Result.match(props.subjects, {
        onSuccess: (subjects) => (
          <SubjectPicker
            subjects={subjects}
            selected={props.selected}
            rejectedSelectionId={props.rejectedSelectionId}
            onToggle={props.onToggle}
          />
        ),
        onFailure: () => (
          <p class="form-error dashboard-load-error" role="alert">
            We couldn't load the available picks.{" "}
            <button
              type="button"
              class="btn btn-secondary"
              onClick={() => {
                revalidate(getSubjects.key);
              }}
            >
              Try again
            </button>
          </p>
        ),
      })}
    </>
  );
}
