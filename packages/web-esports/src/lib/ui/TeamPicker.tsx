import type { ParentProps } from "solid-js";
import { createMemo, createSignal, For } from "solid-js";
import {
  getTeams,
  getEsportsLogo,
  games as esportsGames,
  type EsportsTeam,
} from "../catalog/esports/index.js";
import { ComingSoon } from "./ComingSoon.jsx";

const comingSoonGames = ["CS2", "VAL"] as const;

export function TeamPicker(props: {
  readonly children?: ParentProps["children"];
  readonly errorId?: string;
  readonly subjects: readonly EsportsTeam[];
  readonly selected: ReadonlySet<string>;
  readonly rejectedSelectionId?: string | undefined;
  readonly onToggle: (team: EsportsTeam) => void;
}) {
  const games = createMemo(() => {
    const teams = getTeams(props.subjects);
    const teamsByGame = Object.groupBy(teams, (team) => team.details.gameId);

    return esportsGames
      .map((game) => ({
        ...game,
        teams: teamsByGame[game.id] ?? [],
      }))
      .filter((game) => game.teams.length > 0);
  });

  const [selectedGame, setSelectedGame] = createSignal<string>();
  const activeGame = createMemo(() => {
    const selected = selectedGame();
    const available = games();

    return available.some((game) => game.id === selected)
      ? selected
      : (available[0]?.id ?? "");
  });
  return (
    <>
      <fieldset class="form-section">
        <legend class="visually-hidden">Game</legend>
        <div class="league-row">
          <For each={games()}>
            {(game) => (
              <button
                class="league-pill"
                type="button"
                aria-pressed={activeGame() === game.id ? "true" : "false"}
                onClick={() => setSelectedGame(game.id)}
              >
                {game.label}
              </button>
            )}
          </For>
          <For each={comingSoonGames}>
            {(game) => <ComingSoon class="league-pill">{game}</ComingSoon>}
          </For>
        </div>
      </fieldset>

      {props.children}
      <fieldset
        class="form-section team-grids"
        aria-describedby={props.errorId}
      >
        <legend class="visually-hidden">Teams</legend>
        <For each={games()}>
          {(game) => (
            <div class="team-grid" hidden={activeGame() !== game.id}>
              <For each={game.teams}>
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
                      {getEsportsLogo(team.details)}
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
