import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { createStore, Show } from "solid-js";
import type { ParentProps } from "solid-js";

import type { SubjectsResult } from "../subjects.js";
import { withApiClient } from "../api.js";
import { useSelectionRejection } from "../ui/useSelectionRejection.js";
import { isValidSendTime, sendTime } from "../time.js";
import { CatalogPicker } from "./CatalogPicker.jsx";
import type { Preferences } from "./preferences.js";
import { Roster } from "./Roster.jsx";
import { Schedule } from "./Schedule.jsx";
import type { ScheduleRow } from "./schedule.js";
import { SendTimeSentence } from "./SendTimeSentence.jsx";
import { BillingPanel } from "../billing/Panel.jsx";

type FormState = {
  mode: "view" | "editing" | "saving";
  teams: readonly Subject[];
  seconds: number;
  error: string | undefined;
  message: string | undefined;
};

export function Form(props: {
  readonly preferences: Preferences;
  readonly subjects: SubjectsResult;
  readonly scheduleRows: readonly ScheduleRow[];
  readonly onSaved: () => void;
}) {
  const capacity = () => props.preferences.billing.teamLimit;
  const savedTeams = () =>
    props.preferences.subscriptions.map((subscription) => subscription.subject);
  const savedTimes = () => [
    ...new Set(
      props.preferences.subscriptions.map(
        (subscription) => subscription.schedule.sendAtSecondsLocal,
      ),
    ),
  ];
  const [state, setState] = createStore<FormState>({
    mode: "view",
    teams: [],
    seconds: sendTime.default,
    error: undefined,
    message: undefined,
  });
  const rejection = useSelectionRejection(() =>
    props.preferences.billing.plan === "free"
      ? "Free includes two teams. Remove a team to make room, or get Pro for six."
      : "Pro includes six teams. Remove a team to make room.",
  );
  let editButton: HTMLButtonElement | undefined;
  let editorTitle: HTMLHeadingElement | undefined;
  const isEditing = () => state.mode !== "view";
  const isSaving = () => state.mode === "saving";
  const teams = () => (isEditing() ? state.teams : savedTeams());
  const isEmptyDraft = () => isEditing() && state.teams.length === 0;
  const isOverLimit = () => state.teams.length > capacity();

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
    if (!isSelected && state.teams.length >= capacity()) {
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
    if (isOverLimit()) return;
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
        <button
          ref={editButton}
          class="dashboard-edit"
          type="button"
          disabled={isEditing()}
          aria-hidden={isEditing() ? "true" : undefined}
          onClick={beginEdit}
        >
          Edit
        </button>
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
      <p class="visually-hidden" aria-live="polite">
        {teams().length} of {capacity()} teams picked
      </p>
      <Roster
        teams={teams()}
        capacity={Math.max(capacity(), teams().length)}
        editing={isEditing()}
        saving={isSaving()}
        onAdd={beginEdit}
        onRemove={toggle}
      />
      <Show when={savedTeams().length > capacity()}>
        <p class="form-hint" role="status">
          Your Pro access has ended. Emails continue for the first two teams
          shown. Edit your roster to choose your two Free teams, or upgrade to
          keep all six.
        </p>
      </Show>
      <BillingPanel
        billing={props.preferences.billing}
        editing={isEditing()}
        onRefresh={props.onSaved}
      />

      <Show when={!isEditing()}>
        <Schedule rows={props.scheduleRows} />
      </Show>

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
            data-full={state.teams.length >= capacity() ? "true" : undefined}
          >
            <CatalogPicker
              subjects={props.subjects}
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
        <Show when={isOverLimit()}>
          <p class="form-error" role="alert">
            Choose up to {capacity()} teams to save on Free.
          </p>
        </Show>
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
              disabled={isSaving() || isEmptyDraft() || isOverLimit()}
              data-unavailable={
                isEmptyDraft() || isOverLimit() ? "true" : undefined
              }
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

// Shared by the form and its load-error state.
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
