import type { Subject } from "@dtpt/core/modules/subjects/schema";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Show,
  untrack,
} from "solid-js";

import { getSportsLogo } from "../catalog/sports/index.js";
import type { ScheduleRow } from "./schedule.js";

// A previewed team fades everyone else's games; a pinned team collapses them,
// so its own slide up together.
//
// The collapse is a FLIP: a pin change takes rows and days out of the flow at
// once, then slides the ones still in it from where they were. Leaving ones
// hold still as they fade, so they don't pile up where the gaps close. Only
// transforms and opacity animate, since animating layout stutters in WebKit.
const slide = { duration: 270, easing: "ease-out" };

type Spot = { readonly top: number; readonly inFlow: boolean };

const spot = (el: Element, rect = el.getBoundingClientRect()): Spot => ({
  top: rect.top,
  inFlow: getComputedStyle(el).position !== "absolute",
});

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
  // The pin on screen trails the prop just long enough to measure the old
  // layout, and slides run once the new one renders.
  const [pinnedTeam, setPinnedTeam] = createSignal(
    untrack(() => props.pinnedTeam),
  );
  let section: HTMLElement | undefined;
  let from: Map<Element, Spot> | undefined;
  let slides: Animation[] = [];
  const movers = () => [
    ...(section?.querySelectorAll(
      ".dashboard-schedule-day, .dashboard-schedule-row",
    ) ?? []),
  ];
  createEffect(
    () => props.pinnedTeam,
    (team) => {
      if (
        team?.id !== pinnedTeam()?.id &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        from = new Map(movers().map((el) => [el, spot(el)]));
      }
      setPinnedTeam(team);
    },
  );
  createEffect(pinnedTeam, () => {
    const before = from;
    if (!before) return;
    from = undefined;
    slides.forEach((animation) => {
      animation.cancel();
    });
    // Every read before any write, or each animation forces another layout.
    // A row off screen on both ends has nothing to show.
    const moved = movers().flatMap((el) => {
      const was = before.get(el);
      if (!was) return [];
      const rect = el.getBoundingClientRect();
      const now = spot(el, rect);
      const onScreen = (y: number) => y < innerHeight && y + rect.height > 0;
      const offset = was.top - now.top;
      return (was.inFlow || now.inFlow) &&
        Math.abs(offset) >= 1 &&
        (onScreen(was.top) || onScreen(now.top))
        ? [{ el, offset, leaving: !now.inFlow }]
        : [];
    });
    slides = moved.map(({ el, offset, leaving }) => {
      const start = `translateY(${offset.toString()}px)`;
      return el.animate(
        [{ transform: start }, { transform: leaving ? start : "none" }],
        slide,
      );
    });
  });

  const focusedId = () => pinnedTeam()?.id ?? props.previewId;
  const isFocused = (row: ScheduleRow) =>
    row.team.id === focusedId() || row.opponentTeam?.id === focusedId() ||
    row.mma?.reasons.some((reason) => reason.id === focusedId());
  const emptyMessage = () => {
    const team = pinnedTeam()?.details.name;
    return team
      ? `No ${team} games in the next 14 days.`
      : "No games in the next 14 days.";
  };

  return (
    <section
      ref={section}
      class="dashboard-schedule"
      aria-labelledby="schedule-heading"
      data-focus={
        pinnedTeam() ? "pin" : props.previewId ? "preview" : undefined
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
                        <Show
                          when={row.mma}
                          fallback={<strong>{row.teamName}</strong>}
                        >
                          {(mma) => (
                            <>
                              <strong>{row.teamName}</strong>
                              <span class="ufc-card-detail">
                                Matched:{" "}
                                {mma()
                                  .reasons.map(
                                    (reason) => reason.details.display,
                                  )
                                  .join(", ")}
                              </span>
                              <For each={mma().fights}>
                                {(fight) => (
                                  <span class="ufc-card-detail">
                                    <For each={fight.fighters}>
                                      {(fighter, index) => (
                                        <>
                                          {index() > 0 ? " vs " : ""}
                                          <Show
                                            when={mma().followedFighterIds.has(
                                              fighter.subjectId,
                                            )}
                                            fallback={fighter.title}
                                          >
                                            <strong>{fighter.title}</strong>
                                          </Show>
                                        </>
                                      )}
                                    </For>
                                    {fight.fighters.length === 1
                                      ? " vs Opponent TBD"
                                      : ""}
                                  </span>
                                )}
                              </For>
                              <span class="ufc-card-detail">
                                {mma().timing}
                              </span>
                            </>
                          )}
                        </Show>
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
        <Show when={pinnedTeam() && !props.rows.some(isFocused)}>
          <p class="dashboard-schedule-empty">{emptyMessage()}</p>
        </Show>
      </Show>
    </section>
  );
}
