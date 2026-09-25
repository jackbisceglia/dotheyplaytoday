import type { Subject } from "@dtpt/core/modules/subjects/schema";
import type { ParentProps } from "solid-js";
import { createMemo, createSignal, For } from "solid-js";
import {
  getTeams,
  getSportsLogo,
  leagues as sportsLeagues,
} from "../catalog/sports/index.js";
import { ComingSoon } from "./ComingSoon.jsx";

const comingSoonLeagues = ["EPL"] as const;

export function TeamPicker(props: {
  readonly children?: ParentProps["children"];
  readonly errorId?: string;
  readonly subjects: readonly Subject[];
  readonly selected: ReadonlySet<string>;
  readonly rejectedSelectionId?: string | undefined;
  readonly onToggle: (team: Subject) => void;
}) {
  const leagues = createMemo(() => {
    const teams = getTeams(props.subjects);
    const teamsByLeague = Object.groupBy(
      teams,
      (team) => team.details.leagueId,
    );

    return sportsLeagues
      .map((league) => ({
        ...league,
        teams: teamsByLeague[league.id] ?? [],
      }))
      .filter((league) => league.teams.length > 0);
  });

  const [selectedLeague, setSelectedLeague] = createSignal<string>();
  const activeLeague = createMemo(() => {
    const selected = selectedLeague();
    const available = leagues();

    return available.some((league) => league.id === selected)
      ? selected
      : (available[0]?.id ?? "");
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
        <legend class="visually-hidden">Teams</legend>
        <For each={leagues()}>
          {(league) => (
            <div class="team-grid" hidden={activeLeague() !== league.id}>
              <For each={league.teams}>
                {(team) => (
                  <button
                    type="button"
                    class="team-card"
                    aria-pressed={
                      props.selected.has(team.id) ? "true" : "false"
                    }
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
          )}
        </For>
      </fieldset>
    </>
  );
}
