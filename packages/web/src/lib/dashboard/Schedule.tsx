import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { createMemo, For, Show } from "solid-js";

import { getSportsLogo } from "../catalog/sports/index.js";
import type { ScheduleRow } from "./schedule.js";

// A previewed team fades everyone else's games; a pinned team collapses them,
// so its own slide up together.
export function Schedule(props: {
  readonly rows: readonly ScheduleRow[];
  readonly previewId: string | undefined;
  readonly pinnedTeam: Subject | undefined;
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
  const focusedId = () => props.pinnedTeam?.id ?? props.previewId;
  const isFocused = (row: ScheduleRow) =>
    row.team.id === focusedId() || row.opponentTeam?.id === focusedId();
  const emptyMessage = () => {
    const team = props.pinnedTeam?.details.name;
    return team
      ? `No ${team} games in the next 14 days.`
      : "No games in the next 14 days.";
  };

  return (
    <section
      class="dashboard-schedule"
      aria-labelledby="schedule-heading"
      data-focus={
        props.pinnedTeam ? "pin" : props.previewId ? "preview" : undefined
      }
    >
      <h2 id="schedule-heading" class="visually-hidden">
        Coming Up
      </h2>
      <Show
        when={props.rows.length > 0}
        fallback={<p class="dashboard-schedule-empty">{emptyMessage()}</p>}
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
        <Show when={props.pinnedTeam && !props.rows.some(isFocused)}>
          <p class="dashboard-schedule-empty">{emptyMessage()}</p>
        </Show>
      </Show>
    </section>
  );
}
