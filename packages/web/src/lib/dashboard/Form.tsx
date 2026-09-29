import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { SubscriptionPolicy } from "@dtpt/core/modules/subscriptions/policy";
import { createMemo, createStore, For, Match, Show, Switch } from "solid-js";
import type { ParentProps } from "solid-js";

import { withApiClient } from "../api.js";
import { getSportsLogo } from "../catalog/sports/index.js";
import { useSelectionRejection } from "../ui/useSelectionRejection.js";
import {
  formatSecondsLocal,
  isValidSendTime,
  sendTime,
  sendTimeIntervals,
} from "../time.js";
import { CatalogPicker } from "./CatalogPicker.jsx";
import { getSubjects } from "../subjects.js";
import type { Preferences } from "./preferences.js";

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
  const teams = () => (state.mode === "view" ? savedTeams() : state.teams);
  const isEmptyDraft = () => state.mode !== "view" && state.teams.length === 0;

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
    <form onSubmit={(event) => void save(event)}>
      <DashboardHeading>
        <Show when={state.mode === "view"}>
          <button
            ref={editButton}
            class="header-cta"
            type="button"
            onClick={beginEdit}
          >
            Edit
          </button>
        </Show>
        {/* Edit's place holds the draft's actions, paired like the landing
            header's Log in and Sign up. */}
        <Show when={state.mode !== "view"}>
          <div class="dashboard-heading-actions">
            <button
              class="header-cta header-cta-quiet"
              type="button"
              disabled={state.mode === "saving"}
              onClick={() => {
                finishEdit(false);
              }}
            >
              Cancel
            </button>
            <button
              class="header-cta header-cta-solid"
              type="submit"
              disabled={state.mode === "saving" || isEmptyDraft()}
              data-unavailable={isEmptyDraft() ? "true" : undefined}
            >
              {state.mode === "saving" ? "Saving…" : "Save"}
            </button>
          </div>
        </Show>
      </DashboardHeading>
      <p class="dashboard-lede">
        You'll get an email
        <Show when={state.mode !== "view" || savedTimes().length > 0}>
          {" at "}
          <Show
            when={state.mode !== "view"}
            fallback={
              <strong class="dashboard-lede-time">
                {savedTimes().map(formatSecondsLocal).join(" / ")}
              </strong>
            }
          >
            <select
              class="lede-select"
              aria-label="Send time"
              disabled={state.mode === "saving"}
              onChange={(event) => {
                setState((draft) => {
                  draft.seconds = Number(event.currentTarget.value);
                });
              }}
            >
              <For each={sendTimeIntervals}>
                {(interval) => (
                  <option
                    value={interval.value}
                    selected={state.seconds === interval.value}
                  >
                    {interval.label}
                  </option>
                )}
              </For>
            </select>
          </Show>
        </Show>{" "}
        when your teams play,{" "}
        <span class="dashboard-lede-address">
          sent to <strong>{props.preferences.user.email}</strong>.
        </span>
      </p>
      <p class="visually-hidden" aria-live="polite">
        {teams().length} of {capacity} teams picked
      </p>
      <div class="dashboard-grid">
        <For each={teams()}>
          {(team) => (
            <div class="roster-team">
              <span class="team-glyph" aria-hidden="true">
                {getSportsLogo(team.details)}
              </span>
              <span class="team-abbr">{team.details.abbreviation}</span>
              <span class="team-name">
                {team.details.display}
                <span aria-hidden="true"> · </span>
                {team.details.leagueId.toUpperCase()}
              </span>
              <Show when={state.mode !== "view"}>
                <button
                  class="roster-remove"
                  type="button"
                  disabled={state.mode === "saving"}
                  aria-label={`Remove ${team.details.display}`}
                  onClick={() => {
                    toggle(team);
                  }}
                >
                  ×
                </button>
              </Show>
            </div>
          )}
        </For>
        {/* Unfilled capacity reads as quiet empty slots. The first opens the
            editor, or says why Save is off when the draft is empty; the count
            grows automatically if the cap rises. */}
        <For each={Array.from({ length: capacity - teams().length })}>
          {(_slot, index) => (
            <Switch fallback={<div class="roster-slot" aria-hidden="true" />}>
              <Match when={index() === 0 && state.mode === "view"}>
                <button class="roster-slot" type="button" onClick={beginEdit}>
                  + Add team
                </button>
              </Match>
              <Match when={index() === 0 && isEmptyDraft()}>
                <p class="roster-slot roster-slot-error" role="alert">
                  Pick a team to save
                </p>
              </Match>
            </Switch>
          )}
        </For>
      </div>

      <Show when={state.mode !== "view"}>
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
          <fieldset class="dashboard-picker" disabled={state.mode === "saving"}>
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
        Your <em>roster.</em>
      </h1>
      {props.children}
    </div>
  );
}
