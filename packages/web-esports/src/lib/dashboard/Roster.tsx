import { For, Match, Show, Switch } from "solid-js";

import { getEsportsLogo, type EsportsTeam } from "../catalog/esports/index.js";

// The same tiles in view and edit mode, so editing only adds controls around
// what's already on screen. Unfilled capacity reads as quiet empty slots; the
// first opens the editor, or says why Save is off when the draft is empty.
export function Roster(props: {
  readonly teams: readonly EsportsTeam[];
  readonly capacity: number;
  readonly editing: boolean;
  readonly saving: boolean;
  readonly onAdd: () => void;
  readonly onRemove: (team: EsportsTeam) => void;
}) {
  const openSlots = () =>
    Array.from({ length: props.capacity - props.teams.length });

  return (
    <div class="roster">
      <For each={props.teams}>
        {(team) => (
          <div class="roster-team">
            <span class="team-glyph" aria-hidden="true">
              {getEsportsLogo(team.details)}
            </span>
            <span class="roster-team-text">
              <span class="team-abbr">{team.details.abbreviation}</span>
              <span class="team-name">
                {team.details.name}
                <span aria-hidden="true"> · </span>
                {team.details.gameId.toUpperCase()}
              </span>
            </span>
            <Show when={props.editing}>
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
            </Show>
          </div>
        )}
      </For>
      <For each={openSlots()}>
        {(_slot, index) => (
          <Switch fallback={<div class="roster-slot" aria-hidden="true" />}>
            <Match when={index() === 0 && !props.editing}>
              <button class="roster-slot" type="button" onClick={props.onAdd}>
                + Add team
              </button>
            </Match>
            <Match when={index() === 0 && props.teams.length === 0}>
              <p class="roster-slot roster-slot-error" role="alert">
                Pick a team to save
              </p>
            </Match>
          </Switch>
        )}
      </For>
    </div>
  );
}
