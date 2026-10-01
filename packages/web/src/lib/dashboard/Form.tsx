import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { SubscriptionPolicy } from "@dtpt/core/modules/subscriptions/policy";
import { createMemo, createStore, Show } from "solid-js";
import type { ParentProps } from "solid-js";

import { withApiClient } from "../api.js";
import { useSelectionRejection } from "../ui/useSelectionRejection.js";
import { getSubjects } from "../subjects.js";
import { isValidSendTime, sendTime } from "../time.js";
import { CatalogPicker } from "./CatalogPicker.jsx";
import type { Preferences } from "./preferences.js";
import { Roster } from "./Roster.jsx";
import { SendTimeSentence } from "./SendTimeSentence.jsx";

const capacity = SubscriptionPolicy.subject.constraints.max;

type FormState = {
  mode: "view" | "editing" | "saving";
  teams: readonly Subject[];
  seconds: number;
  error: string | undefined;
  message: string | undefined;
};

export function Form(props: {
  readonly preferences: Preferences;
  readonly onSaved: () => void;
}) {
  const savedTeams = () =>
    props.preferences.subscriptions.map((subscription) => subscription.subject);
  const savedTimes = () => [
    ...new Set(
      props.preferences.subscriptions.map(
        (subscription) => subscription.schedule.sendAtSecondsLocal,
      ),
    ),
  ];
  // Read here rather than in the picker, which only mounts while editing: the
  // form lives as long as the page, so the router keeps the preloaded catalog
  // cached and Edit opens without fetching it again.
  const subjects = createMemo(() => getSubjects());
  const [state, setState] = createStore<FormState>({
    mode: "view",
    teams: [],
    seconds: sendTime.default,
    error: undefined,
    message: undefined,
  });
  const rejection = useSelectionRejection(
    `You can pick up to ${capacity.toString()} teams. Remove one to make room.`,
  );
  let editButton: HTMLButtonElement | undefined;
  let editorTitle: HTMLHeadingElement | undefined;
  const isEditing = () => state.mode !== "view";
  const isSaving = () => state.mode === "saving";
  const teams = () => (isEditing() ? state.teams : savedTeams());
  const isEmptyDraft = () => isEditing() && state.teams.length === 0;

  const beginEdit = () => {
    setState((draft) => {
      draft.mode = "editing";
      draft.teams = savedTeams();
      draft.seconds = savedTimes()[0] ?? sendTime.default;
      draft.error = undefined;
      draft.message = undefined;
    });
    queueMicrotask(() => editorTitle?.focus());
  };
  const finishEdit = (saved: boolean) => {
    setState((draft) => {
      draft.mode = "view";
      draft.error = undefined;
      draft.message = saved ? "Your picks and send time are saved." : undefined;
    });
    rejection.clearRejection();
    queueMicrotask(() => editButton?.focus());
  };
  const toggle = (team: Subject) => {
    if (state.mode !== "editing") return;
    const isSelected = state.teams.some((picked) => picked.id === team.id);
    if (!isSelected && state.teams.length >= capacity) {
      rejection.rejectSelection(team.id);
      return;
    }
    setState((draft) => {
      draft.teams = isSelected
        ? draft.teams.filter((picked) => picked.id !== team.id)
        : [...draft.teams, team];
      draft.error = undefined;
    });
    rejection.clearRejection();
  };
  const save = async (event: SubmitEvent) => {
    event.preventDefault();
    if (state.mode !== "editing") return;
    const subjectIds = state.teams.map((team) => team.id);
    const [first, ...rest] = subjectIds;
    // Save is disabled for an empty draft; this narrows the tuple.
    if (first === undefined) return;
    const seconds = state.seconds;
    if (!isValidSendTime(seconds)) {
      setState((draft) => {
        draft.error = "Choose a valid send time.";
      });
      return;
    }
    setState((draft) => {
      draft.mode = "saving";
      draft.error = undefined;
    });
    try {
      await withApiClient((api) =>
        api.subscription.update({
          payload: {
            subjectIds: [first, ...rest],
            schedule: {
              _tag: "fixed_local_time",
              sendAtSecondsLocal: seconds,
            },
          },
        }),
      );
      props.onSaved();
      finishEdit(true);
    } catch {
      setState((draft) => {
        draft.mode = "editing";
        draft.error =
          "We couldn't save your changes. Your picks are still here; try again.";
      });
    }
  };

  return (
    <form
      class="dashboard-form"
      data-editing={isEditing() ? "true" : undefined}
      onSubmit={(event) => void save(event)}
    >
      <DashboardHeading>
        <Show when={!isEditing()}>
          <button
            ref={editButton}
            class="dashboard-edit"
            type="button"
            onClick={beginEdit}
          >
            Edit
          </button>
        </Show>
      </DashboardHeading>
      <SendTimeSentence
        savedTimes={savedTimes()}
        editing={isEditing()}
        saving={isSaving()}
        seconds={state.seconds}
        onChange={(seconds) => {
          setState((draft) => {
            draft.seconds = seconds;
          });
        }}
      />
      <p class="form-hint">
        Your weekly schedule arrives every Monday at 9 AM, including weeks with
        no games.
      </p>
      <p class="visually-hidden" aria-live="polite">
        {teams().length} of {capacity} teams picked
      </p>
      <Roster
        teams={teams()}
        capacity={capacity}
        editing={isEditing()}
        saving={isSaving()}
        onAdd={beginEdit}
        onRemove={toggle}
      />

      <Show when={isEditing()}>
        <section class="dashboard-section" aria-labelledby="editor-heading">
          {/* Kept for screen readers; beginEdit moves focus here. */}
          <h2
            id="editor-heading"
            class="visually-hidden"
            ref={editorTitle}
            tabindex={-1}
          >
            Make your picks
          </h2>
          <fieldset
            class="dashboard-picker"
            disabled={isSaving()}
            data-full={state.teams.length >= capacity ? "true" : undefined}
          >
            <CatalogPicker
              subjects={subjects()}
              selected={new Set(state.teams.map((team) => team.id))}
              rejectedSelectionId={rejection.rejectedSelectionId()}
              onToggle={toggle}
            />
          </fieldset>
          <Show when={rejection.rejectionMessage()}>
            {(value) => (
              <div class="app-toast" role="status">
                {value()}
              </div>
            )}
          </Show>
        </section>
        <div class="dashboard-actions">
          <div class="dashboard-actions-inner">
            <button
              class="btn btn-secondary"
              type="button"
              disabled={isSaving()}
              onClick={() => {
                finishEdit(false);
              }}
            >
              Cancel
            </button>
            <button
              class="btn btn-primary"
              type="submit"
              disabled={isSaving() || isEmptyDraft()}
              data-unavailable={isEmptyDraft() ? "true" : undefined}
            >
              {isSaving() ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </Show>

      <Show when={state.message}>
        {(value) => (
          <p class="form-hint dashboard-feedback" role="status">
            {value()}
          </p>
        )}
      </Show>

      <Show when={state.error}>
        {(value) => (
          <div class="app-toast" role="alert">
            {value()}
          </div>
        )}
      </Show>
    </form>
  );
}

// Rendered by the error state too, so the title never shifts.
export function DashboardHeading(props: ParentProps) {
  return (
    <div class="dashboard-heading">
      <h1 id="dashboard-title" class="dashboard-title">
        Welcome <em>back.</em>
      </h1>
      {props.children}
    </div>
  );
}
