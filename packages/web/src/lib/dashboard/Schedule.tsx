import { For, Show } from "solid-js";

import { getSportsLogo } from "../catalog/sports/index.js";
import type { ScheduleRow } from "./schedule.js";

export function Schedule(props: { readonly rows: readonly ScheduleRow[] }) {
  return (
    <section class="dashboard-schedule" aria-labelledby="schedule-heading">
      <h2 id="schedule-heading" class="dashboard-schedule-label">
        Coming Up
      </h2>
      <Show
        when={props.rows.length > 0}
        fallback={
          <p class="dashboard-schedule-empty">No games in the next 7 days.</p>
        }
      >
        <ol class="dashboard-schedule-list">
          <For each={props.rows}>
            {(row) => (
              <li
                class="dashboard-schedule-row"
                data-today={row.today ? "true" : undefined}
              >
                <span class="dashboard-schedule-day">{row.day}</span>
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
                <time class="dashboard-schedule-time" datetime={row.startsAt}>
                  {row.time}
                </time>
              </li>
            )}
          </For>
        </ol>
      </Show>
    </section>
  );
}
