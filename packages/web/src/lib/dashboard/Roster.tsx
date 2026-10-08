import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { For, Match, Show, Switch } from "solid-js";

import {
  getSportsLogo,
  subjectAbbreviation,
  subjectName,
} from "../catalog/sports/index.js";

// The same tiles in view and edit mode, so editing only adds controls around
// what's already on screen. Unfilled capacity reads as quiet empty slots; the
// first opens the editor, or says why Save is off when the draft is empty.
// Outside editing, each tile filters the schedule below to its games.
export function Roster(props: {
  readonly teams: readonly Subject[];
  readonly capacity: number;
  readonly editing: boolean;
  readonly saving: boolean;
  readonly onAdd: () => void;
  readonly onRemove: (team: Subject) => void;
  readonly focusedId: string | undefined;
  readonly pinnedId: string | undefined;
  readonly onPreview: (id: string | undefined) => void;
  readonly onPin: (team: Subject) => void;
}) {
  const openSlots = () =>
    Array.from({ length: props.capacity - props.teams.length });

  return (
    <div class="roster">
      <For each={props.teams}>
        {(team) => (
          <Show
            when={props.editing}
            fallback={
              <button
                class="roster-team"
                type="button"
                data-focused={props.focusedId === team.id ? "true" : undefined}
                aria-pressed={props.pinnedId === team.id ? "true" : "false"}
                aria-label={`Show only ${team.details.display} games`}
                onClick={() => {
                  props.onPin(team);
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") props.onPreview(team.id);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") props.onPreview(undefined);
                }}
              >
                <RosterTeamLabel team={team} />
              </button>
            }
          >
            <div class="roster-team">
              <RosterTeamLabel team={team} />
              <button
                class="roster-remove"
                type="button"
                disabled={props.saving}
                aria-label={`Remove ${team.details.display}`}
                onClick={() => {
                  props.onRemove(team);
                }}
              >
                ×
              </button>
            </div>
          </Show>
        )}
      </For>
      <For each={openSlots()}>
        {(_slot, index) => (
          <Switch fallback={<div class="roster-slot" aria-hidden="true" />}>
            <Match when={index() === 0 && !props.editing}>
              <button class="roster-slot" type="button" onClick={props.onAdd}>
                + Add pick
              </button>
            </Match>
            <Match when={index() === 0 && props.teams.length === 0}>
              <p class="roster-slot roster-slot-error" role="alert">
                Make a pick to save
              </p>
            </Match>
          </Switch>
        )}
      </For>
    </div>
  );
}

function RosterTeamLabel(props: { readonly team: Subject }) {
  return (
    <>
      <span class="team-glyph" aria-hidden="true">
        {getSportsLogo(props.team.details)}
      </span>
      <span class="roster-team-text">
        <span class="team-abbr">{subjectAbbreviation(props.team.details)}</span>
        <span class="team-name">
          <Show when={props.team.details._tag === "sports_team"}>
            {subjectName(props.team.details)}
            <span aria-hidden="true"> · </span>
          </Show>
          {props.team.details.leagueId.toUpperCase()}
        </span>
      </span>
    </>
  );
}
