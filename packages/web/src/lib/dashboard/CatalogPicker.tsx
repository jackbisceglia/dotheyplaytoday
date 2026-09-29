import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { revalidate } from "@solidjs/router";
import { Result } from "effect";

import { getSubjects, type SubjectsResult } from "../subjects.js";
import { TeamPicker } from "../ui/TeamPicker.jsx";

export function CatalogPicker(props: {
  readonly subjects: SubjectsResult;
  readonly selected: ReadonlySet<string>;
  readonly rejectedSelectionId: string | undefined;
  readonly onToggle: (team: Subject) => void;
}) {
  return (
    <>
      {Result.match(props.subjects, {
        onSuccess: (subjects) => (
          <TeamPicker
            subjects={subjects}
            selected={props.selected}
            rejectedSelectionId={props.rejectedSelectionId}
            onToggle={props.onToggle}
          />
        ),
        onFailure: () => (
          <p class="form-error dashboard-load-error" role="alert">
            We couldn't load the teams.{" "}
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
