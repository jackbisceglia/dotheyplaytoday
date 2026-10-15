import type { Subject } from "@dtpt/core/modules/subjects/schema";
import type { ParentProps } from "solid-js";
import { createMemo, createSignal, For, Show } from "solid-js";
import { getTeams, getSportsLogo } from "../catalog/sports/index.js";
import { leagues as catalogLeagues } from "../catalog/index.js";
import {
  getCollegeGroups,
  getCollegeTeams,
  isCollegeLeague,
  topRankedGroup,
} from "../catalog/college.js";
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
      props.subjects.some((subject) => subject.details.league.id === league.id),
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
  const leagueTeams = createMemo(() =>
    teams().filter((team) => team.details.league.id === activeLeague()),
  );

  // College leagues narrow the grid to the Top 25 or one conference.
  const [selectedGroup, setSelectedGroup] = createSignal<string>();
  const collegeGroups = createMemo(() =>
    isCollegeLeague(activeLeague())
      ? getCollegeGroups(leagueTeams())
      : undefined,
  );
  const activeGroup = createMemo(() => {
    const groups = collegeGroups();
    if (!groups) return undefined;

    const available = [
      ...(groups.ranked ? [topRankedGroup] : []),
      ...groups.conferences.map((conference) => conference.id),
    ];
    const selected = selectedGroup();

    return selected !== undefined && available.includes(selected)
      ? selected
      : available[0];
  });
  const visibleTeams = createMemo(() => {
    const group = activeGroup();

    return group === undefined
      ? leagueTeams()
      : getCollegeTeams(leagueTeams(), group);
  });

  return (
    <>
      <fieldset class="form-section">
        <legend class="visually-hidden">League</legend>
        <div class="picker-header">
          <div class="league-row">
            <For each={leagues()}>
              {(league) => (
                <button
                  class="league-pill"
                  type="button"
                  aria-pressed={activeLeague() === league.id ? "true" : "false"}
                  onClick={() => {
                    setSelectedLeague(league.id);
                    setSelectedGroup(undefined);
                  }}
                >
                  {league.label}
                </button>
              )}
            </For>
            <For each={comingSoonLeagues}>
              {(league) => (
                <ComingSoon class="league-pill">{league}</ComingSoon>
              )}
            </For>
          </div>
          <Show when={collegeGroups()}>
            {(groups) => (
              <select
                class="group-select"
                aria-label="Teams"
                onChange={(event) => {
                  setSelectedGroup(event.currentTarget.value);
                }}
              >
                <Show when={groups().ranked}>
                  <option
                    value={topRankedGroup}
                    selected={activeGroup() === topRankedGroup}
                  >
                    Top 25
                  </option>
                </Show>
                <optgroup label="Conferences">
                  <For each={groups().conferences}>
                    {(conference) => (
                      <option
                        value={conference.id}
                        selected={activeGroup() === conference.id}
                      >
                        {conference.label}
                      </option>
                    )}
                  </For>
                </optgroup>
              </select>
            )}
          </Show>
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
          <Show when={activeGroup() !== undefined}>
            <p class="visually-hidden" aria-live="polite">
              {visibleTeams().length} teams
            </p>
          </Show>
          <div class="team-grid">
            <For each={visibleTeams()}>
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
                  <Show
                    when={
                      activeGroup() === topRankedGroup &&
                      team.details.league.id === "ncaam" &&
                      team.details.league.apRank
                    }
                  >
                    {(rank) => (
                      <span class="team-rank">
                        <span class="visually-hidden">Rank </span>
                        {rank()}
                      </span>
                    )}
                  </Show>
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
