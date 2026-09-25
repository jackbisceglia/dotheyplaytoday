import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { revalidate } from "@solidjs/router";
import { Result } from "effect";
import { createMemo, Loading } from "solid-js";

import { getSubjects } from "../subjects.js";
import { TeamPicker } from "../ui/TeamPicker.jsx";

export function CatalogPicker(props: {
  readonly selected: ReadonlySet<string>;
  readonly rejectedSelectionId: string | undefined;
  readonly onToggle: (team: Subject) => void;
}) {
  const result = createMemo(() => getSubjects());

  return (
    <Loading
      fallback={
        <p class="team-grid-loading" role="status">
          Loading teams…
        </p>
      }
    >
      {Result.match(result(), {
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
    </Loading>
  );
}
