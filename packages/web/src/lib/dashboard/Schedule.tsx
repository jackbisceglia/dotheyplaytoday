import { createMemo, For, Show } from "solid-js";

import { getSportsLogo } from "../catalog/sports/index.js";
import type { ScheduleRow } from "./schedule.js";

export function Schedule(props: {
  readonly rows: readonly ScheduleRow[];
  readonly focusedId: string | undefined;
}) {
  const days = createMemo(() => {
    const groups = new Map<string, { row: ScheduleRow; index: number }[]>();
    props.rows.forEach((row, index) => {
      const rows = groups.get(row.day);
      if (rows) rows.push({ row, index });
      else groups.set(row.day, [{ row, index }]);
    });
    return [...groups].map(([day, rows]) => ({ day, rows }));
  });
  const isFocused = (row: ScheduleRow) =>
    row.team.id === props.focusedId || row.opponentTeam?.id === props.focusedId;

  return (
    <section
      class="dashboard-schedule"
      aria-labelledby="schedule-heading"
      data-focusing={props.focusedId ? "true" : undefined}
    >
      <h2 id="schedule-heading" class="visually-hidden">
        Coming Up
      </h2>
      <Show
        when={props.rows.length > 0}
        fallback={
          <p class="dashboard-schedule-empty">No games in the next 14 days.</p>
        }
      >
        <For each={days()}>
          {(group) => (
            <div
              class="dashboard-schedule-group"
              data-focused={
                group.rows.some(({ row }) => isFocused(row))
                  ? "true"
                  : undefined
              }
            >
              <h3 class="dashboard-schedule-day">{group.day}</h3>
              <ol class="dashboard-schedule-list">
                <For each={group.rows}>
                  {({ row, index }) => (
                    <li
                      class="dashboard-schedule-row"
                      style={{ "--row-index": index }}
                      data-focused={isFocused(row) ? "true" : undefined}
                    >
                      <time
                        class="dashboard-schedule-time"
                        datetime={row.startsAt}
                      >
                        {row.time}
                      </time>
                      <span class="dashboard-schedule-glyph" aria-hidden="true">
                        {getSportsLogo(row.team.details)}
                      </span>
                      <span class="dashboard-schedule-matchup">
                        <strong>{row.teamName}</strong>
                        <Show when={row.opponent}>
                          {" "}
                          <span>{row.matchup}</span>{" "}
                          <Show
                            when={row.opponentTeam}
                            fallback={<span>{row.opponent}</span>}
                          >
                            {(team) => (
                              <>
                                <span aria-hidden="true">
                                  {getSportsLogo(team().details)}
                                </span>{" "}
                                <strong>{row.opponent}</strong>
                              </>
                            )}
                          </Show>
                        </Show>
                      </span>
                      <span class="dashboard-schedule-league">
                        {row.team.details.leagueId.toUpperCase()}
                      </span>
                    </li>
                  )}
                </For>
              </ol>
            </div>
          )}
        </For>
      </Show>
    </section>
  );
}
