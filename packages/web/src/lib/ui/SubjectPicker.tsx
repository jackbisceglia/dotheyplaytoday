import type { Subject } from "@dtpt/core/modules/subjects/schema";
import type { ParentProps } from "solid-js";
import { createMemo, createSignal, For, Show } from "solid-js";
import { getTeams, getSportsLogo } from "../catalog/sports/index.js";
import { leagues as catalogLeagues } from "../catalog/index.js";
import { UfcPicker } from "./UfcPicker.jsx";
import { ComingSoon } from "./ComingSoon.jsx";

const comingSoonLeagues = ["EPL"] as const;

export function SubjectPicker(props: {
  readonly children?: ParentProps["children"];
  readonly errorId?: string;
  readonly subjects: readonly Subject[];
  readonly selected: ReadonlySet<string>;
  readonly rejectedSelectionId?: string | undefined;
  readonly onToggle: (subject: Subject) => void;
}) {
  const leagues = createMemo(() =>
    catalogLeagues.filter((league) =>
      props.subjects.some((subject) => subject.details.leagueId === league.id),
    ),
  );
  const teams = createMemo(() => getTeams(props.subjects));

  const [selectedLeague, setSelectedLeague] = createSignal<string>();
  const activeLeague = createMemo(() => {
    const selected = selectedLeague();
    const available = leagues();

    return available.some((league) => league.id === selected)
      ? selected
      : available[0]?.id;
  });

  return (
    <>
      <fieldset class="form-section">
        <legend class="visually-hidden">League</legend>
        <div class="league-row">
          <For each={leagues()}>
            {(league) => (
              <button
                class="league-pill"
                type="button"
                aria-pressed={activeLeague() === league.id ? "true" : "false"}
                onClick={() => setSelectedLeague(league.id)}
              >
                {league.label}
              </button>
            )}
          </For>
          <For each={comingSoonLeagues}>
            {(league) => <ComingSoon class="league-pill">{league}</ComingSoon>}
          </For>
        </div>
      </fieldset>

      {props.children}
      <fieldset
        class="form-section team-grids"
        aria-describedby={props.errorId}
      >
        <legend class="visually-hidden">Picks</legend>
        <Show when={activeLeague() === "ufc"}>
          <UfcPicker
            subjects={props.subjects}
            selected={props.selected}
            rejectedSelectionId={props.rejectedSelectionId}
            onToggle={props.onToggle}
          />
        </Show>
        <Show when={activeLeague() !== "ufc"}>
          <div class="team-grid">
            <For
              each={teams().filter(
                (team) => team.details.leagueId === activeLeague(),
              )}
            >
              {(team) => (
                <button
                  type="button"
                  class="team-card"
                  aria-pressed={props.selected.has(team.id) ? "true" : "false"}
                  data-rejected={
                    props.rejectedSelectionId === team.id ? "true" : undefined
                  }
                  onClick={() => {
                    props.onToggle(team);
                  }}
                >
                  <span class="team-glyph" aria-hidden="true">
                    {getSportsLogo(team.details)}
                  </span>
                  <span class="team-abbr">{team.details.abbreviation}</span>
                  <span class="team-name">{team.details.display}</span>
                </button>
              )}
            </For>
          </div>
        </Show>
      </fieldset>
    </>
  );
}
