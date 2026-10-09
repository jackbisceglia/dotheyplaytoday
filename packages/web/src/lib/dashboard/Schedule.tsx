import type { Subject } from "@dtpt/core/modules/subjects/schema";
import { Array, Match } from "effect";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Show,
  untrack,
} from "solid-js";

import { getSubjectLogo } from "../catalog/index.js";
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
  readonly pinnedSubject: Subject | undefined;
}) {
  const days = createMemo(() =>
    Object.entries(
      Array.groupBy(
        props.rows.map((row, index) => ({ row, index })),
        ({ row }) => row.day,
      ),
    ),
  );
  // The pin on screen trails the prop just long enough to measure the old
  // layout, and slides run once the new one renders.
  const [pinnedSubject, setPinnedSubject] = createSignal(
    untrack(() => props.pinnedSubject),
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
    () => props.pinnedSubject,
    (team) => {
      if (
        team?.id !== pinnedSubject()?.id &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        from = new Map(movers().map((el) => [el, spot(el)]));
      }
      setPinnedSubject(team);
    },
  );
  createEffect(pinnedSubject, () => {
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

  const focusedId = () => pinnedSubject()?.id ?? props.previewId;
  const isFocused = (row: ScheduleRow) =>
    row.subjects.some((subject) => subject.id === focusedId());

  const emptyMessage = () => {
    const subject = pinnedSubject()?.details.display;
    return subject
      ? `No ${subject} events in the next 14 days.`
      : "No events in the next 14 days.";
  };

  return (
    <section
      ref={section}
      class="dashboard-schedule"
      aria-labelledby="schedule-heading"
      data-focus={
        pinnedSubject() ? "pin" : props.previewId ? "preview" : undefined
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
          {([day, rows]) => (
            <div
              class="dashboard-schedule-group"
              data-focused={
                rows.some(({ row }) => isFocused(row)) ? "true" : undefined
              }
            >
              <h3 class="dashboard-schedule-day">{day}</h3>
              <ol class="dashboard-schedule-list">
                <For each={rows}>
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
                        {getSubjectLogo(row.subjects[0].details)}
                      </span>
                      <span class="dashboard-schedule-matchup">
                        <strong>{row.title}</strong>
                        <Matchup row={row} />
                      </span>
                      <span class="dashboard-schedule-league">
                        {row.subjects[0].details.leagueId.toUpperCase()}
                      </span>
                    </li>
                  )}
                </For>
              </ol>
            </div>
          )}
        </For>
        <Show when={pinnedSubject() && !props.rows.some(isFocused)}>
          <p class="dashboard-schedule-empty">{emptyMessage()}</p>
        </Show>
      </Show>
    </section>
  );
}

function Matchup(props: { readonly row: ScheduleRow }) {
  return Match.value(props.row).pipe(
    Match.tag("sports_game", (game) => (
      <Show when={game.opponent}>
        {" "}
        <span>{game.matchup}</span>{" "}
        <Show when={game.opponentTeam} fallback={<span>{game.opponent}</span>}>
          {(team) => (
            <>
              <span aria-hidden="true">{getSubjectLogo(team().details)}</span>{" "}
              <strong>{game.opponent}</strong>
            </>
          )}
        </Show>
      </Show>
    )),
    Match.tag("mma_card", (card) => (
      <>
        <span class="ufc-card-detail">
          Matched:{" "}
          {card.subjects.map((subject) => subject.details.display).join(", ")}
        </span>
        <For each={card.fights}>
          {(fight) => (
            <span class="ufc-card-detail">
              <For each={fight.fighters}>
                {(fighter, index) => (
                  <>
                    {index() > 0 && " vs "}
                    <Show
                      when={card.subjects.some(
                        (subject) => subject.id === fighter.subjectId,
                      )}
                      fallback={fighter.title}
                    >
                      <strong>{fighter.title}</strong>
                    </Show>
                  </>
                )}
              </For>
              {fight.fighters.length === 1 && " vs Opponent TBD"}
            </span>
          )}
        </For>
        <span class="ufc-card-detail">{card.timing}</span>
      </>
    )),
    Match.exhaustive,
  );
}
